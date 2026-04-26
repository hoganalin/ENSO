"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";

import { emailValidation } from "../assets/utils/validation";
import { adminApi } from "../services/api";
import { loginSuccess } from "../slice/authSlice";
import type { AppDispatch } from "../store/store";

interface LoginFormData {
  email: string;
  password: string;
}
const Login = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);

    const loginData = {
      username: data.email,
      password: data.password,
    };

    try {
      const res = await adminApi.post("/admin/signin", loginData);
      const { token, expired } = res.data;

      const user = { email: data.email };

      localStorage.setItem(
        "auth",
        JSON.stringify({ token, user, isAuthenticated: true }),
      );
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/;`;

      dispatch(loginSuccess({ token, user }));

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "登入成功！",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      router.push("/product");
    } catch (error: unknown) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "請檢查帳號密碼"
        : "請檢查帳號密碼";
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: message,
        confirmButtonColor: "#1a4636",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 mt-16 mb-24 py-12">
      <div className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
        <div className="p-5">
          <h2 className="text-center mb-4 font-bold text-2xl">登入 ENSO</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            歡迎回來，請登入您的帳號
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-2">
                電子郵件
              </label>
              <input
                type="email"
                className={`block w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-enso-primary transition ${
                  errors.email ? "ring-4 ring-red-500" : ""
                }`}
                placeholder="name@example.com"
                {...register("email", emailValidation)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-gray-500 text-sm font-bold mb-2">
                密碼
              </label>
              <input
                type="password"
                className={`block w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-enso-primary transition ${
                  errors.password ? "ring-4 ring-red-500" : ""
                }`}
                placeholder="請輸入密碼"
                {...register("password", { required: "密碼是必填欄位" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-enso-primary text-white rounded-full font-bold shadow-sm mb-4 hover:bg-enso-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                "立即登入"
              )}
            </button>
          </form>

          <div className="text-center">
            <span className="text-gray-500 text-sm">還沒有帳號？</span>{" "}
            <Link
              href="/register"
              className="no-underline text-sm font-bold !text-gray-900 hover:!text-enso-gold"
            >
              立即註冊
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
