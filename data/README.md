# `data/` — Runtime-only event store

這個資料夾是 agent 執行時產生的事件儲存。**不要手動編輯**。

- `agent-events.json` — 跨 repo 共享的 Agent Event stream，由 `/api/events` 讀寫
  - 寫入端：Next.js `useChatAgent`（對話輪次）＋ `/playground/eval`（eval 執行）
  - 讀取端：ENSO-BackEnd `/admin/agent`（商家後台 dashboard）

## Schema

定義在 `src/types/agent-events.ts`。三種 kind：

- `conversation_turn` — 每輪對話
- `handoff` — agent 之間切換
- `eval_run` — eval suite 跑完一次

## Reset

若資料太多想重置，直接把檔案覆蓋成 `[]` 即可：

```bash
echo "[]" > data/agent-events.json
```
