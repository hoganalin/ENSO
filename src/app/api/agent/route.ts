import { NextResponse } from "next/server";

import {
  ANTHROPIC_API_URL,
  ANTHROPIC_API_VERSION,
  ANTHROPIC_MAX_TOKENS,
  ANTHROPIC_MODEL_ID,
  parseAnthropicResponse,
  toAnthropicMessages,
} from "../../../services/agent/anthropicProtocol";
import type { ChatMessage, ToolSchema } from "../../../types/agent";

// Route Handler: POST /api/agent
//
// Client → POST body: { messages, systemPrompt, tools, agentId }
// Server → 呼叫 Anthropic Messages API → 回傳 AgentResponse
//
// API key 從 process.env.ANTHROPIC_API_KEY（**沒有** NEXT_PUBLIC_ 前綴，所以絕對不會進 client bundle）
// 這樣即使 demo 公開在 Vercel，key 也不會外洩。
//
// CORS：允許 ENSO-BackEnd（:5173）跨 origin 呼叫，讓後台小店（xiaodian）也能走同一個
// proxy 打 Anthropic。允許清單跟 /api/events 對齊。

// 強制 Node runtime（fetch Anthropic 需要完整網路 stack，Edge runtime 也 OK，但先用 node 保守）
export const runtime = "nodejs";

// 不要 cache
export const dynamic = "force-dynamic";

interface AgentRouteRequest {
  messages: ChatMessage[];
  systemPrompt: string;
  tools: ToolSchema[];
  agentId?: string; // 目前只做 logging 用，Anthropic 不需要
}

const TIMEOUT_MS = 30_000;

const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY not set on server. 請在 .env.local 新增 ANTHROPIC_API_KEY=sk-ant-... 並重啟 dev server。",
      },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  let body: AgentRouteRequest;
  try {
    body = (await req.json()) as AgentRouteRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const { messages, systemPrompt, tools, agentId } = body;
  if (!Array.isArray(messages) || !systemPrompt || !Array.isArray(tools)) {
    return NextResponse.json(
      { error: "Missing required fields: messages / systemPrompt / tools" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const anthropicBody = {
    model: ANTHROPIC_MODEL_ID,
    max_tokens: ANTHROPIC_MAX_TOKENS,
    system: systemPrompt,
    tools,
    messages: toAnthropicMessages(messages),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_API_VERSION,
      },
      body: JSON.stringify(anthropicBody),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      // 印在 server log 幫忙 debug，但不把 apiKey 或 body 印出來
      console.error(
        `[/api/agent] Anthropic ${res.status} (agent=${agentId})`,
        errText.slice(0, 300),
      );
      return NextResponse.json(
        {
          error: `Anthropic API error ${res.status}`,
          detail: errText.slice(0, 500),
        },
        { status: res.status, headers: corsHeaders(origin) },
      );
    }

    const data = await res.json();
    const response = parseAnthropicResponse(data);
    return NextResponse.json(response, { headers: corsHeaders(origin) });
  } catch (err) {
    clearTimeout(timeout);
    if ((err as Error).name === "AbortError") {
      return NextResponse.json(
        { error: `Anthropic request timed out after ${TIMEOUT_MS / 1000}s` },
        { status: 504, headers: corsHeaders(origin) },
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[/api/agent] unexpected`, message);
    return NextResponse.json(
      { error: "Internal error calling Anthropic", detail: message },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}
