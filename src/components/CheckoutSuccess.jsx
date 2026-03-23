import { useState } from "react";
import { Link } from "react-router";

function CheckoutSuccess() {
  // 使用 useState 確保重新渲染時訂單編號不會變動且避免 impurity 錯誤
  const [orderNumber] = useState(
    () => "ENSO" + Math.floor(Math.random() * 10000000)
  );

  return (
    <div className="checkout-success-page py-5 bg-custom-light">
      <div className="container py-5">
        {/* 結帳進度條 */}
        <div className="checkout-progress mb-5 px-md-5">
          <div className="step completed">
            <span className="step-num">1</span>
            <span className="step-text">確認購物車</span>
          </div>
          <div className="step-line active"></div>
          <div className="step completed">
            <span className="step-num">2</span>
            <span className="step-text">填寫資料</span>
          </div>
          <div className="step-line active"></div>
          <div className="step active">
            <span className="step-num">3</span>
            <span className="step-text">訂單完成</span>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm p-5 text-center rounded-4">
              <div className="success-icon-wrapper mb-4">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "5rem" }}
                ></i>
              </div>
              <h2 className="fw-bold mb-3">訂單已成功提交</h2>
              <p className="text-secondary mb-4 px-md-5">
                感謝您的訂購！我們已收到您的訂單，正在為您準備精心挑選的香氣產品。
              </p>

              <div className="order-info-box bg-light-beige p-3 rounded-3 mb-5">
                <p className="mb-1 text-secondary small">訂單編號</p>
                <h4 className="fw-bold text-enso-gold mb-0">{orderNumber}</h4>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link to="/" className="btn btn-outline-dark px-4 py-2">
                  返回首頁
                </Link>
                <Link
                  to="/products"
                  className="btn btn-secondary px-4 py-2 text-white"
                >
                  繼續選購
                </Link>
              </div>
            </div>

            <div className="text-center mt-5 text-secondary">
              <p className="small">
                稍後將會寄送「訂單確認信」至您的電子郵件信箱。
                <br />
                如有任何疑問，歡迎隨時與我們的客服中心聯繫。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
