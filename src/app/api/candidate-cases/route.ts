import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

import type { CandidateCase } from "../../../types/candidate-case";

// Route Handler: /api/candidate-cases
//
// GET     — 列出所有提案（可 filter by status / agentId）
// POST    — 新增一筆提案（從後台 Live Trace「加進 regression」按鈕）
// PATCH   — 更新狀態（approve / archive / mark exported）
// OPTIONS — CORS preflight，允許 ENSO-BackEnd 跨 origin 呼叫
//
// 儲存策略（跟 /api/events 同一套 pattern）：
// - Production / 有 Redis env：Upstash Redis LIST（RPUSH append、LRANGE 讀、LSET 改）
//   Vercel serverless filesystem 是 read-only，fs.writeFile 會 EROFS。
// - Dev 沒設 Redis env：fallback 到 data/candidate-cases.json。
//
// PATCH 並行性：LRANGE→findIndex→LSET 不是原子操作。demo 規模單一運營審核，
// 並發機率低；上線要換 Lua script 或改 HASH 結構。

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "candidate-cases.json");
const REDIS_KEY = "enso:candidate_cases";
const LIST_MAX = 1000; // candidate cases 不會像 events 那麼多

const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

// ============== Storage abstraction ==============

type Storage = {
  list(): Promise<CandidateCase[]>;
  append(c: CandidateCase): Promise<void>;
  /** 用 id 找 + 部份 patch 後寫回；找不到回 null */
  patch(id: string, partial: Partial<CandidateCase>): Promise<CandidateCase | null>;
};

let cachedRedis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;
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
    const items = await redis.lrange<CandidateCase>(REDIS_KEY, 0, -1);
    return items.filter(
      (c): c is CandidateCase => !!c && typeof c === "object",
    );
  },
  async append(c) {
    const redis = getRedis();
    if (!redis) return;
    await redis.rpush(REDIS_KEY, c);
    await redis.ltrim(REDIS_KEY, -LIST_MAX, -1);
  },
  async patch(id, partial) {
    const redis = getRedis();
    if (!redis) return null;
    // 注意：非原子。demo scale OK；上線換 Lua script 包成原子。
    const all = await redis.lrange<CandidateCase>(REDIS_KEY, 0, -1);
    const idx = all.findIndex((c) => c?.id === id);
    if (idx === -1) return null;
    const updated: CandidateCase = { ...all[idx], ...partial };
    await redis.lset(REDIS_KEY, idx, updated);
    return updated;
  },
};

const fsStorage: Storage = {
  async list() {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CandidateCase[]) : [];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  },
  async append(c) {
    const cases = await fsStorage.list();
    cases.push(c);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2), "utf-8");
  },
  async patch(id, partial) {
    const cases = await fsStorage.list();
    const idx = cases.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    cases[idx] = { ...cases[idx], ...partial };
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2), "utf-8");
    return cases[idx];
  },
};

function getStorage(): Storage {
  return getRedis() ? redisStorage : fsStorage;
}

// ============== Validation ==============

// POST 的 body 不該帶 id / createdAt / status（這三欄由 server 補）
function isValidCreatePayload(
  raw: unknown,
): raw is Omit<CandidateCase, "id" | "createdAt" | "status"> {
  if (!raw || typeof raw !== "object") return false;
  const c = raw as Record<string, unknown>;
  if (typeof c.userMessage !== "string" || c.userMessage.trim() === "")
    return false;
  if (typeof c.expectedBehavior !== "string") return false;
  if (typeof c.why !== "string") return false;
  if (
    c.agentId !== "xiaohe" &&
    c.agentId !== "xiaoxiang" &&
    c.agentId !== "xiaoguan" &&
    c.agentId !== "xiaodian"
  )
    return false;
  if (c.source !== "live_trace" && c.source !== "manual") return false;
  if (!Array.isArray(c.tags)) return false;
  return true;
}

function genId(): string {
  return `cand_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============== Handlers ==============

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const agentId = url.searchParams.get("agentId");

  try {
    let cases = await getStorage().list();
    if (status) cases = cases.filter((c) => c.status === status);
    if (agentId) cases = cases.filter((c) => c.agentId === agentId);

    const sorted = [...cases].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );

    return NextResponse.json(
      { cases: sorted, total: cases.length },
      { headers: corsHeaders(origin) },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/candidate-cases GET]", msg);
    return NextResponse.json(
      { error: "Failed to read cases", detail: msg },
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

  if (!isValidCreatePayload(body)) {
    return NextResponse.json(
      {
        error:
          "Invalid payload. Required: { source, agentId, userMessage, expectedBehavior, why, tags[] }",
      },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const candidate: CandidateCase = {
    ...body,
    id: genId(),
    createdAt: new Date().toISOString(),
    status: "proposed",
  };

  try {
    await getStorage().append(candidate);
    return NextResponse.json(
      { ok: true, case: candidate },
      { status: 201, headers: corsHeaders(origin) },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/candidate-cases POST]", msg);
    return NextResponse.json(
      { error: "Failed to write case", detail: msg },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}

// PATCH /api/candidate-cases  body: { id, status }
// 只允許改 status；其他欄位是 regression 的 ground truth，禁止後改。
export async function PATCH(req: Request) {
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

  const b = body as Record<string, unknown>;
  const id = typeof b?.id === "string" ? b.id : null;
  const nextStatus = b?.status;
  const validStatuses: CandidateCase["status"][] = [
    "proposed",
    "approved",
    "exported",
    "archived",
  ];
  if (!id || !validStatuses.includes(nextStatus as CandidateCase["status"])) {
    return NextResponse.json(
      {
        error:
          "Invalid PATCH body. Required: { id: string, status: 'proposed'|'approved'|'exported'|'archived' }",
      },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  try {
    const updated = await getStorage().patch(id, {
      status: nextStatus as CandidateCase["status"],
    });
    if (!updated) {
      return NextResponse.json(
        { error: `Case not found: ${id}` },
        { status: 404, headers: corsHeaders(origin) },
      );
    }
    return NextResponse.json(
      { ok: true, case: updated },
      { headers: corsHeaders(origin) },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/candidate-cases PATCH]", msg);
    return NextResponse.json(
      { error: "Failed to update case", detail: msg },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}
