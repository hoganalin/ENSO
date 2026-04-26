import type { AgentAdapter } from "./adapter";
import type {
  AgentId,
  AgentResponse,
  ChatMessage,
  ToolSchema,
} from "../../types/agent";

// Playground Runner — Prompt A/B 比較專用的純 function 層
//
// 設計原則：
// - 不走 Redux（Playground 自己用 local state 管理）
// - 不跑 tool-use loop（MVP 單輪比較：看 prompt 對 initial response 的影響）
// - Promise.all 同時送兩個 prompt，對齊 latency 參考線
//
// 為什麼不跑 tool-use loop？
// - 公平性：A/B 比較的核心是「這個 prompt 讓 agent 做了什麼決策」，
//   initial response 就涵蓋了 text 回覆 + tool 選擇兩大觀察點。
// - 可讀性：展示單輪結果遠比展示三輪 tool call chain 清楚。
// - 成本：比較每改一次 prompt 就多打幾次 API，單輪讓迭代更快。

export interface PlaygroundRunResult {
  // 成功時 response 不為 null
  response: AgentResponse | null;
  // 單次 adapter.sendMessage 的耗時（ms）
  latencyMs: number;
  // 失敗時記錄錯誤（server 回非 2xx、timeout、schema 驗證失敗等）
  error: string | null;
}

export interface PlaygroundComparison {
  a: PlaygroundRunResult;
  b: PlaygroundRunResult;
}

// 單次送 prompt：回 response + latency + error
export const runSingle = async (
  adapter: AgentAdapter,
  messages: ChatMessage[],
  systemPrompt: string,
  tools: ToolSchema[],
  agentId: AgentId,
): Promise<PlaygroundRunResult> => {
  const t0 =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  try {
    const response = await adapter.sendMessage(messages, systemPrompt, tools, {
      agentId,
    });
    const t1 =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    return {
      response,
      latencyMs: Math.round(t1 - t0),
      error: null,
    };
  } catch (err) {
    const t1 =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    return {
      response: null,
      latencyMs: Math.round(t1 - t0),
      error: err instanceof Error ? err.message : String(err),
    };
  }
};

// A/B 同時送：Promise.all → 回 { a, b }
// 失敗獨立處理：其中一邊失敗不會影響另一邊的結果
export const runComparison = async (
  adapter: AgentAdapter,
  userMessage: string,
  promptA: string,
  promptB: string,
  tools: ToolSchema[],
  agentId: AgentId,
): Promise<PlaygroundComparison> => {
  const messages: ChatMessage[] = [
    {
      id: `pg_user_${Date.now()}`,
      role: "user",
      text: userMessage,
      createdAt: Date.now(),
    },
  ];

  const [a, b] = await Promise.all([
    runSingle(adapter, messages, promptA, tools, agentId),
    runSingle(adapter, messages, promptB, tools, agentId),
  ]);

  return { a, b };
};

// 把 A/B 結果整理成 markdown，方便 copy 到 Notion / email / PR description
export const comparisonToMarkdown = (
  userMessage: string,
  agentId: AgentId,
  adapterName: string,
  promptA: string,
  promptB: string,
  comparison: PlaygroundComparison,
): string => {
  const formatResult = (label: string, prompt: string, r: PlaygroundRunResult) => {
    const lines = [
      `### ${label}`,
      "",
      "**System Prompt**",
      "```",
      prompt,
      "```",
      "",
      "**Metrics**",
      `- Latency: ${r.latencyMs}ms`,
      `- Input tokens: ${r.response?.usage?.inputTokens ?? "—"}`,
      `- Output tokens: ${r.response?.usage?.outputTokens ?? "—"}`,
      `- Stop reason: ${r.response?.stopReason ?? "—"}`,
      `- Tool calls: ${r.response?.toolCalls?.length ?? 0}`,
      "",
    ];
    if (r.error) {
      lines.push("**Error**", "```", r.error, "```", "");
    }
    if (r.response?.text) {
      lines.push("**Response**", "", r.response.text, "");
    }
    if (r.response?.toolCalls && r.response.toolCalls.length > 0) {
      lines.push("**Tool Calls**", "");
      for (const tc of r.response.toolCalls) {
        lines.push(
          `- \`${tc.name}\` → \`${JSON.stringify(tc.input)}\``,
        );
      }
      lines.push("");
    }
    return lines.join("\n");
  };

  return [
    `# Prompt A/B Comparison`,
    "",
    `- **Agent**: ${agentId}`,
    `- **Adapter**: ${adapterName}`,
    `- **User Message**: ${userMessage}`,
    "",
    "---",
    "",
    formatResult("Prompt A", promptA, comparison.a),
    "---",
    "",
    formatResult("Prompt B", promptB, comparison.b),
  ].join("\n");
};
