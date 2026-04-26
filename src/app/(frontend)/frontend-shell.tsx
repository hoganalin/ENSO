"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

import AOS from "aos";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import MessageToast from "../../components/MessageToast";
import ChatWidget from "../../components/ShoppingAgent/ChatWidget";

import { restoreAuth } from "../../slice/authSlice";
import type { AppDispatch } from "../../store/store";

export default function FrontendShell({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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
    AOS.refresh();
  }, [pathname]);

  return (
    <>
      <MessageToast />
      <Header />
      <Breadcrumb />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}

