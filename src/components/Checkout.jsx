import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { createOrderApi } from "../services/cart";
import {
  createAsyncGetCart,
} from "../slice/cartSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cart.carts);
  const totalPrice = useSelector((state) => state.cart.final_total); // 總價
  //useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onFormSubmit = async (data) => {
    const { name, email, tel, address, message } = data;
    const orderData = {
      user: {
        name,
        email,
        tel,
        address,
      },
      message,
    };
    try {
      //送出訂單, 發送一個 POST 請求到 /api/:apiPath/orders
      await createOrderApi(orderData);
      // 結帳後重新整理購物車，讓狀態歸零
      dispatch(createAsyncGetCart());
      // 導向成功結帳頁面
      navigate("/checkout-success");
      reset(); // 重置表單
    } catch (error) {
      console.error("結帳失敗：", error);
      alert("結帳失敗，請稍後再試。");
    }
  };

  return (
    <div className="checkout-page py-5">
      <div className="container">
        {/* ... (進度條保持不變) */}
        {/* 結帳進度條 */}
        <div className="checkout-progress mb-5">
          <div className="step completed">
            <span className="step-num">1</span>
            <span className="step-text">確認購物車</span>
          </div>
          <div className="step-line active"></div>
          <div className="step active">
            <span className="step-num">2</span>
            <span className="step-text">填寫資料</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <span className="step-num">3</span>
            <span className="step-text">完成訂購</span>
          </div>
        </div>

        <div className="row g-5">
          {/* 左側：客戶資訊表單 */}
          <div className="col-lg-7">
            <div className="checkout-form-container">
              <h3 className="section-title mb-4">收件人資訊</h3>
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    電子郵件
                  </label>
                  <input
                    type="email"
                    className="form-control enso-input"
                    id="email"
                    {...register("email", {
                      required: "請輸入 Email",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email 格式不正確",
                      },
                    })}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-danger mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="name" className="form-label">
                      收件人姓名
                    </label>
                    <input
                      type="text"
                      className="form-control enso-input"
                      id="name"
                      {...register("name", {
                        required: "請輸入收件人姓名",
                      })}
                    />
                    {errors.name && (
                      <p className="text-danger">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="col-md-6 mb-4">
                    <label htmlFor="tel" className="form-label">
                      電話
                    </label>
                    <input
                      type="tel"
                      className="form-control enso-input"
                      id="tel"
                      {...register("tel", {
                        required: "請輸入收件人電話",
                        minLength: { value: 8, message: "電話至少 8 碼" },
                        maxLength: { value: 10, message: "電話最多 10 碼" },
                        pattern: {
                          value: /^\d+$/,
                          message: "電話僅能輸入數字",
                        },
                      })}
                    />
                    {errors.tel && (
                      <p className="text-danger">{errors.tel.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="form-label">
                    收件地址
                  </label>
                  <input
                    type="text"
                    className="form-control enso-input"
                    id="address"
                    {...register("address", {
                      required: "請輸入收件地址",
                    })}
                    placeholder="請輸入詳細地址"
                  />
                  {errors.address && (
                    <p className="text-danger">{errors.address.message}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label htmlFor="payment" className="form-label">
                    付款方式
                  </label>
                  <select className="form-select enso-input" id="payment">
                    <option value="credit">信用卡付款</option>
                    <option value="transfer">銀行轉帳</option>
                    <option value="linepay">Line Pay</option>
                  </select>
                </div>

                <h3 className="section-title mb-4">訂單備註</h3>
                <div className="mb-5">
                  <textarea
                    className="form-control enso-input"
                    rows="3"
                    placeholder="有什麼想告訴我們的嗎？"
                    {...register("message")}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <Link
                    to="/cart"
                    className="text-secondary text-decoration-none"
                  >
                    <i className="bi bi-arrow-left me-2"></i>回購物車
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-enso-primary btn-lg px-5"
                  >
                    提交訂單
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 右側：訂單摘要 */}
          <div className="col-lg-5">
            <div className="order-summary-card">
              <h3 className="summary-title mb-4">訂單摘要</h3>
              <div className="item-list mb-4">
                {carts?.map((item) => (
                  <div
                    className="summary-item d-flex align-items-center mb-3"
                    key={item.id}
                  >
                    <div className="item-img-mini me-3">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.title}
                      />
                    </div>
                    <div className="item-info flex-grow-1">
                      <p className="item-name m-0">{item.product?.title}</p>
                      <p className="item-qty m-0 text-secondary">
                        x {item.qty}
                      </p>
                    </div>
                    <div className="item-price">NT${item.total}</div>
                  </div>
                ))}
              </div>

              <div className="price-details pt-4 border-top">
                <div className="d-flex justify-content-between mb-3">
                  <span>小計</span>
                  <span>NT${totalPrice}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>運費</span>
                  <span className="text-success">
                    {totalPrice >= 800 ? "免運" : "NT$50"}
                  </span>
                </div>
                <div className="d-flex justify-content-between total-price pt-3 border-top mt-3">
                  <strong>總計</strong>
                  <strong className="text-enso-gold h4 m-0">
                    NT {totalPrice >= 800 ? totalPrice : totalPrice + 50}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
