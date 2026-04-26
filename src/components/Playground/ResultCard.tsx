"use client";

import type { PlaygroundRunResult } from "../../services/agent/playgroundRunner";

interface ResultCardProps {
  label: string;
  result: PlaygroundRunResult | null;
  loading: boolean;
  // 給 A/B 對照用 — 如果另一邊有值而自己是 0/null，對比會比較顯眼
  // 但 MVP 先不做 highlight diff，單純顯示每邊自己的結果
}

// ResultCard — 單邊結果顯示
// 三種狀態：loading / error / ok
// 設計重點：把「agent 做了什麼決策」攤開 —— tool call 是最有價值的觀察點
export default function ResultCard({
  label,
  result,
  loading,
}: ResultCardProps): JSX.Element {
  return (
    <div className="pg-result-card">
      <div className="pg-result-label">{label}</div>

      {loading && (
        <div className="pg-result-loading">
          <div className="pg-spinner" />
          <span>執行中…</span>
        </div>
      )}

      {!loading && result == null && (
        <div className="pg-result-empty">
          按下 <strong>Run ▶</strong> 開始比較
        </div>
      )}

      {!loading && result && result.error && (
        <div className="pg-result-error">
          <div className="pg-result-error-title">❌ 錯誤</div>
          <pre className="pg-result-error-body">{result.error}</pre>
          <div className="pg-metrics">
            <span>⏱ {result.latencyMs}ms</span>
          </div>
        </div>
      )}

      {!loading && result && !result.error && result.response && (
        <>
          <div className="pg-metrics">
            <span className="pg-metric">⏱ {result.latencyMs}ms</span>
            <span className="pg-metric">
              ↓ {result.response.usage?.inputTokens ?? "—"} tok
            </span>
            <span className="pg-metric">
              ↑ {result.response.usage?.outputTokens ?? "—"} tok
            </span>
            <span className="pg-metric pg-metric-stop">
              {result.response.stopReason}
            </span>
          </div>

          {result.response.text && (
            <div className="pg-result-section">
              <div className="pg-section-title">Response</div>
              <div className="pg-result-text">{result.response.text}</div>
            </div>
          )}

          {result.response.toolCalls &&
            result.response.toolCalls.length > 0 && (
              <div className="pg-result-section">
                <div className="pg-section-title">
                  Tool Calls · {result.response.toolCalls.length}
                </div>
                <ul className="pg-tool-list">
                  {result.response.toolCalls.map((tc) => (
                    <li key={tc.id} className="pg-tool-item">
                      <code className="pg-tool-name">{tc.name}</code>
                      <code className="pg-tool-input">
                        {JSON.stringify(tc.input)}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {!result.response.text &&
            (!result.response.toolCalls ||
              result.response.toolCalls.length === 0) && (
              <div className="pg-result-empty">（agent 沒有產出任何內容）</div>
            )}
        </>
      )}
    </div>
  );
}
