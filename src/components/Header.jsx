import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router"; // 確保 useNavigate 被導入

import logo from "../images/logo.png";

import { createAsyncGetCart } from "../slice/cartSlice";

function Header() {
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();

  // 檢查是否已登入
  const isLoggedIn = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="));

  const handleLogout = () => {
    if (window.confirm("確定要登出嗎？")) {
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      alert("已成功登出");
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchItem.trim()) {
      navigate(`/product?search=${searchItem.trim()}`);
      setSearchItem(""); // 搜尋後清空
    }
  };

  return (
    <div className="bg-navbar">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand d-inline-block text-center" to="/">
            <div className="d-flex header-logo-wrapper">
              <img src={logo} alt="Enso logo" className="header-logo-image" />

              <div className="header-logo-text">
                <p className="header-logo mb-0">ENSO</p>
                <p className="header-sublogo mb-0">INCENSE</p>
              </div>
            </div>
          </Link>

          <div className="d-flex align-items-center ms-lg-3 me-3 me-lg-0 ms-auto order-lg-3">
            {isLoggedIn ? (
              <button
                className="btn btn-link link-dark text-decoration-none p-0 me-4 d-flex align-items-center"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i>
                <span className="small">登出</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="link-dark text-decoration-none me-4 d-flex align-items-center"
              >
                <i className="fa-regular fa-user me-2"></i>
                <span className="small">登入</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="position-relative d-inline-block link-dark"
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {carts?.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  {carts?.length}
                </span>
              )}
            </Link>
          </div>

          <button
            className="navbar-toggler order-lg-4 ms-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse order-lg-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item active">
                <Link className="nav-link" to="/product">
                  線香商品 <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  禮盒推薦
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  關於品牌
                </Link>
              </li>
            </ul>

            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <div className="input-group input-group-sm border rounded-pill overflow-hidden bg-white px-2">
                <input
                  className="form-control border-0 shadow-none bg-transparent"
                  type="search"
                  placeholder="搜尋產品名稱..."
                  aria-label="Search"
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
