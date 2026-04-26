"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";

import useMessage from "../hooks/useMessage";
import { getSingleProductApi } from "../services/product";
import { createAsyncAddCart } from "../slice/cartSlice";
import { currency } from "../assets/utils/filter";
//引入interface
import type { AppDispatch } from "../store/store";
import type { Product } from "../types/product";

interface SingleProductProps {
  id: string;
}

function SingleProduct({ id }: SingleProductProps): JSX.Element {
  const [product, setProduct] = useState<Product>({} as Product);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { showSuccess, showError } = useMessage();

  useEffect(() => {
    if (!id) return;
    const getProduct = async (productId: string) => {
      try {
        const response = await getSingleProductApi(productId);
        setProduct(response.data.product);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(error.response || error.message);
        } else {
          console.error(error);
        }
        showError("獲取產品資料失敗");
      }
    };

    getProduct(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 加入購物車
  const handleAddCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await dispatch(createAsyncAddCart({ id: product.id, qty })).unwrap();
      showSuccess("已成功加入購物車！");
    } catch (error: unknown) {
      showError(typeof error === "string" ? error : "加入購物車失敗");
    }
  };

  // 數量增減
  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-[1180px] mx-auto single-product">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ========== 左側：圖片區 ========== */}
        <div data-aos="fade-right">
          <div className="single-product__gallery">
            {/* 主圖 */}
            <img
              src={product.imageUrl}
              alt={product.title}
              className="single-product__main-img"
            />

            {/* 副圖縮圖列 */}
            {product.imagesUrl?.length > 0 && (
              <div className="single-product__thumbs">
                {product.imagesUrl.map((image) => (
                  <img key={image} src={image} alt="" />
                ))}
              </div>
            )}

            {/* 特色標籤 */}
            <div className="single-product__features">
              <div className="single-product__feature-item --natural">
                <span className="feature-label">天然原料</span>
              </div>
              <div className="single-product__feature-item --handmade">
                <span className="feature-label">手工製作</span>
              </div>
              <div className="single-product__feature-item --low-smoke">
                <span className="feature-label">低煙配方</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 右側：產品資訊 ========== */}
        <div
          className="single-product__info"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          {/* 分類 */}
          <div className="single-product__category">{product.category}</div>

          {/* 產品名稱 */}
          <h1 className="single-product__title">{product.title}</h1>
          <div className="single-product__title-divider"></div>
          {/* 英文副標 - 如果沒有 eng_title，顯示 description 的部分或預設 */}
          <div className="single-product__subtitle">
            {product.eng_title || "Premium Incense Series"}
          </div>

          {/* 價格 */}
          <div className="single-product__price-row flex items-baseline">
            <span className="single-product__price">
              NT${currency(product.price)}
            </span>
            {product.origin_price && product.origin_price !== product.price && (
              <span className="single-product__origin-price">
                NT${currency(product.origin_price)}
              </span>
            )}
          </div>

          {/* 描述 */}
          <p className="single-product__desc">{product.description}</p>

          {/* Aroma Notes 區塊 */}
          <div className="single-product__aroma-card">
            <h6 className="aroma-card-title uppercase">Aroma Notes</h6>
            <div className="grid grid-cols-3 gap-0 aroma-grid">
              <div className="aroma-item">
                <span className="aroma-label">前調 TOP</span>
                <span className="aroma-value">
                  {product.top_smell || "---"}
                </span>
              </div>
              <div className="aroma-item">
                <span className="aroma-label">中調 HEART</span>
                <span className="aroma-value">
                  {product.heart_smell || "---"}
                </span>
              </div>
              <div className="aroma-item">
                <span className="aroma-label">基調 BASE</span>
                <span className="aroma-value">
                  {product.base_smell || "---"}
                </span>
              </div>
            </div>
          </div>

          {/* 產品規格 */}
          <div className="single-product__specs-list ">
            <div className="spec-item">
              <span className="spec-label">燃燒時間</span>
              <span className="spec-value ">
                {product.burning_time || "約 40 分鐘 / 支"}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">香煙特性</span>
              <span className="spec-value">{product.feature}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">每盒數量</span>
              <span className="spec-value">20 支</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">庫存數量</span>
              <span
                className="spec-value"
                style={
                  product.inventory == null
                    ? { color: "#9e9e9e" }
                    : product.inventory < 5
                      ? { color: "#e53935" }
                      : undefined
                }
              >
                {product.inventory != null ? `${product.inventory} 盒` : "缺貨"}
              </span>
            </div>
          </div>

          {/* 數量選擇器 + 加入購物車 */}
          <div className="single-product__purchase-controls">
            <div className="flex gap-3 mb-3 ">
              <div className="single-product__qty-selector flex justify-center">
                <button
                  type="button"
                  onClick={() => handleQtyChange(-1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  aria-label="Quantity"
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button
                  type="button"
                  onClick={() => handleQtyChange(1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="single-product__add-cart-btn mb-0 mt-0 grow"
                onClick={handleAddCart}
                aria-label={`Add ${product.title} to cart`}
              >
                加入購物車
              </button>
            </div>

            <a
              href="#"
              className="single-product__go-cart-btn"
              aria-label="Go to shopping cart"
              onClick={(e) => {
                e.preventDefault();
                router.push("/cart");
              }}
            >
              前往購物車
            </a>
          </div>

          {/* 免運提示 */}
          <div className="single-product__shipping-notice">
            <span className="shipping-icon">🚚</span>
            <span className="shipping-text">
              滿 NT$800 免運費 ・ 2-3 個工作天到貨
            </span>
          </div>
        </div>
      </div>

      {/* ========== 香氣體驗 ========== */}
      <section className="single-product__experience">
        <div className="relative z-[2] max-w-[1180px] mx-auto px-4 mt-3 md:mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <div className="experience-content">
                <span className="experience-subtitle">
                  THE SCENT EXPERIENCE
                </span>
                <h2 className="experience-title">香氣體驗</h2>
                <div className="experience-divider"></div>
                <p className="experience-desc">{product.content}</p>

                <div className="experience-scenes">
                  <span className="scenes-label">適合場景</span>
                  <ul className="scenes-list">
                    {product.scenes?.map((scene, index) => (
                      <li key={index}>{scene}</li>
                    ))}
                  </ul>
                </div>

                <div className="experience-quote">
                  <p>
                    ”靜下心，讓香氣帶你回到當下。每次點燃，都是給自己的一份禮物。”
                  </p>
                </div>
              </div>
            </div>
            <div data-aos="fade-left" data-aos-delay="200">
              <div className="experience-grid">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="experience-card --ritual">
                    <h5 className="card-title">儀式感</h5>
                    <p className="card-text">點燃線香，開始屬於你的靜心時刻</p>
                  </div>

                  <div className="experience-card --low-smoke">
                    <h5 className="card-title">低煙配方</h5>
                    <p className="card-text">適合室內空間，不嗆鼻刺鼻</p>
                  </div>

                  <div className="experience-card --time">
                    <h5 className="card-title">
                      {product.burning_time || "約 40 分鐘 / 支"}
                    </h5>
                    <p className="card-text">充裕的冥想時間</p>
                  </div>

                  <div className="experience-card --natural">
                    <h5 className="card-title">天然原料</h5>
                    <p className="card-text">有機農場直採，純淨無添加</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 使用方式 ========== */}
      <section className="single-product__how-to">
        <div className="max-w-[1180px] mx-auto px-4 mt-3 md:mt-8">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="how-to-subtitle">HOW TO USE</span>
            <h2 className="how-to-title">使用方式</h2>
            <div className="how-to-divider mx-auto"></div>
          </div>

          <div className="how-to-steps-wrapper">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div data-aos="fade-up" data-aos-delay="100">
                <div className="step-item text-center">
                  <div className="step-number-badge">01</div>
                  <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1642440237426-d6993042d012?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="點燃頂端"
                    />
                  </div>
                  <h4 className="step-title font-bold">點燃頂端</h4>
                  <p className="step-desc text-gray-500">
                    以火柴或打火機點燃線香頂端，待其出現穩定的小火焰。
                  </p>
                </div>
              </div>
              <div data-aos="fade-up" data-aos-delay="200">
                <div className="step-item text-center">
                  <div className="step-number-badge">02</div>
                  <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1627809381019-976c0d1adc98?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="輕輕吹熄"
                    />
                  </div>
                  <h4 className="step-title font-bold">輕輕吹熄</h4>
                  <p className="step-desc text-gray-500">
                    輕輕吹熄明火，讓線香尖端保持微亮的紅光，香氣由此緩緩散出。
                  </p>
                </div>
              </div>
              <div data-aos="fade-up" data-aos-delay="300">
                <div className="step-item text-center">
                  <div className="step-number-badge">03</div>
                  <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1715070990039-c6ef0ad6c2c2?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="放入香插"
                    />
                  </div>
                  <h4 className="step-title font-bold">放入香插</h4>
                  <p className="step-desc text-gray-500">
                    將線香垂直插入香插或香灰中，選一個你喜愛的角落，讓香氣在空間流動。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-to-notice mt-5" data-aos="fade-up">
            <div className="notice-content flex items-center">
              <span className="notice-icon">⚠️</span>
              <p className="notice-text">
                <strong>使用注意事項：</strong>
                請放置於隔熱香插上，遠離易燃物品。使用時保持空間通風。勿讓兒童或寵物接近燃燒中的線香。離開房間前請確認已完全熄滅。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SingleProduct;
