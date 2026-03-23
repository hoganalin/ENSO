import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import Swal from "sweetalert2";

import logo from "../images/logo.png";

import { createAsyncGetCart } from "../slice/cartSlice";

function Header() {
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  // 計算購物車內所有商品的總數量 (例如 1 個 A 產品 + 2 個 B 產品 = 總共 3 件)
  const cartTotalQty =
    carts?.reduce((acc, curr) => acc + (curr.qty || 0), 0) || 0;
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();

  // 檢查是否已登入
  const isLoggedIn = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="));

  const handleLogout = () => {
    Swal.fire({
      title: "確定要登出嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a4636",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定登出",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        document.cookie =
          "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        Swal.fire({
          title: "已成功登出",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchItem.trim()) {
      navigate(`/product?search=${searchItem.trim()}`);
      setSearchItem(""); // 搜尋後清空
    }
  };

  return (
    <div className="bg-navbar  shadow-sm">
      <div className="container px-0 px-lg-3">
        <nav className="navbar navbar-expand-lg navbar-light py-3">
          {/* 1. Logo (左側) */}
          <Link className="navbar-brand ms-3 ms-lg-0" to="/" aria-label="Enso Incense Home">
            <div className="d-flex header-logo-wrapper">
              <img src={logo} alt="Enso logo" className="header-logo-image" />
              <div className="header-logo-text">
                <p className="header-logo mb-0">ENSO</p>
                <p className="header-sublogo mb-0">INCENSE</p>
              </div>
            </div>
          </Link>

          {/* 2. 行動版控制群組 (右側：登入、購物車、漢堡選單) */}
          <div className="d-flex align-items-center ms-auto me-2 me-lg-0 order-lg-3">
            <div className="d-flex align-items-center">
              {isLoggedIn ? (
                <button
                  className="btn btn-link link-dark text-decoration-none p-0 me-3 me-lg-4 d-flex align-items-center"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <i className="fa-solid fa-right-from-bracket fs-5"></i>
                  <span className="small d-none d-md-inline ms-2">登出</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="link-dark text-decoration-none me-3 me-lg-4 d-flex align-items-center"
                  aria-label="Login"
                >
                  <i className="fa-regular fa-user fs-5"></i>
                  <span className="small d-none d-md-inline ms-2">登入</span>
                </Link>
              )}
              <Link
                to="/cart"
                className="position-relative d-flex align-items-center link-dark me-2 me-lg-0"
                aria-label={`View shopping cart, ${cartTotalQty} items`}
              >
                <i className="fa-solid fa-cart-shopping fs-5"></i>
                {cartTotalQty > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {cartTotalQty}
                  </span>
                )}
              </Link>
            </div>

            {/* 漢堡選單按鈕 (僅行動版顯示) */}
            <button
              className="navbar-toggler border-0 shadow-none ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list fs-2"></i>
            </button>
          </div>

          {/* 3. 摺疊選單內容 */}
          <div
            className="collapse navbar-collapse justify-content-center order-lg-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 mx-lg-4">
              <li className="nav-item">
                <Link
                  className="nav-link px-3 fw-medium text-dark"
                  to="/product"
                >
                  線香商品
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 fw-medium text-dark" to="/about">
                  關於品牌
                </Link>
              </li>
            </ul>

            {/* 搜尋框 (桌面版在中間/右側，行動版在摺疊清單內) */}
            <form
              className="d-flex mt-3 mt-lg-0 px-3 px-lg-0"
              role="search"
              onSubmit={handleSearch}
            >
              <div className="input-group input-group-sm border rounded-pill overflow-hidden bg-white px-2 py-1 shadow-sm w-100">
                <input
                  className="form-control border-0 shadow-none bg-transparent"
                  type="search"
                  placeholder="搜尋產品..."
                  aria-label="Search items"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
                <button 
                  className="btn border-0 text-muted" 
                  type="submit"
                  aria-label="Submit search"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </form>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
