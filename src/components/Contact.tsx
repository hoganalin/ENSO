import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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

  //一個接收 ContactFormData 作為參數的表單送出函式
  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    console.log("聯絡表單資料：", data);
    setSubmitted(true);
    // 模擬傳送資料
    await new Promise((resolve) => setTimeout(resolve, 1500));
    reset();
    alert("您的訊息已成功送出，我們將儘快與您聯繫！");
    setSubmitted(false);
  };

  return (
    <div className="contact-page container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">聯絡我們</h2>
            <p className="text-muted small">
              任何關於產品或合作的問題，歡迎隨時與我們聯繫
            </p>
            <div
              className="mx-auto"
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: "#c7a15a",
              }}
            ></div>
          </div>

          <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-4 p-md-5">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">
                  您的姓名
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg border-0 bg-light rounded-3 ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  placeholder="請輸入姓名"
                  {...register("name", { required: "姓名是必填欄位" })}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">
                  電子郵件
                </label>
                <input
                  type="email"
                  className={`form-control form-control-lg border-0 bg-light rounded-3 ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="name@example.com"
                  {...register("email", emailValidation)}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">
                  主旨
                </label>
                <select
                  className={`form-select form-select-lg border-0 bg-light rounded-3 ${
                    errors.subject ? "is-invalid" : ""
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
                  <div className="invalid-feedback">
                    {errors.subject.message}
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="form-label text-secondary small fw-bold">
                  訊息內容
                </label>
                <textarea
                  className={`form-control border-0 bg-light rounded-3 ${
                    errors.message ? "is-invalid" : ""
                  }`}
                  rows="5"
                  placeholder="請在此輸入您的問題及需求"
                  {...register("message", { required: "請輸入訊息內容" })}
                ></textarea>
                {errors.message && (
                  <div className="invalid-feedback">
                    {errors.message.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm"
                disabled={submitted}
              >
                {submitted ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                傳送訊息
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
