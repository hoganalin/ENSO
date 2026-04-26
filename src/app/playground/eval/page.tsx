import type { Metadata } from "next";

import EvalSuite from "../../../components/Eval/EvalSuite";

export const metadata: Metadata = {
  title: "Eval Suite · ENSO Agent Lab",
  description: "批次執行預寫 test case，量化 agent 行為改動的影響",
};

// Eval Suite 是 Playground 的量化版：
// Playground 是「手動一次比一個 prompt」，Eval 是「8 個 case 一次批次跑、看 pass rate」
// 獨立 route，不套 FrontendShell
export default function EvalPage(): JSX.Element {
  return <EvalSuite />;
}
