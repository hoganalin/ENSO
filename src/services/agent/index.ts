import type { AgentAdapter } from "./adapter";
import { MockAgentAdapter } from "./mockAdapter";
import { AnthropicAdapter } from "./anthropicAdapter";
import { ServerAnthropicAdapter } from "./serverAnthropicAdapter";

// Agent registry — 單一切換點
//
// 三種 provider：
//   - mock   ：離線 mock（預設，永遠能跑）
//   - server ：走 Next.js Route Handler /api/agent，API key 留在 server（production 推薦）
//   - direct ：client 端直打 Anthropic API，key 必須是 NEXT_PUBLIC_ANTHROPIC_API_KEY（⚠️ 只適合 local dev）
//
// 切換方式：在 .env.local 設 NEXT_PUBLIC_AGENT_PROVIDER=mock | server | direct
// 未設置時 fallback → mock（確保沒配 key 也能 demo）
//
// ⚠️ 為什麼不預設自動切 server？
// 因為 client 無法直接驗證 server 有沒有設 ANTHROPIC_API_KEY，
// 留 explicit 切換比較不會讓人誤以為 demo 壞掉。

const getAdapter = (): AgentAdapter => {
  const forced = process.env.NEXT_PUBLIC_AGENT_PROVIDER?.toLowerCase();

  if (forced === "server") {
    return new ServerAnthropicAdapter();
  }

  if (forced === "direct" || forced === "anthropic") {
    // "anthropic" 是舊名稱，保留 backward compat
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn(
        "[agent] NEXT_PUBLIC_AGENT_PROVIDER=direct 但找不到 NEXT_PUBLIC_ANTHROPIC_API_KEY，fallback 回 Mock",
      );
      return new MockAgentAdapter();
    }
    console.warn(
      "[agent] ⚠️ 使用 direct mode：API key 會被 bundle 到 client，僅限 local dev，不要部署到 production",
    );
    return new AnthropicAdapter(apiKey);
  }

  // default / mock / 其它值 → mock
  return new MockAgentAdapter();
};

// Lazy singleton
let _adapter: AgentAdapter | null = null;
export const getAgentAdapter = (): AgentAdapter => {
  if (!_adapter) _adapter = getAdapter();
  return _adapter;
};

export { AGENT_TOOLS } from "./tools";
export { SHOPPING_AGENT_SYSTEM_PROMPT } from "./systemPrompt";
export { executeToolCall } from "./toolExecutor";
export { routeMessage, type RouteDecision } from "./router";
export {
  AGENT_REGISTRY,
  DEFAULT_AGENT_ID,
  ALL_AGENT_IDS,
  getAgent,
  getToolsForAgent,
} from "./agents";
export type { AgentAdapter, AgentCallContext } from "./adapter";
