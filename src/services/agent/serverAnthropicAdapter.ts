import type { AgentAdapter, AgentCallContext } from "./adapter";
import type { AgentResponse, ChatMessage, ToolSchema } from "../../types/agent";

// ServerAnthropicAdapter — client 端呼 /api/agent（Route Handler），由 server 端代打 Anthropic。
//
// 為什麼要有這一層：
// - API key 留在 server，不進 client bundle
// - 之後要加 rate limiting / caching / logging 時，route handler 是唯一插入點
// - 切換 provider（Anthropic → OpenAI）只需動 route handler

const AGENT_ROUTE = "/api/agent";
const CLIENT_TIMEOUT_MS = 35_000; // 比 server timeout (30s) 稍長，避免雙重逾時

export class ServerAnthropicAdapter implements AgentAdapter {
  readonly name = "claude-haiku-4.5 (server)";

  async sendMessage(
    messages: ChatMessage[],
    systemPrompt: string,
    tools: ToolSchema[],
    context?: AgentCallContext,
  ): Promise<AgentResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const res = await fetch(AGENT_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          systemPrompt,
          tools,
          agentId: context?.agentId,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        // 試著讀出 server 的 error message
        let detail = "";
        try {
          const payload = await res.json();
          detail = payload?.error || payload?.detail || "";
        } catch {
          detail = await res.text().catch(() => "");
        }
        throw new Error(`/api/agent ${res.status}: ${detail || "unknown"}`);
      }

      const data = (await res.json()) as AgentResponse;
      return data;
    } catch (err) {
      clearTimeout(timer);
      if ((err as Error).name === "AbortError") {
        throw new Error("請求逾時，請稍後重試。");
      }
      throw err;
    }
  }
}
