# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint (flat config, v9) — only covers .js/.jsx files
npm run deploy       # Build + deploy dist/ to GitHub Pages at /ENSO/
```

Vitest is configured (`npm test`). Run after any component or slice change.

## Architecture

### Entry & Routing

- **`src/main.tsx`** — Wraps app in Redux `<Provider>`, imports global styles (Bootstrap, Swiper, SCSS)
- **`src/App.tsx`** — Renders `<RouterProvider>` + global `<MessageToast>`
- **`src/router/index.tsx`** — `createHashRouter` (hash-based for GitHub Pages compatibility); all routes share `FrontendLayout`
- **`src/layout/FrontendLayout.tsx`** — Global wrapper: renders Header, Footer, Breadcrumb, initializes AOS animations, refreshes AOS on route change

Most page components live in `src/components/` (e.g. `Cart`, `Checkout`, `SingleProduct`). Only `Home` lives under `src/views/frontend/`. New pages should follow whichever pattern fits; the router imports from both locations.

### State Management (Redux Toolkit)

Store at `src/store/store.ts` with two slices:

- **`src/slice/cartSlice.ts`** — Cart state (`carts`, `total`, `final_total`); async thunks for CRUD operations via cart API
- **`src/slice/messageSlice.ts`** — Toast notifications queue; `createAsyncAddMessage` auto-dismisses after 3s

Use typed hooks: `useDispatch<AppDispatch>()` and `useSelector` with `RootState`.

### API Layer

- **`src/services/api.ts`** — Two Axios instances:
  - `api` — Public (unauthenticated) requests
  - `adminApi` — Adds `hexToken` cookie to `Authorization` header; 401/403 redirects to `#/login`
- **`src/services/product.ts`** — Product API calls
- **`src/services/cart.ts`** — Cart and order API calls

Environment variables (in `.env`):
```
VITE_API_BASE=https://ec-course-api.hexschool.io/v2
VITE_API_PATH=rogan
```

### Key Dependencies

- **`react-hook-form`** — Form handling (used in Checkout, Login, Register, Contact)
- **`sweetalert2`** — Confirmation dialogs (e.g. cart item removal)
- **`react-loader-spinner`** — Loading indicators
- **`swiper`** — Product carousels on Home page
- **`aos`** — Scroll animations; initialized in `FrontendLayout`, refresh on route change

### Custom Hooks

- **`src/hooks/useMessage.tsx`** — Returns `{ showSuccess, showError }` that dispatch toast notifications

### Styling

- Bootstrap 5 loaded globally in `main.tsx`
- SCSS in `src/assets/`: `_variables.scss` (main theme), `all.scss` (import entry), component-specific files in `src/assets/scss/`
- Path alias `@` maps to `src/` (configured in both `vite.config.js` and `tsconfig.json`)

## Import Order (ESLint enforced for .js/.jsx)

```javascript
import React from 'react';            // 1. React / react-dom
import { something } from 'package';  // 2. Third-party
import './styles.scss';               // 3. Static assets (css/scss/images)
import { X } from '@/services/...';   // 4. Alias imports (@/...)
import { Y } from './Component';      // 5. Relative imports
import type { Z } from '@/types';     // 6. Type imports last
```

ESLint will flag violations — run `npm run lint` to check.

## Environment

- 執行環境：WSL（Windows Subsystem for Linux）
- 啟動 dev server 一律加 `--host` flag：`npm run dev -- --host`，否則 Windows 瀏覽器無法存取

## Code Quality

每次修改後，確認以下事項再回報完成：

- 無殘留的未使用 import
- 無衝突的 directive（同一個元件不可同時有 `'use client'` 與 async server component 模式）
- 使用第三方套件前，先確認 `package.json` 中的版本，避免使用已棄用的 API
- 修改元件或 slice 後執行 `npm test`，確認測試通過

## Session Management

- 接近用量限制時，主動說明目前進度並列出剩餘步驟，讓下個 session 能無縫接續
- 長任務優先完成核心功能，enhancement 留到確認核心可運作後再做
- 只在 session 開頭讀取一次 `SESSION_START_SKILL.md`，不要每次對話重複執行

## Skill System — 自動觸發規則

執行任何任務前，依照以下規則自動讀取對應 skill：

| 當你要... | 請先讀取 |
|---|---|
| **每次 session 開始** | .claude/skills/SESSION_START_SKILL.md |
| 任務涉及多個獨立模組或超過 5 個檔案 | .claude/skills/PARALLEL_AGENT_SKILL.md |
| 建立新元件或頁面 | .claude/skills/COMPONENT_SKILL.md |
| 修改或新增樣式 | .claude/skills/UI_SKILL.md |
| 新增 Redux slice | .claude/skills/REDUX_SKILL.md |
| 新增 API 函式 | .claude/skills/API_SKILL.md |
| 建立表單元件 | .claude/skills/FORM_SKILL.md |
| 撰寫測試 | .claude/skills/TEST_SKILL.md |

不確定要讀哪個時，讀取全部再決定。