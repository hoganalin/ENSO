"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import EvalCaseCard from "./EvalCaseCard";
import EvalScoreboard from "./EvalScoreboard";

import {
  AGENT_REGISTRY,
  AGENT_TOOLS,
  getAgentAdapter,
  getToolsForAgent,
} from "../../services/agent";
import { logEvalRun } from "../../services/agent/eventLogger";
import {
  XIAOHE_TEST_CASES,
  XIAOXIANG_TEST_CASES,
} from "../../services/agent/evals/testCases";
import {
  formatReportMarkdown,
  runEvalSuite,
  summarize,
} from "../../services/agent/evals/runner";

import type {
  EvalResult,
  EvalStatus,
  EvalSummary,
  TestCase,
} from "../../services/agent/evals/types";
import type { AgentId } from "../../types/agent";
import type { EvalFailedCaseSummary } from "../../types/agent-events";

// EvalSuite — 批次 eval 主容器
//
// UX 設計：
// 1. System prompt 可編輯 + baseline 預填 → 能現場演示「改 prompt → rerun → pass rate 改變」
// 2. 跑起來時一個一個 case 出結果（sequential + callback），觀感比「等 30 秒一次出」強
// 3. Scoreboard 放最上面、Cases 清單在下方，每個 case 預設收合
//
// Agent 選擇：MVP 只跑小禾的 test cases（Sales Agent 對應 PalUp JD）。
// 未來要擴充到小香／小管，改成 per-agent test case map 即可。

// case 層級的執行狀態追蹤
interface CaseRunState {
  status: EvalStatus;
  result: EvalResult | null;
}

const initialCaseStates = (count: number): CaseRunState[] =>
  Array.from({ length: count }, () => ({ status: "pending", result: null }));

// 每個 agent 對應自己的 test case suite。
// 小禾專注 Sales 行為，小香專注 RAG grounding；之後要加小管也在這加一筆。
const AGENT_SUITES: Record<
  string,
  { agentId: AgentId; cases: TestCase[]; label: string }
> = {
  xiaohe: {
    agentId: "xiaohe",
    cases: XIAOHE_TEST_CASES,
    label: "小禾（Sales）",
  },
  xiaoxiang: {
    agentId: "xiaoxiang",
    cases: XIAOXIANG_TEST_CASES,
    label: "小香（Knowledge / RAG）",
  },
};

