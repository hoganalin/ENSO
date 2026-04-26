"use client";

import ResultCard from "./ResultCard";

import type { PlaygroundRunResult } from "../../services/agent/playgroundRunner";

interface PromptColumnProps {
  label: string;
  prompt: string;
  onPromptChange: (value: string) => void;
  onResetToBaseline: () => void;
  result: PlaygroundRunResult | null;
  loading: boolean;
}

// PromptColumn — 一欄（Prompt A 或 Prompt B）
// 上半：可編輯的 system prompt textarea + reset 按鈕
// 下半：ResultCard 顯示該次 run 的結果
export default function PromptColumn({
  label,
  prompt,
  onPromptChange,
  onResetToBaseline,
  result,
  loading,
}: PromptColumnProps): JSX.Element {
  const charCount = prompt.length;

  return (
    <div className="pg-column">
      <div className="pg-column-header">
        <div className="pg-column-title">{label}</div>
        <div className="pg-column-actions">
          <span className="pg-char-count">{charCount} chars</span>
          <button
            type="button"
            className="pg-btn pg-btn-ghost"
            onClick={onResetToBaseline}
            aria-label={`重設 ${label} 到當前 agent 的預設 prompt`}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <textarea
        className="pg-prompt-textarea"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="輸入 system prompt…"
        spellCheck={false}
        aria-label={`${label} system prompt`}
      />

      <ResultCard label={label} result={result} loading={loading} />
    </div>
  );
}
