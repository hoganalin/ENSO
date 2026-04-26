import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

import type { CandidateCase } from "../../../types/candidate-case";

// Route Handler: /api/candidate-cases
//
// GET     — 列出所有提案（可 filter by status / agentId）
// POST    — 新增一筆提案（從後台 Live Trace「加進 regression」按鈕）
// PATCH   — 更新狀態（approve / archive / mark exported）
// OPTIONS — CORS preflight，允許 ENSO-BackEnd（:5173）跨 origin 呼叫
//
// 儲存：data/candidate-cases.json（append-only JSON array）
// 並行安全：demo scale，同時寫入機率低；上線要換 DB

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "candidate-cases.json");

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

async function readCases(): Promise<CandidateCase[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CandidateCase[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeCases(cases: CandidateCase[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(cases, null, 2), "utf-8");
}

// 最低限度的 POST 驗證：只擋 obvious 髒資料；
// status 在 POST 固定設成 'proposed'，所以 caller 不需要帶
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

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // 可選
  const agentId = url.searchParams.get("agentId");

  try {
    let cases = await readCases();
    if (status) cases = cases.filter((c) => c.status === status);
    if (agentId) cases = cases.filter((c) => c.agentId === agentId);

    // 最新在前
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
    const cases = await readCases();
    cases.push(candidate);
    await writeCases(cases);
    return NextResponse.json(
      { ok: true, case: candidate, total: cases.length },
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
// 允許後台審核時改 status（approve/archive/exported）。
// 其他欄位維持不可改，因為他們是 regression 的 ground truth。
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
    const cases = await readCases();
    const idx = cases.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { error: `Case not found: ${id}` },
        { status: 404, headers: corsHeaders(origin) },
      );
    }
    cases[idx] = {
      ...cases[idx],
      status: nextStatus as CandidateCase["status"],
    };
    await writeCases(cases);
    return NextResponse.json(
      { ok: true, case: cases[idx] },
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
