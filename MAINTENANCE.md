# 網站維護與開發指南 (Maintenance Guide)

這份文件旨在幫助未來的開發者或自己，快速了解並維護本專案（禪香/線香電商網站）的架構與設定。

## 1. 專案技術棧 (Tech Stack)

- **架構/打包工具**: React + Vite
- **路由管理**: React Router (`src/router`)
- **狀態管理**: Redux Toolkit (`src/store`, `src/slice`)
- **API 請求**: Axios (`src/services` 集中管理)
- **視覺動畫**: AOS (Animate On Scroll)
- **輪播套件**: Swiper
- **樣式**: SCSS (`src/assets`) + Bootstrap Icons

## 2. 目錄結構 (Folder Structure)

```text
src/
├── assets/      # 全域共通樣式 (SCSS/CSS)，如 swiper.scss 等
├── components/  # 共用 UI 元件 (如 Header, Footer, 單一商品頁 SingleProduct)
├── hooks/       # 自訂 Hooks (例如推播訊息用的 useMessage)
├── images/      # 靜態圖片檔
├── layout/      # 頁面排版佈局 (如 FrontendLayout)
├── router/      # 網站路由設定檔
├── services/    # 集中處理所有的 API 請求 (如 product.js 負責商品 API)
├── slice/       # Redux Toolkit 的狀態切片 (如 cartSlice 管理購物車資料)
├── store/       # Redux Store 的進入點與設定
├── utils/       # 共用小工具 (例如 filter.js 處理貨幣格式轉換)
└── views/       # 完整的路由頁面組件 (如 frontend/Home.jsx 等)
```

## 3. 核心功能說明

### 3.1 頁面版型與全域動畫 (FrontendLayout)

所有前端的基礎版型都在 `src/layout/FrontendLayout.jsx` 中設定。

- **Header/Footer**: 由此佈局套用，所有子頁面 (`Outlet`) 都會自動帶入。
- **AOS 動畫全域監聽**: 在此處執行 `AOS.init()` 初始化。由於使用 SPA 路由切換機制，因此也透過 `useEffect` 監聽 `location.pathname` 來執行 `AOS.refresh()` ，確保換頁後新內容進場動畫依然有效。

### 3.2 樣式與動畫增新

- **進場特效**: 當你要替任何元素新增動畫時，只要在 HTML 標籤上貼上如 `data-aos="fade-up"` 即可。
  - 要控制先後出現，可使用 `data-aos-delay="100"` / `200` 等。
- **CSS / SCSS**: 請盡量統一維護在 `assets/` 內的 SCSS 檔，或是按元件拆分引入，以維持代碼整潔。

### 3.3 狀態管理與 API 請求

- **API 請求**: 所有的 `fetch` 或 `axios` 請求應封裝在 `src/services/` 底下，元件只要 import 對應函式並執行即可（如 `getSingleProductApi`）。
- **非同步的 Redux 操作**：像是加入購物車 (`handleAddCart`)，是透過 `createAsyncAddCart` 這個在 `slice/cartSlice.js` 定義好的非同步 action 發送，以此將邏輯從 UI 元件中抽離出去。

### 3.4 常用自訂 Hook

元件中時常會使用到 `const { showSuccess, showError } = useMessage();`，透過引入 `src/hooks/useMessage` 來統一處理系統提示訊息（例如：加入購物車成功提示）。

## 4. 常見維護任務教學

### 🔹 如何新增一個新頁面？

1. 到 `src/views/` 建立你的新頁面 (例如: `NewPage.jsx`)
2. 在裡面寫好你的 Component (`export default function NewPage()...`)
3. 前往 `src/router/` 將你的 `NewPage` import 進來，並加入到 route 的陣列規則之中。
4. 在需要導航的地方使用 `<Link to="/newpage">` 建立連結。

### 🔹 如何新增一隻 API?

1. 進入 `src/services/` (例如: `order.js`)。
2. 匯入基礎的 API axios 實例或寫法。
3. 把路徑寫好並以 `export const yourApi = async () => ...` 導出。
4. 從 UI 組件或是 Redux Slice 裡面直接 import 調用。

### 🔹 如何為新段落加入 AOS 動畫？

直接在切版元素的 HTML 標籤最外層加上：`<div data-aos="fade-up" data-aos-delay="100">...</div>`
詳細動畫種類（如 zoom-in, flip-left 等）可以參考 [AOS 官方文件](https://michalsnik.github.io/aos/)。
