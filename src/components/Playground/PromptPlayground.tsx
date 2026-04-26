"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import PromptColumn from "./PromptColumn";

import {
  AGENT_REGISTRY,
  AGENT_TOOLS,
  ALL_AGENT_IDS,
  getAgentAdapter,
  getToolsForAgent,
} from "../../services/agent";
import {
  comparisonToMarkdown,
  runComparison,
} from "../../services/agent/playgroundRunner";

import type {
  PlaygroundComparison,
  PlaygroundRunResult,
} from "../../services/agent/playgroundRunner";
import type { AgentId } from "../../types/agent";

// PromptPlayground — A/B system prompt 對比工具
//
// 為什麼要有這個頁面：
// - Prompt engineering 的核心是「同一個輸入，換 prompt 觀察行為差異」
// - 做 demo 時能當場展示「這個 prompt 讓 agent 少呼叫一次 tool」「那個 prompt 讓 agent 講廢話」
// - 給招聘方看的 portfolio piece：不只會寫 code，更懂如何用語言調校 agent
//
// MVP 設計原則：
// 1. 單輪比較（不跑 tool-use loop）→ 看 prompt 對 initial decision 的影響
// 2. Promise.all 同時送 A/B → 兩邊幾乎同時完成，latency 差異有意義
// 3. Mock 模式下會誠實提示「回應不受 prompt 影響」避免誤導
// 4. Copy as Markdown → 能把每次迭代結果貼到 Notion 當筆記

const QUICK_USER_MESSAGES: string[] = [
  "我想送女友生日禮物，預算 NT$800",
  "睡前適合點什麼香？我最近睡不好",
  "我剛剛的訂單到哪了？",
  "你們的沉香跟檀香有什麼差別？",
];

