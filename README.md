# Zen Incense - 禪香線香電商 / vite-reacthomework-finalweek

這是一個使用 React + Vite 建立的禪香/線香電商網站原型。

## 🚀 主要功能

- **商品展示**: 分類顯示各式禪香與線香。
- **購物車系統**: 使用 Redux Toolkit 管理購物車狀態。
- **全站導覽**: 整合動態麵包屑 (Breadcrumb) 提升使用者體驗。
- **視覺動畫**: 整合 AOS (Animate On Scroll) 實現優雅的進場特效。
- **響應式設計**: 使用 Bootstrap 與自訂 SCSS。

---

## 🛠️ 開發與維護指南

### 1. 專案技術棧 (Tech Stack)

- **架構/打包工具**: React + Vite
<!-- - **路由管理**: React Router (`src/router`) -->
- **狀態管理**: Redux Toolkit (`src/store`, `src/slice`)
- **API 請求**: Axios (`src/services` 集中管理)
- **視覺動畫**: AOS (Animate On Scroll)
- **輪播套件**: Swiper
- **樣式**: SCSS (`src/assets`) + Bootstrap Icons

### 2. 目錄結構 (Folder Structure)

```text
src/
├── assets/      # 全域共通樣式 (SCSS/CSS)
├── components/  # 共用 UI 元件 (如 Header, Footer, Breadcrumb)
├── hooks/       # 自訂 Hooks (如 useMessage)
├── images/      # 靜態圖片檔
├── layout/      # 頁面排版佈局 (如 FrontendLayout)
├── router/      # 網站路由設定檔
├── services/    # 集中處理所有的 API 請求
├── slice/       # Redux Toolkit 的狀態切片
├── store/       # Redux Store 的進入點
├── utils/       # 共用小工具 (如格式轉換)
└── views/       # 完整的路由頁面組件
```

### 3. 核心功能說明

#### 3.1 頁面版型與全域動畫 (FrontendLayout)

所有前端的基礎版型都在 `src/layout/FrontendLayout.jsx` 中設定。

- **Header/Footer**: 由此佈局套用，所有子頁面 (`Outlet`) 都會自動帶入。
- **全域麵包屑 (Breadcrumb)**: 同樣在佈局層級引入，根據當前路由自動生成導覽路徑。
- **AOS 動畫全域監聽**: 在此處執行 `AOS.init()`。監聽 `location.pathname` 執行 `AOS.refresh()` ，確保換頁後動畫依然有效。

#### 3.2 麵包屑導覽 (Breadcrumb)

組件位於 `src/components/Breadcrumb.jsx`：

- **動態路徑解析**: 使用 `useLocation` 拆解路徑。
- **中文對應表**: 透過 `breadcrumbMap` 對象將英文路由轉化為中文名稱。
- **特殊處理**: 針對 `product/:id` 動態路由會自動顯示為「產品詳情」。

#### 3.3 狀態管理與 API 請求

- **API 請求**: 封裝在 `src/services/` 底下（如 `getSingleProductApi`）。
- **Redux 操作**: 購物車邏輯定義在 `slice/cartSlice.js`，將邏輯從 UI 元件中抽離。

### 4. 常見維護任務

- **新增頁面**: 在 `src/views/` 建立組件 -> 在 `src/router/` 設定路由 -> 使用 `<Link>` 導航。
- **新增 API**: 在 `src/services/` 定義 -> 匯出函式 -> 在組件或 Slice 中調用。
- **加入動畫**: 在 HTML 標籤加入 `data-aos="fade-up"`。詳細參考 [AOS 官方文件](https://michalsnik.github.io/aos/)。
