import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { restoreAuth } from "../slice/authSlice";
import type { AppDispatch } from "../store/store";

import AOS from "aos";

import "aos/dist/aos.css";

import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";

function FrontendLayout(): JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // 初始化 AOS (全域設定動畫長度 800 毫秒，且只執行一次)
    AOS.init({ duration: 800, once: true });

    // 頁面 refresh 時，嘗試從 localStorage 還原 auth 狀態
    const localAuth = localStorage.getItem("auth");
    if (localAuth) {
      try {
        const authData = JSON.parse(localAuth);
        if (authData?.token && authData?.user) {
          dispatch(restoreAuth({ token: authData.token, user: authData.user }));
        }
      } catch {
        localStorage.removeItem("auth");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // 每次切換頁面 (路由改變) 時，重新整理 AOS 來觸發新頁面的動畫
    AOS.refresh();
  }, [location.pathname]);
  return (
    <>
      <Header />
      <Breadcrumb />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default FrontendLayout;
