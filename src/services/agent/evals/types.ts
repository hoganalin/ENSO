import type { AgentId, AgentResponse } from "../../../types/agent";

// Eval Suite — 型別定義
//
// 核心概念：
// TestCase 描述一個「使用者情境 + 預期行為」。
// Check 是一個 pure function，看 agent 的 response 就決定 pass / fail。
// 一個 TestCase 有多個 Check（multi-criteria 評分）。
// EvalResult 聚合每個 case 的跑完結果。

// 單一檢查的結果
export interface CheckResult {
  pass: boolean;
  // 人讀得懂的理由，fail 時特別重要
  reason: string;
  // 顯示用的 check 名稱
  label: string;
}

// Check 是 factory 產生的判斷函式
// 接 AgentResponse → 回 CheckResult
export type Check = (response: AgentResponse | null) => CheckResult;

// seedMemory 用來在 eval 跑前，模擬「這個使用者之前已經留下某些偏好記憶」。
// Runner 會用這份 seed 呼叫 formatForPrompt 產生 memory block 前置到 systemPrompt，
// 不會寫入 localStorage（跑 eval 不該污染實際使用者 profile）。
// 典型用途：regression 測試「memory 已涵蓋的維度 agent 不該再重問」。
export interface SeedMemoryEntry {
  key: string;
  value: string;
  source: AgentId;
}

// 一個測試案例
export interface TestCase {
  id: string;
  // 顯示名稱（UI 上會看到）
  name: string;
  // 測試這個 case 是為了驗證什麼
  description: string;
  // 模擬的 user message
  userMessage: string;
  // 一組 rule-based 檢查
  checks: Check[];
  // 這個 case 預期哪個 agent 來回應（用於標記，不參與評分）
  expectedAgent: AgentId;
  // 分類 tag（UI 上分群用）
  tags: ("happy-path" | "edge-case" | "safety" | "handoff" | "memory")[];
  // 選填：在跑這個 case 前，在 systemPrompt 前置注入一份模擬的 memory。
  // 不會真的寫到 localStorage，只作用於這一輪 adapter 呼叫。
  seedMemory?: SeedMemoryEntry[];
}

// Eval 跑到哪個狀態
export type EvalStatus = "pending" | "running" | "done" | "error";

// 一個 case 跑完的結果
export interface EvalResult {
  caseId: string;
  status: EvalStatus;
  // adapter 回的原始 response（給展開 UI 看細節用）
  response: AgentResponse | null;
  // 每個 check 的結果
  checkResults: CheckResult[];
  // 本 case 的得分（passed / total）
  passedCount: number;
  totalCount: number;
  // 耗時
  latencyMs: number;
  // adapter 層錯誤（timeout / 500 etc）
  error: string | null;
}

// 聚合多個 case 的整體成績
export interface EvalSummary {
  totalCases: number;
  passedCases: number; // 所有 check 都通過的 case 數
  failedCases: number;
  erroredCases: number;
  totalChecks: number;
  passedChecks: number;
  // 整體 pass rate（checks 層次，不是 case 層次）
  passRate: number; // 0~1
  totalLatencyMs: number;
}
