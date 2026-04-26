"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Swal from "sweetalert2";

import { emailValidation } from "../assets/utils/validation";
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const Register = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    try {
      console.log("註冊資料：", data);

      await new Promise((resolve) => setTimeout(resolve, 1500));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "註冊成功！歡迎加入 ENSO。",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      router.push("/login");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "註冊失敗",
        text: "註冊發生錯誤，請稍後再試。",
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
          <div className="text-center mb-8">
            <h2 className="font-bold text-2xl">加入 ENSO</h2>
            <p className="text-gray-500 text-sm">開啟您的靜謐香氛之旅</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* 姓名 */}
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-2">
                您的姓名
              </label>
              <input
                type="text"
                className={`block w-full px-4 py-3 outline-none bg-gray-100 rounded-lg focus:ring-2 focus:ring-enso-primary transition ${
                  errors.username ? "ring-4 ring-red-500" : ""
                }`}
                placeholder="請輸入姓名"
                {...register("username", { required: "姓名是必填的" })}
              />
              {errors.username && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-2">
                電子郵件
              </label>
              <input
                type="email"
                className={`block w-full px-4 py-3 outline-none bg-gray-100 rounded-lg focus:ring-2 focus:ring-enso-primary transition ${
                  errors.email ? "ring-4 ring-red-500" : ""
                }`}
                placeholder="example@mail.com"
                {...register("email", emailValidation)}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* 密碼 */}
            <div className="mb-4">
              <label className="block text-gray-500 text-sm font-bold mb-2">
                設定密碼
              </label>
              <input
                type="password"
                className={`block w-full px-4 py-3 outline-none bg-gray-100 rounded-lg focus:ring-2 focus:ring-enso-primary transition ${
                  errors.password ? "ring-4 ring-red-500" : ""
                }`}
                placeholder="請輸入 6 位以上密碼"
                {...register("password", {
                  required: "請設定您的密碼",
                  minLength: { value: 6, message: "密碼至少需要 6 位數" },
                })}
              />
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* 確認密碼 */}
            <div className="mb-5">
              <label className="block text-gray-500 text-sm font-bold mb-2">
                確認密碼
              </label>
              <input
                type="password"
                className={`block w-full px-4 py-3 outline-none bg-gray-100 rounded-lg focus:ring-2 focus:ring-enso-primary transition ${
                  errors.confirmPassword ? "ring-4 ring-red-500" : ""
                }`}
                placeholder="請再次輸入並確認密碼"
                {...register("confirmPassword", {
                  required: "請再次確認您的密碼",
                  validate: (value) =>
                    value === passwordValue || "兩次輸入的密碼不一致",
                })}
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </div>
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
                "立即註冊"
              )}
            </button>
          </form>

          <div className="text-center">
            <span className="text-gray-500 text-sm">已經有帳號了？</span>{" "}
            <Link
              href="/login"
              className="no-underline text-sm font-bold !text-gray-900 hover:!text-enso-gold"
            >
              立即登入
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
