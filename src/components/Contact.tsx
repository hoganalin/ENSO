"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";

import { emailValidation } from "../assets/utils/validation";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    mode: "onTouched",
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    console.log("聯絡表單資料：", data);
    setSubmitted(true);
    try {
      // 模擬傳送資料
      await new Promise((resolve) => setTimeout(resolve, 1500));
      reset();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "訊息已成功送出，我們將儘快與您聯繫！",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "送出失敗",
        text: "訊息送出時發生錯誤，請稍後再試。",
        confirmButtonColor: "#1a4636",
      });
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 my-16">
      <div className="text-center mb-5">
        <h2 className="font-bold text-3xl mb-3">聯絡我們</h2>
        <p className="text-gray-500 text-sm">
          任何關於產品或合作的問題，歡迎隨時與我們聯繫
        </p>
        <div className="mx-auto w-10 h-0.5 bg-enso-gold"></div>
      </div>

      <div className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2">
              您的姓名
            </label>
            <input
              type="text"
              className={`block w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-enso-primary transition ${
                errors.name ? "ring-4 ring-red-500" : ""
              }`}
              placeholder="請輸入姓名"
              {...register("name", { required: "姓名是必填欄位" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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

          <div className="mb-4">
            <label className="block text-gray-500 text-sm font-bold mb-2">
              主旨
            </label>
            <select
              className={`block w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-enso-primary transition ${
                errors.subject ? "ring-4 ring-red-500" : ""
              }`}
              {...register("subject", { required: "請選擇主旨" })}
            >
              <option value="">請選擇諮詢類別</option>
              <option value="order">訂單查詢</option>
              <option value="product">產品諮詢</option>
              <option value="cooperation">合作開發</option>
              <option value="other">其他</option>
            </select>
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-gray-500 text-sm font-bold mb-2">
              訊息內容
            </label>
            <textarea
              className={`block w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-enso-primary transition ${
                errors.message ? "ring-4 ring-red-500" : ""
              }`}
              rows={5}
              placeholder="請在此輸入您的問題及需求"
              {...register("message", { required: "請輸入訊息內容" })}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-enso-primary text-white rounded-full font-bold shadow-sm mb-4 hover:bg-enso-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={submitted}
          >
            {submitted ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              "傳送訊息"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