export default function EvalSuite(): JSX.Element {
  // ==== State ====
  // 選哪個 agent suite。切換會重置 systemPrompt + caseStates。
  const [agentKey, setAgentKey] = useState<keyof typeof AGENT_SUITES>("xiaohe");
  const AGENT_ID = AGENT_SUITES[agentKey].agentId;
  const TEST_CASES = AGENT_SUITES[agentKey].cases;

  const [systemPrompt, setSystemPrompt] = useState<string>(
    AGENT_REGISTRY[AGENT_ID].systemPrompt,
  );
  const [caseStates, setCaseStates] = useState<CaseRunState[]>(
    initialCaseStates(TEST_CASES.length),
  );
  const [running, setRunning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 切換 agent 時重置
  useEffect(() => {
    setSystemPrompt(AGENT_REGISTRY[AGENT_ID].systemPrompt);
    setCaseStates(initialCaseStates(TEST_CASES.length));
  }, [agentKey, AGENT_ID, TEST_CASES.length]);

  // Adapter name 要在 useEffect 讀，避免 SSR hydration mismatch
  const [adapterName, setAdapterName] = useState<string>("mock");
  useEffect(() => {
    setAdapterName(getAgentAdapter().name);
  }, []);
  const isMockAdapter = adapterName === "mock";

  const currentAgent = AGENT_REGISTRY[AGENT_ID];
  const toolsForAgent = useMemo(
    () => getToolsForAgent(AGENT_ID, AGENT_TOOLS),
    [AGENT_ID],
  );

  // ==== Derived ====
  const completedResults: EvalResult[] = useMemo(
    () =>
      caseStates
        .map((cs) => cs.result)
        .filter((r): r is EvalResult => r !== null),
    [caseStates],
  );
  const summary: EvalSummary = useMemo(
    () => summarize(TEST_CASES, completedResults),
    [TEST_CASES, completedResults],
  );
  const completedCount = completedResults.length;

  // ==== Handlers ====

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setToast(null);
    setCaseStates(initialCaseStates(TEST_CASES.length));

    // 累計實際結果以便跑完後 log event（不依賴 React state 非同步 flush）
    const collectedResults: EvalResult[] = new Array(TEST_CASES.length).fill(
      null,
    );

    try {
      const adapter = getAgentAdapter();
      await runEvalSuite(
        adapter,
        systemPrompt,
        toolsForAgent,
        AGENT_ID,
        TEST_CASES,
        ({ status, result }, index) => {
          setCaseStates((prev) => {
            const next = prev.slice();
            next[index] = { status, result };
            return next;
          });
          if (result) collectedResults[index] = result;
        },
      );

      // 跨 repo event log：eval_run 完成
      const done = collectedResults.filter((r): r is EvalResult => r !== null);
      const passed = done.filter(
        (r) => r.status === "done" && r.passedCount === r.totalCount,
      ).length;
      const errored = done.filter((r) => r.status === "error").length;
      const failed = done.length - passed - errored;
      const failedCases: EvalFailedCaseSummary[] = done
        .filter(
          (r) =>
            r.status === "error" ||
            (r.status === "done" && r.passedCount < r.totalCount),
        )
        .map((r) => {
          const tc = TEST_CASES.find((c: TestCase) => c.id === r.caseId);
          const firstFailReason = r.error
            ? r.error
            : r.checkResults.find((c) => !c.pass)?.reason ?? "unknown";
          return {
            id: r.caseId,
            title: tc?.name ?? r.caseId,
            reason: firstFailReason,
            category: tc?.tags?.[0],
          };
        });

      logEvalRun({
        agentId: AGENT_ID,
        passRate: done.length > 0 ? passed / done.length : 0,
        total: done.length,
        passed,
        failed,
        errored,
        failedCases,
        systemPromptSnippet: systemPrompt.slice(0, 200),
        adapterName,
      });
    } catch (err) {
      setToast(
        `執行失敗：${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setRunning(false);
    }
  }, [
    AGENT_ID,
    TEST_CASES,
    adapterName,
    running,
    systemPrompt,
    toolsForAgent,
  ]);

  const handleResetPrompt = useCallback(() => {
    setSystemPrompt(AGENT_REGISTRY[AGENT_ID].systemPrompt);
  }, [AGENT_ID]);

  const handleCopyReport = useCallback(async () => {
    if (completedResults.length === 0) return;
    const md = formatReportMarkdown({
      agentId: AGENT_ID,
      adapterName,
      systemPrompt,
      cases: TEST_CASES,
      results: completedResults,
    });
    try {
      await navigator.clipboard.writeText(md);
      setToast("✓ Report 已複製到剪貼簿");
      setTimeout(() => setToast(null), 2000);
    } catch {
      setToast("複製失敗，請手動選取");
      setTimeout(() => setToast(null), 3000);
    }
  }, [AGENT_ID, TEST_CASES, adapterName, completedResults, systemPrompt]);

  // ==== Render ====
  return (
    <div className="pg-root">
      {/* Top bar */}
      <header className="pg-topbar">
        <div className="pg-topbar-left">
          <Link href="/playground" className="pg-home-link" aria-label="回 Playground">
            ←
          </Link>
          <div className="pg-brand">
            <span className="pg-brand-emoji">📊</span>
            <span className="pg-brand-text">Eval Suite</span>
          </div>
          <span className="pg-brand-subtitle">ENSO Agent Lab</span>
        </div>

        <div className="pg-topbar-right">
          <div className="pg-topbar-field">
            <span className="pg-field-label">Agent Suite</span>
            <select
              className="pg-eval-agent-select"
              value={agentKey}
              onChange={(e) =>
                setAgentKey(e.target.value as keyof typeof AGENT_SUITES)
              }
              disabled={running}
              aria-label="選擇要測試的 agent"
            >
              {Object.entries(AGENT_SUITES).map(([key, suite]) => (
                <option key={key} value={key}>
                  {AGENT_REGISTRY[suite.agentId].avatar} {suite.label} ({suite.cases.length})
                </option>
              ))}
            </select>
          </div>

          <div className="pg-topbar-field">
            <span className="pg-field-label">Provider</span>
            <span
              className={`pg-provider pg-provider-${isMockAdapter ? "mock" : "live"}`}
            >
              {adapterName}
            </span>
          </div>
        </div>
      </header>

      {isMockAdapter && (
        <div className="pg-banner pg-banner-warn">
          <span>
            ⚠️ <strong>Mock mode</strong>：Mock 回應不受 system prompt 影響，
            這個 page 的 pass rate 只能驗證 Eval 框架本身，<strong>無法</strong>
            反映 prompt 好壞。想看真實 prompt 效果，請設
            <code>NEXT_PUBLIC_AGENT_PROVIDER=server</code> +
            <code>ANTHROPIC_API_KEY</code>。
          </span>
        </div>
      )}

      <main className="pg-eval-main">
        {/* System prompt editor */}
        <section className="pg-eval-prompt-section">
          <div className="pg-eval-prompt-header">
            <h2 className="pg-eval-section-title">System Prompt</h2>
            <div className="pg-eval-prompt-actions">
              <span className="pg-eval-char-count">
                {systemPrompt.length} chars
              </span>
              <button
                type="button"
                className="pg-btn pg-btn-ghost"
                onClick={handleResetPrompt}
                disabled={running}
              >
                Reset to baseline
              </button>
            </div>
          </div>
          <textarea
            className="pg-eval-prompt-textarea"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            disabled={running}
            spellCheck={false}
            aria-label="System prompt editor"
          />
          <div className="pg-hint">
            💡 改 prompt → 按 Run Eval → 看 pass rate 變化。同一組 case 可以跑多次，
            對比「原版 prompt 72%」vs「加了邊界守則後 85%」這種具體改善。
          </div>
        </section>

        {/* Scoreboard + Run button row */}
        <section className="pg-eval-scoreboard-row">
          <EvalScoreboard
            summary={summary}
            running={running}
            completedCount={completedCount}
          />
          <div className="pg-eval-run-actions">
            <button
              type="button"
              className="pg-btn pg-btn-primary pg-btn-lg"
              onClick={handleRun}
              disabled={running}
            >
              {running ? "Running…" : `Run Eval ▶ (${TEST_CASES.length} cases)`}
            </button>
            <button
              type="button"
              className="pg-btn pg-btn-secondary"
              onClick={handleCopyReport}
              disabled={running || completedResults.length === 0}
              aria-label="Copy eval report as Markdown"
            >
              📋 Copy Report
            </button>
          </div>
        </section>

        {toast && (
          <div className="pg-toast" role="status">
            {toast}
          </div>
        )}

        {/* Case list */}
        <section className="pg-eval-cases">
          <h2 className="pg-eval-section-title">Test Cases</h2>
          <div className="pg-eval-case-list">
            {TEST_CASES.map((tc, i) => {
              const cs = caseStates[i] ?? { status: "pending", result: null };
              return (
                <EvalCaseCard
                  key={tc.id}
                  testCase={tc}
                  status={cs.status}
                  result={cs.result}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
