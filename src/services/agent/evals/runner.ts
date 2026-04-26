import type { AgentAdapter } from "../adapter";
import type {
  AgentId,
  AgentResponse,
  ChatMessage,
  ToolSchema,
} from "../../../types/agent";
import { formatForPrompt, type MemoryEntry, type UserProfile } from "../memory";
import type {
  CheckResult,
  EvalResult,
  EvalStatus,
  EvalSummary,
  TestCase,
} from "./types";

// Eval Runner — 跑一組 TestCase 並聚合結果
//
// 設計抉擇：
// 1. **Sequential 而不是 Promise.all**：
//    - 多 case 同時打 API 很容易撞 rate limit（尤其 free tier）
//    - 依序跑才能「跑完一個 case 立刻更新 UI」→ 觀感上動態，而不是轉菊花 30 秒
//    - Cost 層面：8 case 順序跑大概 8~15 秒，可接受
//
// 2. **live callback 而不是 Promise<EvalResult[]>**：
//    - 讓 UI 可以即時顯示「目前跑到第幾個 / 已 pass 幾個」
//    - 對 PM 展示這種「看得到進度」的體驗比單純等結果更有說服力
//
// 3. **錯誤獨立處理**：
//    - 某個 case adapter 失敗不應該中斷整個 suite
//    - Error 也算「跑完」，記錯誤訊息，pass count = 0

// 把 testCase.seedMemory 轉成一份暫時的 UserProfile，只用來 render memory block。
// 絕對不寫 localStorage——跑 eval 不該污染真實 user profile。
const buildSeedProfile = (
  seed: NonNullable<TestCase["seedMemory"]>,
): UserProfile => {
  const now = Date.now();
  const entries: MemoryEntry[] = seed.map((e, i) => ({
    id: `seed-${i}`,
    key: e.key,
    value: e.value,
    source: e.source,
    // 依序遞增讓 formatForPrompt 的排序穩定
    createdAt: now - (seed.length - i),
  }));
  return { entries, updatedAt: now };
};

