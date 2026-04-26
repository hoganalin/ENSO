"use client";

import { useCallback, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import Pagination from "./Pagination";
import useMessage from "../hooks/useMessage";
import { getProductApi } from "../services/product";
import { createAsyncAddCart } from "../slice/cartSlice";
import { currency } from "../assets/utils/filter";

import type { AppDispatch } from "../store/store";
import type { Product } from "../types/product";
//分頁的型別
interface Pagination {
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_pre: boolean;
}
const Products = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [loadingCartId, setLoadingCartId] = useState<string | null>(null);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useMessage();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || ""; //看網址裡面有沒有一個叫做 search 的標籤，如果有，把它後面的內容抓給我。

  const handleAddCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: string,
    qty = 1,
  ) => {
    e.preventDefault();
    setLoadingCartId(productId);
    try {
      await dispatch(createAsyncAddCart({ id: productId, qty })).unwrap();
      showSuccess("已成功加入購物車！");
    } catch (error: unknown) {
      console.error("加入購物車失敗：", error);
      showError(typeof error === "string" ? error : "加入購物車失敗");
    } finally {
      setLoadingCartId(null);
    }
  };

  const handleViewDetail = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: string,
  ) => {
    e.preventDefault();
    setLoadingProductId(productId);
    try {
      router.push(`/product/${productId}`);
    } catch (error: unknown) {
      console.error("導航出錯：", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const getProducts = useCallback(
    async (page = 1, category = currentCategory) => {
      try {
        const response = await getProductApi(page, category);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          showError(error.response?.data?.message || "獲取產品列表失敗");
        } else {
          showError("獲取產品列表失敗");
        }
      }
    },
    [currentCategory, showError],
  );

  const getAllCategories = useCallback(async () => {
    try {
      const response = await getProductApi(1, "all");
      const result = [
        "all",
        ...new Set(
          response.data.products.map((product: Product) => product.category),
        ),
      ] as string[];
      setCategories(result);
    } catch (error: unknown) {
      console.error("獲取類別失敗：", error);
      showError("獲取產品類別失敗");
    }
  }, [showError]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    getProducts(1, currentCategory);
  }, [currentCategory, getProducts]);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()), //用來檢查字串裡面有沒有包含某個字段
  );

  return (
    <>
      <div className="hidden md:block">
        <nav className="flex justify-center">
          <div className="flex overflow-auto gap-3 py-5">
            {categories.map((category) => (
              <button
                key={category}
                className={` whitespace-nowrap  px-6 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  currentCategory === category
                    ? "bg-enso-primary text-white border-enso-primary"
                    : "bg-white text-enso-primary border-gray-300 hover:border-enso-gold hover:text-enso-gold hover:bg-enso-gold/5"
                }`}
                aria-label={`Filter by category: ${category}`}
                onClick={() => setCurrentCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </nav>
      </div>
      <div className="block md:hidden my-4 px-3">
        <select
          className="block w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-enso-primary bg-white"
          value={currentCategory}
          aria-label="Filter by category"
          onChange={(e) => setCurrentCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="max-w-[1180px] mx-auto px-4 mt-3 md:mt-8">
        {searchTerm && (
          <div className="flex items-center mb-4">
            <h5 className="m-0">
              搜尋「<span className="text-enso-primary">{searchTerm}</span>
              」的結果：
            </h5>
            <button
              className="ml-3 text-sm rounded-full px-4 py-1 border border-gray-300 focus:ring-2 focus:ring-enso-primary bg-white hover:bg-gray-100 transition "
              onClick={() => router.push("/product")}
              aria-label="Clear current search"
            >
              清除搜尋
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                data-aos="fade-up"
                data-aos-delay={(index % 4) * 100}
              >
                <div
                  className="group bg-white rounded-xl overflow-hidden flex flex-col h-full
                transition-all duration-400 ease-out
                hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                >
                  {/* 圖片容器：relative 維持正方形 */}
                  <div className="relative w-full aspect-square overflow-hidden bg-[#f8f6f1]">
                    {/* 圖片：填滿容器，hover 時放大 */}
                    <img
                      src={product.imageUrl}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      alt={product.title}
                    />
                    {/* Overlay：hover 時顯示 */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-enso-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="bg-white rounded-full px-4 py-2 shadow-sm hover:bg-gray-100 transition"
                        onClick={(e) => handleViewDetail(e, product.id)}
                        disabled={loadingProductId === product.id}
                        aria-label={`View details for ${product.title}`}
                      >
                        {loadingProductId === product.id ? (
                          <RotatingLines
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="16"
                          />
                        ) : (
                          "查看詳情"
                        )}
                      </button>
                    </div>
                    {/* Badge：左上角 */}
                    <div className="absolute top-3 left-3 z-10 bg-enso-gold text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded">
                      精選
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[11px] text-enso-gold uppercase tracking-widest font-bold mb-2">
                      {product.category}
                    </div>
                    <h4 className="text-[1.15rem] font-semibold mb-2 text-enso-primary leading-snug">
                      {/* leading-snug 控制行高，讓文字更緊密 */}
                      <button
                        className="text-inherit hover:!text-enso-gold transition-colors no-underline text-left w-full"
                        // text-inherit 繼承父層的顏色

                        onClick={(e) => handleViewDetail(e, product.id)}
                      >
                        {product.title}
                      </button>
                    </h4>
                    <p className="text-sm text-enso-text-secondary mb-5 line-clamp-2">
                      {product.description}
                    </p>
                    {/* line-clamp-2: Tailwind 內建的截斷兩行（等同 SCSS 裡的 -webkit-line-clamp） */}
                    <div className="mt-auto flex justify-between items-center">
                      {/* flex使區塊內部的價格和按鈕水平排列 */}
                      <span className="font-semibold text-enso-primary text-[1.1rem]">
                        NT$ {currency(product.price)}
                      </span>
                      <button
                        className="w-10 h-10 rounded-full border border-enso-primary text-enso-primary flex items-center justify-center hover:bg-enso-primary hover:text-white transition-colors disabled:opacity-50"
                        // disabled:opacity-50 = 當按鈕是 disabled 狀態時，透明度變成 50%。
                        title="加入購物車"
                        onClick={(e) => handleAddCart(e, product.id)}
                        disabled={loadingCartId === product.id}
                      >
                        {loadingCartId === product.id ? (
                          <RotatingLines
                            strokeColor="#6a994e"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="20"
                          />
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-12 px-4 w-full">
              <div className="mb-4">
                <i className="fa-solid fa-magnifying-glass text-5xl text-gray-400"></i>
              </div>
              <h4>找不到與「{searchTerm}」相關的產品</h4>
              <p className="text-gray-500">
                請嘗試其他關鍵字，或查看我們的全系列商品
              </p>
              <button
                className=" mt-3 px-6 py-2 bg-enso-primary text-white rounded-full hover:bg-enso-primary/90 transition"
                onClick={() => router.push("/product")}
              >
                查看所有產品
              </button>
            </div>
          )}
        </div>
        {filteredProducts.length > 0 && (
          <Pagination pagination={pagination} onChangePage={getProducts} />
        )}
      </div>
    </>
  );
};

export default Products;
