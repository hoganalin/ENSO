import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
export const API_PATH = import.meta.env.VITE_API_PATH;

// 給前台使用的 (不需自動帶 Token)
export const api = axios.create({
  baseURL: API_BASE,
});

// 以下給後台使用 (Admin 功能)
export const adminApi = axios.create({
  baseURL: API_BASE,
});

// 1. 請求攔截器 (Request Interceptor)：自動注入 Token
adminApi.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. 回應攔截器 (Response Interceptor)：處理驗證失敗與統一錯誤
adminApi.interceptors.response.use(
  (response) => {
    // 成功回傳的回應，直接返回
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    // 處理 403 / 401 權限問題 (Token 過期或無效)
    if (status === 403 || status === 401) {
      alert("您的登入已過期或權限不足，請重新登入。");

      // 清除無效 Token
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 跳轉到登入頁。注意：使用 Hash 路由路徑需要加上 #
      window.location.hash = "#/login";
    }

    return Promise.reject(error);
  }
);
