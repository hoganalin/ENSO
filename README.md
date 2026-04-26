# ENSO 香氛 — 線香電商前端

React + Vite 建立的線香香氛電商網站，整合綠界 ECPay 金流。

## 功能特色

- **商品展示**：分類瀏覽線香商品，支援 Swiper 輪播
- **購物車系統**：Redux Toolkit 管理購物車狀態，支援數量增減與刪除
- **結帳流程**：三步驟結帳（確認購物車 → 填寫資料 → 完成訂購）
- **ECPay 金流**：串接綠界 AIO，支援信用卡、WebATM、ATM 轉帳、超商代碼／條碼
- **全站動畫**：AOS (Animate On Scroll) 進場特效
- **響應式設計**：Tailwind CSS v4 + 自訂 SCSS

---

## 技術棧

| 類別 | 套件 |
|---|---|
| 框架 | React 18 + TypeScript |
| 打包 | Vite |
| 路由 | React Router v7（Hash Router，GitHub Pages 相容） |
| 狀態管理 | Redux Toolkit |
| API 請求 | Axios |
| 表單驗證 | React Hook Form |
| 樣式 | Tailwind CSS v4 + SCSS |
| 圖示 | Bootstrap Icons |
| 輪播 | Swiper |
| 動畫 | AOS |
| 彈窗 | SweetAlert2 |

---

## 目錄結構

```
src/
├── assets/       # 全域樣式（SCSS / Tailwind 進入點）
├── components/   # 頁面元件（Cart, Checkout, Header, Footer...）
├── hooks/        # 自訂 Hooks（useMessage）
├── layout/       # 全域版型（FrontendLayout）
├── router/       # 路由設定
├── services/     # API 封裝（product, cart, ecpay）
├── slice/        # Redux 狀態切片（cartSlice, messageSlice）
├── store/        # Redux Store
├── types/        # TypeScript 型別定義
└── views/        # 頁面元件（Home）
```

---

## 開發指令

```bash
npm run dev -- --host   # 啟動開發伺服器（WSL 需加 --host）
npm run build           # 生產打包 → dist/
npm run preview         # 預覽生產版本
npm run lint            # ESLint 檢查
npm run deploy          # 打包並部署到 GitHub Pages
npm test                # 執行 Vitest 測試
```

---

## 環境變數

在專案根目錄建立 `.env`：

```env
VITE_API_BASE=https://ec-course-api.hexschool.io/v2
VITE_API_PATH=your_api_path

VITE_ECPAY_MERCHANT_ID=your_merchant_id
VITE_ECPAY_HASH_KEY=your_hash_key
VITE_ECPAY_HASH_IV=your_hash_iv
VITE_ECPAY_BASE_URL=https://payment-stage.ecpay.com.tw
VITE_ECPAY_RETURN_URL=https://your-server.com/ecpay/callback
VITE_ECPAY_CLIENT_BACK_URL=https://your-site.com/#/payment-result
```

---

## ECPay 金流說明

結帳時透過 `src/services/ecpay.ts` 計算 CheckMacValue，以 HTML form POST 直接送至 ECPay，讓使用者在 ECPay 頁面選擇付款方式。

| 付款方式 | 結果通知 |
|---|---|
| 信用卡、WebATM | 付款後 ClientBackURL 重導向，前端可即時查詢 |
| ATM 轉帳、超商代碼／條碼 | 異步通知（需後端 ReturnURL 接收 S2S callback） |

---

## 部署

專案部署至 GitHub Pages，使用 Hash Router 確保重新整理不會 404。

```bash
npm run deploy
```
