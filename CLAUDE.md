# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projects in this Repository

This repo contains two separate projects:

- **Root project** (`src/`) — Primary Vite + React 19 + TypeScript SPA (the main codebase)
- **`enso-next/`** — Experimental Next.js 16 project (secondary; see `enso-next/CLAUDE.md` for its own guidance)

All commands below apply to the root project unless stated otherwise.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint (flat config, v9)
npm run deploy       # Deploy dist/ to GitHub Pages
```

For the Next.js project:
```bash
cd enso-next
npm run dev          # Next.js dev server
npm run build        # Next.js production build
```

## Architecture

### Entry & Routing

- **`src/main.tsx`** — Wraps app in Redux `<Provider>`, imports global styles (Bootstrap, Swiper, SCSS)
- **`src/App.tsx`** — Renders `<RouterProvider>` + global `<MessageToast>`
- **`src/router/index.tsx`** — `createHashRouter` (hash-based for GitHub Pages compatibility); all routes share `FrontendLayout`
- **`src/layout/FrontendLayout.tsx`** — Global wrapper: renders Header, Footer, Breadcrumb, initializes AOS animations, refreshes AOS on route change

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

Environment variables:
```
VITE_API_BASE=https://ec-course-api.hexschool.io/v2
VITE_API_PATH=rogan
```

### Custom Hooks

- **`src/hooks/useMessage.tsx`** — Returns `{ showSuccess, showError }` that dispatch toast notifications

### Styling

- Bootstrap 5 loaded globally in `main.tsx`
- SCSS in `src/assets/`: `_variables.scss` (main theme), `all.scss` (import entry), component-specific in `src/assets/scss/`
- Path alias `@` maps to `src/` (configured in both `vite.config.js` and `tsconfig.json`)

## Import Order (ESLint enforced)

```typescript
import React from 'react';            // 1. React
import { something } from 'package';  // 2. Third-party
import './styles.scss';               // 3. Static assets
import { X } from '@/services/...';   // 4. Alias imports (@/...)
import { Y } from './Component';      // 5. Relative imports
import type { Z } from '@/types';     // 6. Type imports last
```

ESLint will flag violations — run `npm run lint` to check.