// 跑單一 TestCase
// adapter 失敗→ EvalResult 會有 error 欄、checkResults 為空、status=error
export const runEvalCase = async (
  adapter: AgentAdapter,
  systemPrompt: string,
  tools: ToolSchema[],
  agentId: AgentId,
  testCase: TestCase,
): Promise<EvalResult> => {
  const t0 =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  const messages: ChatMessage[] = [
    {
      id: `eval_user_${testCase.id}`,
      role: "user",
      text: testCase.userMessage,
      createdAt: Date.now(),
    },
  ];

  // 若 case 帶 seedMemory，把 memory block 前置到 systemPrompt 前面。
  // 這份 memory 只作用於這一輪 adapter 呼叫，不會觸碰 localStorage，
  // 對應 production runtime 裡 useChatAgent 做的同樣 inject 動作。
  let finalSystemPrompt = systemPrompt;
  if (testCase.seedMemory && testCase.seedMemory.length > 0) {
    const seedProfile = buildSeedProfile(testCase.seedMemory);
    const memoryBlock = formatForPrompt(seedProfile);
    if (memoryBlock) {
      finalSystemPrompt = `${memoryBlock}\n\n---\n\n${systemPrompt}`;
    }
  }

  let response: AgentResponse | null = null;
  let error: string | null = null;

  try {
    response = await adapter.sendMessage(messages, finalSystemPrompt, tools, {
      agentId,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const t1 =
    typeof performance !== "undefined" ? performance.now() : Date.now();
  const latencyMs = Math.round(t1 - t0);

  // adapter 失敗 → 所有 check 都視為 fail（但標成 error 狀態，跟 logic fail 區分）
  if (error || !response) {
    return {
      caseId: testCase.id,
      status: "error",
      response: null,
      checkResults: [],
      passedCount: 0,
      totalCount: testCase.checks.length,
      latencyMs,
      error: error ?? "adapter returned null",
    };
  }

  const checkResults: CheckResult[] = testCase.checks.map((check) =>
    check(response),
  );
  const passedCount = checkResults.filter((r) => r.pass).length;
  const totalCount = checkResults.length;

  return {
    caseId: testCase.id,
    status: "done",
    response,
    checkResults,
    passedCount,
    totalCount,
    latencyMs,
    error: null,
  };
};

// 跑整組 suite
// onCaseUpdate(result, index) 會在：
//   (a) 每個 case 開始前 → 傳入 status=running 的 placeholder
//   (b) 每個 case 跑完後 → 傳入正式 EvalResult
// 方便 UI 畫轉圈 spinner 跟完成後變色
export type EvalCaseUpdate = (
  update: {
    caseId: string;
    status: EvalStatus;
    result: EvalResult | null;
  },
  index: number,
) => void;

export const runEvalSuite = async (
  adapter: AgentAdapter,
  systemPrompt: string,
  tools: ToolSchema[],
  agentId: AgentId,
  cases: TestCase[],
  onCaseUpdate?: EvalCaseUpdate,
): Promise<EvalResult[]> => {
  const results: EvalResult[] = [];

  for (let i = 0; i < cases.length; i += 1) {
    const tc = cases[i];

    // (a) 開始前通知 UI
    onCaseUpdate?.({ caseId: tc.id, status: "running", result: null }, i);

    const result = await runEvalCase(adapter, systemPrompt, tools, agentId, tc);
    results.push(result);

    // (b) 跑完通知 UI
    onCaseUpdate?.({ caseId: tc.id, status: result.status, result }, i);
  }

  return results;
};

// 把一組 EvalResult 聚合成整體 summary
export const summarize = (
  cases: TestCase[],
  results: EvalResult[],
): EvalSummary => {
  const totalCases = cases.length;

  let passedCases = 0;
  let failedCases = 0;
  let erroredCases = 0;
  let totalChecks = 0;
  let passedChecks = 0;
  let totalLatencyMs = 0;

  for (const r of results) {
    totalLatencyMs += r.latencyMs;
    totalChecks += r.totalCount;
    passedChecks += r.passedCount;

    if (r.status === "error") {
      erroredCases += 1;
    } else if (r.totalCount > 0 && r.passedCount === r.totalCount) {
      passedCases += 1;
    } else {
      failedCases += 1;
    }
  }

  return {
    totalCases,
    passedCases,
    failedCases,
    erroredCases,
    totalChecks,
    passedChecks,
    passRate: totalChecks === 0 ? 0 : passedChecks / totalChecks,
    totalLatencyMs,
  };
};

// 產出 markdown 報告（for Copy Report 按鈕）
// 目的：能直接貼 Notion / PR description 當 prompt iteration 證據
export const formatReportMarkdown = (args: {
  agentId: AgentId;
  adapterName: string;
  systemPrompt: string;
  cases: TestCase[];
  results: EvalResult[];
}): string => {
  const { agentId, adapterName, systemPrompt, cases, results } = args;
  const summary = summarize(cases, results);
  const pct = (summary.passRate * 100).toFixed(1);

  const lines: string[] = [
    `# Eval Report — ${agentId}`,
    "",
    `- **Adapter**: ${adapterName}`,
    `- **Pass Rate**: ${summary.passedChecks}/${summary.totalChecks} checks (${pct}%)`,
    `- **Cases**: ${summary.passedCases} pass / ${summary.failedCases} fail / ${summary.erroredCases} error （總 ${summary.totalCases}）`,
    `- **Total Latency**: ${summary.totalLatencyMs}ms`,
    "",
    "## System Prompt",
    "",
    "```",
    systemPrompt,
    "```",
    "",
    "## Cases",
    "",
  ];

  for (const tc of cases) {
    const r = results.find((x) => x.caseId === tc.id);
    if (!r) {
      lines.push(`### ⚪ ${tc.name} (\`${tc.id}\`) — not run`, "");
      continue;
    }

    let icon = "⚪";
    if (r.status === "error") icon = "🟠";
    else if (r.totalCount > 0 && r.passedCount === r.totalCount) icon = "🟢";
    else icon = "🔴";

    lines.push(
      `### ${icon} ${tc.name} (\`${tc.id}\`) — ${r.passedCount}/${r.totalCount} checks · ${r.latencyMs}ms`,
      "",
      `- **Tags**: ${tc.tags.join(", ")}`,
      `- **User**: ${tc.userMessage}`,
      `- **Description**: ${tc.description}`,
      "",
    );

    if (tc.seedMemory && tc.seedMemory.length > 0) {
      lines.push("**Seeded memory**（注入 systemPrompt 前綴，不寫 localStorage）", "");
      for (const m of tc.seedMemory) {
        lines.push(`- ${m.key}: ${m.value}（${m.source}）`);
      }
      lines.push("");
    }

    if (r.error) {
      lines.push("**Error**", "```", r.error, "```", "");
    }

    if (r.response?.text) {
      lines.push("**Response**", "", r.response.text, "");
    }

    if (r.response?.toolCalls && r.response.toolCalls.length > 0) {
      lines.push("**Tool Calls**", "");
      for (const tc2 of r.response.toolCalls) {
        lines.push(`- \`${tc2.name}\` → \`${JSON.stringify(tc2.input)}\``);
      }
      lines.push("");
    }

    if (r.checkResults.length > 0) {
      lines.push("**Checks**", "");
      for (const cr of r.checkResults) {
        const mark = cr.pass ? "✅" : "❌";
        lines.push(`- ${mark} \`${cr.label}\` — ${cr.reason}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
};
