import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
export const API_PATH = import.meta.env.VITE_API_PATH;

//給前台使用的
export const api = axios.create({
  baseURL: API_BASE,
});
//推薦把每個功能的api都分開來

//以下給後台使用
export const adminApi = axios.create({
  baseURL: API_BASE,
});
//使用攔截器
adminApi.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    //如果有token就放在headers
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