export default function PromptPlayground(): JSX.Element {
  // ==== State ====
  const [agentId, setAgentId] = useState<AgentId>("xiaohe");
  const [promptA, setPromptA] = useState<string>(
    AGENT_REGISTRY.xiaohe.systemPrompt,
  );
  const [promptB, setPromptB] = useState<string>(
    AGENT_REGISTRY.xiaohe.systemPrompt,
  );
  const [userMessage, setUserMessage] = useState<string>(
    "我想送女友生日禮物，預算 NT$800",
  );
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<PlaygroundComparison | null>(
    null,
  );
  const [lastError, setLastError] = useState<string | null>(null);

  // Adapter name 要在 useEffect 讀，避免 SSR hydration mismatch
  // （env var 在 client / server 讀取時機不一樣）
  const [adapterName, setAdapterName] = useState<string>("mock");
  useEffect(() => {
    setAdapterName(getAgentAdapter().name);
  }, []);

  const isMockAdapter = adapterName === "mock";

  // ==== Derived ====
  const currentAgent = AGENT_REGISTRY[agentId];
  const toolsForAgent = useMemo(
    () => getToolsForAgent(agentId, AGENT_TOOLS),
    [agentId],
  );

  // ==== Handlers ====

  // 切換 agent 時把兩邊 prompt 重置到新 agent 的 baseline
  const handleAgentChange = useCallback((nextId: AgentId) => {
    const persona = AGENT_REGISTRY[nextId];
    setAgentId(nextId);
    setPromptA(persona.systemPrompt);
    setPromptB(persona.systemPrompt);
    setComparison(null);
    setLastError(null);
  }, []);

  const handleResetToBaseline = useCallback(
    (side: "a" | "b") => {
      const baseline = AGENT_REGISTRY[agentId].systemPrompt;
      if (side === "a") {
        setPromptA(baseline);
      } else {
        setPromptB(baseline);
      }
    },
    [agentId],
  );

  const handleRun = useCallback(async () => {
    if (!userMessage.trim() || loading) return;

    setLoading(true);
    setComparison(null);
    setLastError(null);

    try {
      const adapter = getAgentAdapter();
      const result = await runComparison(
        adapter,
        userMessage.trim(),
        promptA,
        promptB,
        toolsForAgent,
        agentId,
      );
      setComparison(result);
    } catch (err) {
      // runComparison 內部已經把單邊錯誤包進 result.error
      // 只有 top-level 意外才會走到這裡（例如 adapter 本身爆掉）
      setLastError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [userMessage, loading, promptA, promptB, toolsForAgent, agentId]);

  const handleCopyMarkdown = useCallback(async () => {
    if (!comparison) return;
    const md = comparisonToMarkdown(
      userMessage,
      agentId,
      adapterName,
      promptA,
      promptB,
      comparison,
    );
    try {
      await navigator.clipboard.writeText(md);
      // 快速視覺回饋：借用 lastError 狀態當 toast（偷懶做法，MVP OK）
      setLastError("✓ Markdown 已複製到剪貼簿");
      setTimeout(() => setLastError(null), 2000);
    } catch {
      setLastError("複製失敗，請手動選取");
      setTimeout(() => setLastError(null), 3000);
    }
  }, [comparison, userMessage, agentId, adapterName, promptA, promptB]);

  const resultA: PlaygroundRunResult | null = comparison?.a ?? null;
  const resultB: PlaygroundRunResult | null = comparison?.b ?? null;

  // ==== Render ====
  return (
    <div className="pg-root">
      {/* Top bar */}
      <header className="pg-topbar">
        <div className="pg-topbar-left">
          <Link href="/" className="pg-home-link" aria-label="回首頁">
            ←
          </Link>
          <div className="pg-brand">
            <span className="pg-brand-emoji">🧪</span>
            <span className="pg-brand-text">Prompt Playground</span>
          </div>
          <span className="pg-brand-subtitle">ENSO Agent Lab</span>
        </div>

        <div className="pg-topbar-right">
          <div className="pg-topbar-field">
            <label htmlFor="pg-agent-select" className="pg-field-label">
              Agent
            </label>
            <select
              id="pg-agent-select"
              className="pg-select"
              value={agentId}
              onChange={(e) => handleAgentChange(e.target.value as AgentId)}
            >
              {ALL_AGENT_IDS.map((id) => {
                const p = AGENT_REGISTRY[id];
                return (
                  <option key={id} value={id}>
                    {p.avatar} {p.name} · {p.shortTitle}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="pg-topbar-field">
            <span className="pg-field-label">Provider</span>
            <span className={`pg-provider pg-provider-${isMockAdapter ? "mock" : "live"}`}>
              {adapterName}
            </span>
          </div>
        </div>
      </header>

      {/* Mock warning banner */}
      {isMockAdapter && (
        <div className="pg-banner pg-banner-warn">
          <span>
            ⚠️ <strong>Mock mode</strong>：回應由固定 handler 產生，
            <strong>不會</strong>因 system prompt 改變而改變。想看真實 A/B 差異，請設
            <code>NEXT_PUBLIC_AGENT_PROVIDER=server</code> +
            <code>ANTHROPIC_API_KEY</code>。
          </span>
        </div>
      )}

      {/* Context info */}
      <div className="pg-context-bar">
        <span className="pg-context-item">
          <strong>{currentAgent.avatar} {currentAgent.name}</strong>
          <span className="pg-context-dim"> · {currentAgent.shortTitle}</span>
        </span>
        <span className="pg-context-divider">|</span>
        <span className="pg-context-item">
          Tools: {toolsForAgent.length} available ({toolsForAgent.map((t) => t.name).join(", ")})
        </span>
      </div>

      {/* Two columns */}
      <main className="pg-columns">
        <PromptColumn
          label="Prompt A"
          prompt={promptA}
          onPromptChange={setPromptA}
          onResetToBaseline={() => handleResetToBaseline("a")}
          result={resultA}
          loading={loading}
        />
        <PromptColumn
          label="Prompt B"
          prompt={promptB}
          onPromptChange={setPromptB}
          onResetToBaseline={() => handleResetToBaseline("b")}
          result={resultB}
          loading={loading}
        />
      </main>

      {/* Bottom toolbar: user message input */}
      <footer className="pg-toolbar">
        <div className="pg-quick-row">
          <span className="pg-quick-label">快速範例：</span>
          {QUICK_USER_MESSAGES.map((m) => (
            <button
              key={m}
              type="button"
              className="pg-quick-chip"
              onClick={() => setUserMessage(m)}
              disabled={loading}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="pg-input-row">
          <input
            className="pg-user-input"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="模擬使用者訊息…"
            disabled={loading}
            aria-label="User message"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleRun();
              }
            }}
          />
          <button
            type="button"
            className="pg-btn pg-btn-primary"
            onClick={handleRun}
            disabled={loading || !userMessage.trim()}
          >
            {loading ? "Running…" : "Run ▶"}
          </button>
          <button
            type="button"
            className="pg-btn pg-btn-secondary"
            onClick={handleCopyMarkdown}
            disabled={!comparison || loading}
            aria-label="Copy comparison as Markdown"
          >
            📋 Copy MD
          </button>
        </div>

        {lastError && (
          <div className="pg-toast" role="status">
            {lastError}
          </div>
        )}

        <div className="pg-hint">
          💡 Cmd/Ctrl + Enter 快速執行 · Mock mode 下兩邊會一樣 ·
          Server mode 才看得到真實差異
        </div>
      </footer>
    </div>
  );
}
