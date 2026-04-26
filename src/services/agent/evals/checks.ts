import type { Check, CheckResult } from "./types";
import type { AgentResponse } from "../../../types/agent";

// Rule-based Check primitives
//
// 每個函式是一個 factory：接「期望值」回一個 Check。
// Check 接 AgentResponse 回 CheckResult。
//
// MVP 故意不走 LLM-as-judge 路線：
// - 成本：每個 case 多一次 API call 太貴
// - 穩定性：judge 分數會 jitter，rule-based 重現性 100%
// - 訊號清晰：「你 prompt 沒教 agent 呼叫 tool」這種事 rule-based 一句話講清楚，判例無爭議

// ---- helpers ----
const fail = (label: string, reason: string): CheckResult => ({
  pass: false,
  reason,
  label,
});
const pass = (label: string, reason = "OK"): CheckResult => ({
  pass: true,
  reason,
  label,
});

const normText = (s: string | undefined): string =>
  (s ?? "").toLowerCase().trim();

// ============================================================
// Tool 相關 checks
// ============================================================

// 有呼叫指定 tool（可傳單一 name 或 name 陣列，陣列代表 OR）
export const hasToolCall = (name: string | string[]): Check => {
  const expected = Array.isArray(name) ? name : [name];
  const label = `hasToolCall(${expected.join(" OR ")})`;
  return (response) => {
    const calls = response?.toolCalls ?? [];
    const hit = calls.find((c) => expected.includes(c.name));
    return hit
      ? pass(label, `called ${hit.name}`)
      : fail(
          label,
          calls.length === 0
            ? "沒有任何 tool call"
            : `只 call 了 ${calls.map((c) => c.name).join(", ")}`,
        );
  };
};

// 沒有呼叫任何 tool（閒聊跳針類 case 用）
export const noToolCall = (): Check => {
  const label = "noToolCall";
  return (response) => {
    const calls = response?.toolCalls ?? [];
    return calls.length === 0
      ? pass(label)
      : fail(label, `不該呼叫 tool，但呼叫了 ${calls.map((c) => c.name).join(", ")}`);
  };
};

// 指定 tool 的某個 input 欄位有包含文字
export const toolInputContains = (
  toolName: string,
  key: string,
  needle: string,
): Check => {
  const label = `toolInputContains(${toolName}.${key} ⊃ "${needle}")`;
  return (response) => {
    const call = response?.toolCalls?.find((c) => c.name === toolName);
    if (!call) return fail(label, `沒有找到 ${toolName} 的 call`);
    const val = call.input[key];
    if (typeof val !== "string") {
      return fail(label, `${key} 不是字串（${JSON.stringify(val)}）`);
    }
    return val.includes(needle)
      ? pass(label)
      : fail(label, `input.${key}="${val}" 沒包含 "${needle}"`);
  };
};

// ============================================================
// Response text 相關 checks
// ============================================================

// Response 有包含任一關鍵字（OR 邏輯）
export const responseContainsAny = (needles: string[]): Check => {
  const label = `responseContainsAny([${needles.join(", ")}])`;
  return (response) => {
    const text = normText(response?.text);
    if (!text) return fail(label, "response 沒有文字");
    const hit = needles.find((n) => text.includes(n.toLowerCase()));
    return hit
      ? pass(label, `hit "${hit}"`)
      : fail(label, `完全沒提到任何 [${needles.join(", ")}]`);
  };
};

// Response 不該包含任何關鍵字（安全 / 冷靜類 case 用）
export const responseDoesNotContain = (needles: string[]): Check => {
  const label = `responseDoesNotContain([${needles.join(", ")}])`;
  return (response) => {
    const text = normText(response?.text);
    const hit = needles.find((n) => text.includes(n.toLowerCase()));
    return hit
      ? fail(label, `response 出現禁用詞 "${hit}"`)
      : pass(label);
  };
};

// Response 長度不超過 max（避免 agent 太囉嗦）
export const responseLengthUnder = (max: number): Check => {
  const label = `responseLengthUnder(${max})`;
  return (response) => {
    const len = (response?.text ?? "").length;
    return len <= max
      ? pass(label, `${len} chars`)
      : fail(label, `${len} > ${max} chars，太囉嗦`);
  };
};

// Response 至少有 N 字（避免 agent 消極偷懶回一句「好喔」）
export const responseLengthOver = (min: number): Check => {
  const label = `responseLengthOver(${min})`;
  return (response) => {
    const len = (response?.text ?? "").length;
    return len >= min
      ? pass(label, `${len} chars`)
      : fail(label, `${len} < ${min} chars，太敷衍`);
  };
};

// ============================================================
// Stop reason / meta
// ============================================================

export const stopReasonIs = (
  reason: NonNullable<AgentResponse["stopReason"]>,
): Check => {
  const label = `stopReasonIs(${reason})`;
  return (response) => {
    const r = response?.stopReason;
    return r === reason
      ? pass(label)
      : fail(label, `實際 stopReason=${r ?? "(null)"}`);
  };
};

// Response 不為空（text 或 toolCalls 至少要有一個）
export const responseNotEmpty = (): Check => {
  const label = "responseNotEmpty";
  return (response) => {
    if (!response) return fail(label, "response 是 null");
    const hasText = (response.text ?? "").trim().length > 0;
    const hasToolCalls = (response.toolCalls ?? []).length > 0;
    return hasText || hasToolCalls
      ? pass(label)
      : fail(label, "text 跟 toolCalls 都空");
  };
};
