import type { Metadata } from "next";

import PromptPlayground from "../../components/Playground/PromptPlayground";

export const metadata: Metadata = {
  title: "Prompt Playground · ENSO Agent Lab",
  description: "A/B 比較不同 system prompt 對 agent 行為的影響",
};

// Playground 是獨立的 developer tool route，不套 FrontendShell（沒有 Header/Footer/Breadcrumb）
// 只繼承根 layout（Providers + BootstrapClient + 全域 CSS）
export default function PlaygroundPage(): JSX.Element {
  return <PromptPlayground />;
}
