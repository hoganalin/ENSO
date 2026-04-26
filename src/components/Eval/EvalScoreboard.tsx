"use client";

import type { EvalSummary } from "../../services/agent/evals/types";

// EvalScoreboard — 整體成績總覽
// 顯示：pass rate（最醒目）、case 分布、total latency、progress bar
// 實際 pass 的格子數決定 bar 顏色：70%+ 綠、40-70 黃、<40 紅

interface EvalScoreboardProps {
  summary: EvalSummary;
  running: boolean;
  completedCount: number; // 已跑完幾個 case（含 error），用來算 progress
}

const getPassRateColor = (rate: number): "ok" | "warn" | "bad" => {
  if (rate >= 0.7) return "ok";
  if (rate >= 0.4) return "warn";
  return "bad";
};

export default function EvalScoreboard({
  summary,
  running,
  completedCount,
}: EvalScoreboardProps): JSX.Element {
  const { totalCases, passedCases, failedCases, erroredCases, passRate, totalLatencyMs, passedChecks, totalChecks } = summary;
  const pct = (passRate * 100).toFixed(1);
  const color = getPassRateColor(passRate);

  // Progress bar 在跑的時候顯示「目前進度」而不是「最後分數」
  const progressPct = totalCases === 0 ? 0 : (completedCount / totalCases) * 100;

  return (
    <section className="pg-eval-scoreboard" aria-label="Eval 總覽">
      <div className="pg-eval-score-main">
        <div className={`pg-eval-rate pg-eval-rate-${color}`}>
          <span className="pg-eval-rate-num">{totalChecks === 0 ? "—" : `${pct}%`}</span>
          <span className="pg-eval-rate-sub">
            {passedChecks} / {totalChecks} checks
          </span>
        </div>

        <div className="pg-eval-breakdown">
          <div className="pg-eval-stat pg-eval-stat-ok">
            <span className="pg-eval-stat-num">{passedCases}</span>
            <span className="pg-eval-stat-label">pass</span>
          </div>
          <div className="pg-eval-stat pg-eval-stat-bad">
            <span className="pg-eval-stat-num">{failedCases}</span>
            <span className="pg-eval-stat-label">fail</span>
          </div>
          <div className="pg-eval-stat pg-eval-stat-warn">
            <span className="pg-eval-stat-num">{erroredCases}</span>
            <span className="pg-eval-stat-label">error</span>
          </div>
          <div className="pg-eval-stat pg-eval-stat-dim">
            <span className="pg-eval-stat-num">{totalCases}</span>
            <span className="pg-eval-stat-label">total</span>
          </div>
          <div className="pg-eval-stat pg-eval-stat-dim">
            <span className="pg-eval-stat-num">{totalLatencyMs}</span>
            <span className="pg-eval-stat-label">ms total</span>
          </div>
        </div>
      </div>

      <div className="pg-eval-progress" aria-label="Case 執行進度">
        <div
          className={`pg-eval-progress-fill pg-eval-progress-${running ? "running" : color}`}
          style={{ width: `${progressPct}%` }}
        />
        <span className="pg-eval-progress-label">
          {running
            ? `Running… ${completedCount}/${totalCases}`
            : completedCount === 0
              ? "尚未執行"
              : `${completedCount}/${totalCases} cases · 完成`}
        </span>
      </div>
    </section>
  );
}
