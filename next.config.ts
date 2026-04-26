import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 路徑別名 @ → src/（Turbopack 設定，Next.js 16 預設使用 Turbopack）
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // Bootstrap 5 的 SCSS 仍用舊的 @import / global functions 語法；
  // 本專案不 fork bootstrap，所以壓掉 dependency 端的 Sass 棄用警告
  // （本地 build 沒事，但 Vercel 上 CI 把 deprecation 當 error 擋住）
  sassOptions: {
    silenceDeprecations: [
      "import",
      "global-builtin",
      "color-functions",
      "mixed-decls",
      "legacy-js-api",
    ],
    quietDeps: true,
  },
  // 允許外部圖片來源（API 的商品圖片）
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
