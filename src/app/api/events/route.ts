import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

import type { AgentEvent } from "../../../types/agent-events";

// Route Handler: /api/events
//
// GET    — 讀取事件 stream（可 filter by kind / since / limit）
// POST   — 追加單一事件（client fire-and-forget；driver 自行保證 shape）
// OPTIONS — CORS preflight，允許 ENSO-BackEnd 跨 origin 呼叫
//
// 儲存策略：
// - Production / 有 Redis env：Upstash Redis LIST（RPUSH append、LRANGE 讀）
//   這是因為 Vercel serverless filesystem 是 read-only，fs.writeFile 會 EROFS。
// - Dev 沒設 Redis env：fallback 到 data/agent-events.json，本機開發無痛。
// - LIST 上限 LIST_MAX 筆，超過用 LTRIM 砍掉舊的。

export const runtime = "nodejs"; // fs 需要 Node runtime
export const dynamic = "force-dynamic"; // 不 cache

const DATA_FILE = path.join(process.cwd(), "data", "agent-events.json");
const REDIS_KEY = "enso:agent_events";
const LIST_MAX = 5000; // 保留最多 5000 筆，避免 free tier 容量爆掉

// 開發階段允許 localhost:5173（Vite default）。要擴充到 staging/production
// 再把這個 list 從 env 讀。
const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

// ============== Storage abstraction ==============
// 兩種 backend：Redis（production / 有 env）、fs（dev fallback）

type Storage = {
  list(): Promise<AgentEvent[]>;
  append(event: AgentEvent): Promise<void>;
};

let cachedRedis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;
  // Vercel Marketplace 連 Upstash 時可能注入 KV_* 或 UPSTASH_REDIS_* 兩種命名，
  // 都試一次，無則回 null，落 fs fallback。
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    cachedRedis = null;
    return null;
  }
  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

const redisStorage: Storage = {
  async list() {
    const redis = getRedis();
    if (!redis) return [];
    // RPUSH 加在尾，LRANGE 0 -1 取全部，最後再依 timestamp 排序
    const items = await redis.lrange<AgentEvent>(REDIS_KEY, 0, -1);
    return items.filter((e): e is AgentEvent => !!e && typeof e === "object");
  },
  async append(event) {
    const redis = getRedis();
    if (!redis) return;
    await redis.rpush(REDIS_KEY, event);
    // 限制 list 長度，超過砍掉舊的（保留最新 LIST_MAX 筆）
    await redis.ltrim(REDIS_KEY, -LIST_MAX, -1);
  },
};

const fsStorage: Storage = {
  async list() {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as AgentEvent[]) : [];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  },
  async append(event) {
    const events = await fsStorage.list();
    events.push(event);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
  },
};

function getStorage(): Storage {
  return getRedis() ? redisStorage : fsStorage;
}

// 最低限度 shape 檢查（避免手滑寫入髒資料）
function isValidEvent(raw: unknown): raw is AgentEvent {
  if (!raw || typeof raw !== "object") return false;
  const e = raw as Record<string, unknown>;
  if (typeof e.kind !== "string" || typeof e.timestamp !== "string") return false;
  return (
    e.kind === "conversation_turn" ||
    e.kind === "handoff" ||
    e.kind === "eval_run" ||
    e.kind === "tool_converted" ||
    e.kind === "order_placed"
  );
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind"); // 可選：filter 單一 kind
  const since = url.searchParams.get("since"); // ISO timestamp
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Math.max(1, Math.min(1000, parseInt(limitRaw, 10))) : 500;

  try {
    let events = await getStorage().list();

    if (kind) {
      events = events.filter((e) => e.kind === kind);
    }
    if (since) {
      const sinceMs = Date.parse(since);
      if (!Number.isNaN(sinceMs)) {
        events = events.filter((e) => Date.parse(e.timestamp) >= sinceMs);
      }
    }

    // 最新在前
    const sorted = [...events].sort(
      (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
    );
    const result = sorted.slice(0, limit);

    return NextResponse.json(
      { events: result, total: events.length },
      { headers: corsHeaders(origin) },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/events GET]", msg);
    return NextResponse.json(
      { error: "Failed to read events", detail: msg },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  if (!isValidEvent(body)) {
    return NextResponse.json(
      {
        error:
          "Invalid event shape. Required: { kind: 'conversation_turn'|'handoff'|'eval_run'|'tool_converted'|'order_placed', timestamp: ISO string, ... }",
      },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  try {
    await getStorage().append(body);
    return NextResponse.json(
      { ok: true },
      { status: 201, headers: corsHeaders(origin) },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/events POST]", msg);
    return NextResponse.json(
      { error: "Failed to write event", detail: msg },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}
