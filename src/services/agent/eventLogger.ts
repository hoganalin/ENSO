// Cross-repo Agent Event logger
//
// Fire-and-forget：任何錯誤只 console.warn，不影響呼叫端流程
// 寫入 Next.js 的 /api/events（same-origin，所以不需要 CORS）
// Backend (ENSO-BackEnd) 之後透過 GET /api/events 讀這些事件

import type {
  AgentEvent,
  ConversationTurnEvent,
  EvalFailedCaseSummary,
  EvalRunEvent,
  HandoffEvent,
  OrderPlacedEvent,
  ToolCallSnapshot,
  ToolConvertedEvent,
} from "../../types/agent-events";
import type { AgentId } from "../../types/agent";

const EVENTS_ENDPOINT = "/api/events";

async function postEvent(event: AgentEvent): Promise<void> {
  try {
    const res = await fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      // 不拋，只警告；避免吞掉使用者對話或 eval 結果
      const detail = await res.text().catch(() => "");
      console.warn(
        `[eventLogger] POST /api/events ${res.status}: ${detail.slice(0, 200)}`,
      );
    }
  } catch (err) {
    console.warn("[eventLogger] post failed", err);
  }
}

export function logConversationTurn(args: {
  agentId: AgentId;
  userMessage: string;
  assistantText: string;
  toolCalls: ToolCallSnapshot[];
  latencyMs: number;
  tokenUsage?: { inputTokens: number; outputTokens: number };
  stopReason?: string;
  sessionId?: string;
}): void {
  const event: ConversationTurnEvent = {
    kind: "conversation_turn",
    timestamp: new Date().toISOString(),
    intent: null,
    ...args,
  };
  void postEvent(event);
}

export function logHandoff(args: {
  from: AgentId;
  to: AgentId;
  reason: string;
  sessionId?: string;
}): void {
  const event: HandoffEvent = {
    kind: "handoff",
    timestamp: new Date().toISOString(),
    ...args,
  };
  void postEvent(event);
}

// Phase F: 商業成果事件
//
// tool_converted：只在 add_to_cart（或 remove_from_cart）的 executor 真的回報成功時 log。
// 這跟直接從 conversation_turn.toolCalls 裡撈不同——toolCalls 是「agent 呼叫了」，
// 但是否「成功改變購物車」是 executor 回報的。用成功事件算轉換率才不會高估。
export function logToolConverted(args: {
  sessionId: string;
  agentId: AgentId;
  toolName: string;
  productId?: string;
  productTitle?: string;
  qty?: number;
}): void {
  const event: ToolConvertedEvent = {
    kind: "tool_converted",
    timestamp: new Date().toISOString(),
    ...args,
  };
  void postEvent(event);
}

// order_placed：checkout 流程結束 + 後端確認 paid 後發。
// 即使訂單沒付款，我們一樣 log（總轉換漏斗看的是「有沒有走到下單那一步」）。
export function logOrderPlaced(args: {
  sessionId: string;
  orderId: string;
  total: number;
  itemCount: number;
}): void {
  const event: OrderPlacedEvent = {
    kind: "order_placed",
    timestamp: new Date().toISOString(),
    ...args,
  };
  void postEvent(event);
}

export function logEvalRun(args: {
  agentId: AgentId;
  passRate: number;
  total: number;
  passed: number;
  failed: number;
  errored: number;
  failedCases: EvalFailedCaseSummary[];
  systemPromptSnippet: string;
  adapterName: string;
}): void {
  const event: EvalRunEvent = {
    kind: "eval_run",
    timestamp: new Date().toISOString(),
    ...args,
  };
  void postEvent(event);
}
