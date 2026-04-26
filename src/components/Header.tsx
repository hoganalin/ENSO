"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import type { RootState, AppDispatch } from "../store/store";
import { logout as logoutAction } from "../slice/authSlice";
import Swal from "sweetalert2";

import { createAsyncGetCart } from "../slice/cartSlice";

function Header(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const carts = useSelector((state: RootState) => state.cart.carts);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  const cartTotalQty =
    carts?.reduce((acc, curr) => acc + (curr.qty || 0), 0) || 0;
  const [searchItem, setSearchItem] = useState("");
  const [navLoadingLabel, setNavLoadingLabel] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 路由切換完成後關閉 loading 遮罩
  useEffect(() => {
    setNavLoadingLabel(null);
  }, [pathname]);

  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

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
        localStorage.removeItem("auth");
        dispatch(logoutAction());
        Swal.fire({
          title: "已成功登出",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/");
      }
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchItem.trim()) {
      router.push(`/product?search=${searchItem.trim()}`);
      setSearchItem("");
    }
  };

  return (
    <>
      {navLoadingLabel && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label={navLoadingLabel}
        >
          <RotatingLines
            strokeColor="#ffffff"
            strokeWidth="4"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
          <p className="mt-4 text-white text-lg font-medium">
            {navLoadingLabel}
          </p>
        </div>
      )}
    <div className="bg-white  shadow-sm">
      <div className="max-w-[1180px] mx-auto px-0 lg:px-4">
        <nav className="flex flex-wrap items-center py-3">
          {/* 1. Logo (左側) */}
          <Link
            className="ml-3 lg:ml-0 lg:order-1"
            href="/"
            aria-label="Enso Incense Home"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Enso logo"
                className="h-8 w-auto"
              />
              <p className="font-bold text-lg m-0 tracking-wider">ENSO</p>
              <p className="text-xs text-gray-500 m-0 hidden md:inline">
                INCENSE
              </p>
            </div>
          </Link>

          {/* 2. 行動版控制群組 (右側：登入、購物車、漢堡選單) */}
          <div className="flex items-center ml-auto mr-2 lg:mr-0 lg:order-3">
            <div className="flex items-center">
              {isLoggedIn ? (
                <button
                  className="flex items-center no-underline text-gray-900 mr-3 lg:mr-4 hover:text-enso-gold"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <i className="fa-solid fa-right-from-bracket text-lg"></i>
                  <span className="text-sm hidden md:inline ml-2">登出</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center no-underline text-gray-900 mr-3 lg:mr-4 hover:text-enso-gold"
                  aria-label="Login"
                  onClick={() => setNavLoadingLabel("前往登入頁…")}
                >
                  <i className="fa-regular fa-user text-lg"></i>
                  <span className="text-sm hidden md:inline ml-2">登入</span>
                </Link>
              )}
              <Link
                href="/cart"
                className="relative flex items-center text-gray-900 mr-2 lg:mr-0 hover:text-enso-gold"
                aria-label={`View shopping cart, ${cartTotalQty} items`}
                onClick={() => setNavLoadingLabel("前往購物車…")}
              >
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                {cartTotalQty > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartTotalQty}
                  </span>
                )}
              </Link>
            </div>

            {/* 漢堡選單按鈕 (僅行動版顯示) */}
            <button
              className="ml-4 lg:hidden text-2xl"
              type="button"
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list "></i>
            </button>
          </div>

          {/* 3. 摺疊選單內容 */}
          <div
            className={`${menuOpen ? "block" : "hidden"} lg:flex lg:items-center lg:justify-center w-full lg:w-auto lg:flex-1 lg:order-2`}
            id="navbarSupportedContent"
          >
            <ul className="flex flex-col lg:flex-row list-none mb-2 lg:mb-0 lg:mx-4">
              <li className="nav-item">
                <Link
                  className="block py-2 px-3 font-medium text-gray-900 no-underline hover:text-enso-gold"
                  href="/product"
                >
                  線香商品
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="block py-2 px-3 font-medium text-gray-900 no-underline hover:text-enso-gold"
                  href="/about"
                >
                  關於品牌
                </Link>
              </li>
            </ul>

            {/* 搜尋框 */}
            <form
              className="flex  lg:mt-0 px-3 lg:px-0"
              role="search"
              onSubmit={handleSearch}
            >
              <div className="flex items-center border rounded-full overflow-hidden bg-white px-2 py-1 shadow-sm w-full">
                <input
                  className="flex-1 border-0 outline-none bg-transparent px-2"
                  type="search"
                  placeholder="搜尋產品..."
                  aria-label="Search items"
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
                <button
                  className="border-0 text-gray-500 bg-transparent"
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
    </>
  );
}

export default Header;
