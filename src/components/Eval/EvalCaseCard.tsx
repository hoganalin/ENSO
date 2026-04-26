"use client";

import { useState } from "react";

import type { EvalResult, EvalStatus, TestCase } from "../../services/agent/evals/types";

// EvalCaseCard — 單一 case 的結果卡
// 四種視覺狀態：pending（灰）/ running（脈動）/ pass（綠）/ fail（紅）/ error（橘）
// 預設收合，點擊展開看 response / tool calls / check 細節

interface EvalCaseCardProps {
  testCase: TestCase;
  status: EvalStatus;
  result: EvalResult | null;
  defaultExpanded?: boolean;
}

// 從 status + result 決定實際視覺狀態
type Visual = "pending" | "running" | "pass" | "fail" | "error";

const computeVisual = (status: EvalStatus, result: EvalResult | null): Visual => {
  if (status === "pending") return "pending";
  if (status === "running") return "running";
  if (status === "error") return "error";
  // done
  if (!result || result.totalCount === 0) return "pending";
  return result.passedCount === result.totalCount ? "pass" : "fail";
};

const VISUAL_ICON: Record<Visual, string> = {
  pending: "⚪",
  running: "🔄",
  pass: "✅",
  fail: "❌",
  error: "⚠️",
};

const VISUAL_LABEL: Record<Visual, string> = {
  pending: "pending",
  running: "running",
  pass: "pass",
  fail: "fail",
  error: "error",
};

export default function EvalCaseCard({
  testCase,
  status,
  result,
  defaultExpanded = false,
}: EvalCaseCardProps): JSX.Element {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const visual = computeVisual(status, result);

  const scoreText = result
    ? `${result.passedCount}/${result.totalCount}`
    : `—/${testCase.checks.length}`;

  return (
    <article className={`pg-eval-card pg-eval-card-${visual}`}>
      <button
        type="button"
        className="pg-eval-card-header"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`eval-detail-${testCase.id}`}
      >
        <span className="pg-eval-card-icon" aria-label={VISUAL_LABEL[visual]}>
          {VISUAL_ICON[visual]}
        </span>

        <div className="pg-eval-card-title">
          <span className="pg-eval-card-name">{testCase.name}</span>
          <span className="pg-eval-card-id">{testCase.id}</span>
        </div>

        <div className="pg-eval-card-meta">
          {testCase.tags.map((t) => (
            <span key={t} className={`pg-eval-tag pg-eval-tag-${t}`}>
              {t}
            </span>
          ))}
          <span className="pg-eval-card-score">{scoreText}</span>
          {result && (
            <span className="pg-eval-card-latency">{result.latencyMs}ms</span>
          )}
          <span className="pg-eval-card-chevron">{expanded ? "▾" : "▸"}</span>
        </div>
      </button>

      {expanded && (
        <div id={`eval-detail-${testCase.id}`} className="pg-eval-card-body">
          <div className="pg-eval-desc">
            <strong>為什麼測這個：</strong> {testCase.description}
          </div>

          <div className="pg-eval-section">
            <div className="pg-eval-section-label">User message</div>
            <div className="pg-eval-section-content pg-eval-user">
              {testCase.userMessage}
            </div>
          </div>

          {testCase.seedMemory && testCase.seedMemory.length > 0 && (
            <div className="pg-eval-section">
              <div className="pg-eval-section-label">
                Seeded memory ({testCase.seedMemory.length}) — 注入 systemPrompt 前綴，不寫 localStorage
              </div>
              <ul className="pg-eval-checks">
                {testCase.seedMemory.map((m, idx) => (
                  <li
                    key={`${m.key}-${idx}`}
                    className="pg-eval-check pg-eval-check-ok"
                  >
                    <span className="pg-eval-check-icon" aria-hidden>
                      🧠
                    </span>
                    <code className="pg-eval-check-label">{m.key}</code>
                    <span className="pg-eval-check-reason">
                      {m.value}（{m.source}）
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {status === "pending" && (
            <div className="pg-eval-placeholder">
              尚未執行。按上方「Run Eval ▶」開始。
            </div>
          )}

          {status === "running" && (
            <div className="pg-eval-placeholder">執行中…</div>
          )}

          {result?.error && (
            <div className="pg-eval-section pg-eval-section-error">
              <div className="pg-eval-section-label">Adapter error</div>
              <div className="pg-eval-section-content">
                <pre className="pg-eval-err">{result.error}</pre>
              </div>
            </div>
          )}

          {result?.response?.text && (
            <div className="pg-eval-section">
              <div className="pg-eval-section-label">Agent response</div>
              <div className="pg-eval-section-content pg-eval-response">
                {result.response.text}
              </div>
            </div>
          )}

          {result?.response?.toolCalls && result.response.toolCalls.length > 0 && (
            <div className="pg-eval-section">
              <div className="pg-eval-section-label">
                Tool calls ({result.response.toolCalls.length})
              </div>
              <ul className="pg-eval-toolcalls">
                {result.response.toolCalls.map((tc) => (
                  <li key={tc.id} className="pg-eval-toolcall">
                    <code className="pg-eval-tool-name">{tc.name}</code>
                    <pre className="pg-eval-tool-input">
                      {JSON.stringify(tc.input, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result && result.checkResults.length > 0 && (
            <div className="pg-eval-section">
              <div className="pg-eval-section-label">
                Checks ({result.passedCount}/{result.totalCount})
              </div>
              <ul className="pg-eval-checks">
                {result.checkResults.map((cr, idx) => (
                  <li
                    key={`${cr.label}-${idx}`}
                    className={`pg-eval-check pg-eval-check-${cr.pass ? "ok" : "bad"}`}
                  >
                    <span className="pg-eval-check-icon">
                      {cr.pass ? "✓" : "✗"}
                    </span>
                    <code className="pg-eval-check-label">{cr.label}</code>
                    <span className="pg-eval-check-reason">{cr.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
