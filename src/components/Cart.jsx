import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router";

import { currency } from "../assets/utils/filter";
import useMessage from "../hooks/useMessage";
import {
  createAsyncDeleteAllCart,
  createAsyncDeleteSingleCart,
  createAsyncUpdateCart,
} from "../slice/cartSlice";

function Cart() {
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useMessage();
  const [loadingCartId, setLoadingCartId] = useState("");

  const handleDeleteSingleCart = async (e, id) => {
    e.preventDefault();
    setLoadingCartId(id);
    try {
      await dispatch(createAsyncDeleteSingleCart(id)).unwrap();
      showSuccess("已從購物車移除項目");
    } catch (error) {
      showError(error || "刪除失敗");
    } finally {
      setLoadingCartId("");
    }
  };

  const handleDeleteAllCart = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAsyncDeleteAllCart()).unwrap();
      showSuccess("購物車已成功清空");
    } catch (error) {
      showError(error || "清空失敗");
    }
  };

  // 數量增減：接收購物車ID, 產品ID 與新數量
  const handleQtyChange = async (cartId, productId, qty) => {
    setLoadingCartId(cartId);
    try {
      await dispatch(
        createAsyncUpdateCart({ id: cartId, product_id: productId, qty }),
      ).unwrap();
    } catch (error) {
      showError(error || "更新數量失敗");
    } finally {
      setLoadingCartId("");
    }
  };

  return (
    <div className="container py-5">
      {/* 結帳進度條 */}
      <div className="checkout-progress mb-5">
        <div className="step active">
          <span className="step-num">1</span>
          <span className="step-text">確認購物車</span>
        </div>
        <div className="step-line "></div>
        <div className="step ">
          <span className="step-num">2</span>
          <span className="step-text">填寫資料</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-num">3</span>
          <span className="step-text">完成訂購</span>
        </div>
      </div>
      <div className="row justify-content-center">
        <div
          className="col-md-6 bg-white py-5"
          style={{
            minHeight: "calc(100vh - 56px - 76px)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h2 className="m-0 h4 fw-bold text-dark">購物車明細</h2>
            {carts.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                onClick={handleDeleteAllCart}
                aria-label="Clear all items from shopping cart"
              >
                <i className="fas fa-trash-alt me-2"></i>
                <small>清空全部</small>
              </button>
            )}
          </div>
          {carts?.map((cartItem) => (
            <div className="d-flex mt-4 bg-light" key={cartItem.id}>
              <img
                src={cartItem.product.imageUrl}
                alt=""
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                }}
              />
              <div className="w-100 p-3 position-relative pe-5">
                <button
                  type="button"
                  className="btn p-0 border-0 position-absolute"
                  style={{ top: "12px", right: "12px", lineHeight: 1 }}
                  onClick={(e) => handleDeleteSingleCart(e, cartItem.id)}
                  disabled={loadingCartId === cartItem.id}
                  aria-label={`Remove ${cartItem.product.title} from cart`}
                >
                  {loadingCartId === cartItem.id ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-times text-muted"></i>
                  )}
                </button>
                <p className="mb-0 fw-bold">{cartItem.product.title}</p>
                <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                  {cartItem.product.description}
                </p>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="single-product__qty-selector">
                    <button
                      type="button"
                      disabled={
                        cartItem.qty === 1 || loadingCartId === cartItem.id
                      }
                      aria-label="Decrease quantity"
                      onClick={() =>
                        handleQtyChange(
                          cartItem.id,
                          cartItem.product_id,
                          cartItem.qty - 1,
                        )
                      }
                    >
                      {loadingCartId === cartItem.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "−"
                      )}
                    </button>
                    <input type="number" value={cartItem.qty} aria-label="Quantity" readOnly />
                    <button
                      type="button"
                      disabled={loadingCartId === cartItem.id}
                      aria-label="Increase quantity"
                      onClick={() =>
                        handleQtyChange(
                          cartItem.id,
                          cartItem.product_id,
                          cartItem.qty + 1,
                        )
                      }
                    >
                      {loadingCartId === cartItem.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        "+"
                      )}
                    </button>
                  </div>
                  <p className="mb-0 ms-auto text-gold fw-bold">
                    NT${currency(cartItem.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4 border-top pt-4">
            <p className="mb-0 h4 fw-bold">總計</p>
            <p className="mb-0 h4 fw-bold text-gold">
              NT${currency(carts.reduce((acc, item) => acc + item.total, 0))}
            </p>
          </div>
          {carts.length === 0 ? (
            <button
              className="btn btn-dark w-100 mt-4 rounded-3 py-3 fw-bold border-0 opacity-50"
              style={{ cursor: "not-allowed" }}
              disabled
            >
              購物車是空的喔
            </button>
          ) : (
            <Link
              to="/checkout"
              className="btn btn-dark w-100 mt-4 rounded-3 py-3 fw-bold decoration-none text-white text-center d-block"
              aria-label="Proceed to checkout"
            >
              確認結帳
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
export default Cart;
