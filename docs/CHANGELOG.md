# 更新日誌

## [0.2.0] - 2026-04-05

### Changed
- 從 Vite + React Router (Hash Router) 遷移至 Next.js 16 (App Router)
- 環境變數前綴從 `VITE_` 改為 `NEXT_PUBLIC_`
- 新增 `src/app/` 目錄結構（App Router pages + layouts）
- 新增 `providers.tsx`（Redux Provider）、`bootstrap-client.tsx`（Bootstrap JS 動態載入）
- 新增 `authSlice.ts`（認證狀態管理）

## [0.1.0] - 2026-03-29

### Added
- 專案初始化：Vite + React + TypeScript
- Redux Toolkit 狀態管理（cart, message slices）
- Axios API 層（api, product, cart services）
- 前台頁面：首頁、商品列表、商品詳情、購物車、結帳、結帳成功
- 認證：登入、註冊
- 其他頁面：品牌故事、聯絡我們、FAQ、404
- UI：Bootstrap 5 + 自訂 SCSS、AOS 動畫、Swiper 輪播
- Toast 通知系統
- 搜尋功能（前端 filter）
- 優惠券功能
