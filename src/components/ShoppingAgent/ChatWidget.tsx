"use client";

import { useDispatch, useSelector } from "react-redux";

import { toggleAgent } from "../../slice/agentSlice";
import ChatPanel from "./ChatPanel";

import type { RootState } from "../../store/store";

// ChatWidget — 掛在 FrontendShell 的浮動入口
// 收合時：右下角 emerald bubble
// 展開時：顯示 ChatPanel

function ChatWidget(): JSX.Element {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.agent.isOpen);

  if (isOpen) {
    return <ChatPanel />;
  }

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleAgent())}
      className="sa-fab"
      aria-label="開啟購物助理"
    >
      <span>🌿</span>
      <span className="sa-fab-dot" aria-hidden="true"></span>
      <span className="sa-fab-tip">問小禾</span>
    </button>
  );
}

export default ChatWidget;
