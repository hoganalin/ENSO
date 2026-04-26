"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { getProductApi } from "../../services/product";

const heroVideoSrc = "/videos/hero.webm";
const iconMeditationSrc = "/images/冥想香氣.png";
const iconRelaxationSrc = "/images/放鬆紓壓.png";
const iconPurificationSrc = "/images/空間淨化.png";
//引入型別
import type { Product } from "../../types/product";

export default function Home(): JSX.Element {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await getProductApi(1, "線香");
        // 如果沒有線香分類，就拿全部
        const products =
          response.data.products.length > 0
            ? response.data.products
            : (await getProductApi(1, "all")).data.products;
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };
    getProducts();
  }, []);

  const handleViewDetail = (id: string) => {
    router.push(`/product/${id}`);
  };

  return (
    <>
      <header className="hero-header">
        <div className="hero-header__bg" aria-hidden="true">
          {/* Hero Swiper (暫時先註解，改用影片) */}
          {/*
          <Swiper
            className="hero-header__swiper"
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            <SwiperSlide>
              <img src={hero1} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={hero2} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={hero3} alt="" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={hero4} alt="" />
            </SwiperSlide>
          </Swiper>
          */}

          <video
            className="hero-header__video"
            autoPlay
            muted
            loop
            playsInline
            suppressHydrationWarning
          >
            <source src={heroVideoSrc} type="video/webm" />
          </video>

          <div className="hero-header__overlay" />
        </div>

        <div className="max-w-[1180px] mx-auto hero-header__inner">
          <section
            className="hero-header__content flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <p className="text-yellow mb-3">天然手工製作 ， 日本原料</p>

            <h1 className="mb-3 hero-header__content_title ">
              <span className="block text-white">點燃一縷香</span>
              <span className="block text-enso-gold">靜下心</span>
            </h1>

            <div className="text-gray-550 mb-5">
              <p className="mb-1">Find Your Inner Silence</p>
              <p className="mb-0">每一縷煙， 都是回歸自我的邀請</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/product"
                className="py-3 px-8 bg-enso-primary text-white rounded-full font-bold hover:bg-enso-primary/90 transition"
                aria-label="Shop our incense products now"
              >
                立即選購
              </Link>
              <Link
                href="/about"
                className="py-2 px-6 border border-white text-white rounded-full hover:bg-white hover:text-enso-primary transition"
                aria-label="Read our brand story"
              >
                品牌故事
              </Link>
            </div>
          </section>
        </div>
      </header>

      {/* 探索香氣世界 */}
      <div>
        <section className="section-padding bg-custom-light section-explore">
          <div className="max-w-[1180px] mx-auto">
            <div className="text-center mb-5" data-aos="fade-up">
              <span className="collection-title-sub block mb-2">
                COLLECTION
              </span>
              <h2 className="collection-title">探索香氣世界</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div data-aos="fade-up" data-aos-delay="100">
                <div className="h-full shadow-sm collection-card realtive overflow-hidden">
                  <div
                    className="collection-card-bg"
                    style={{ backgroundImage: `url(${iconMeditationSrc})` }}
                  />
                  <div className="text-center p-4 py-5 relative z-[1]">
                    <div
                      className="collection-icon mb-4 mx-auto"
                      style={{
                        backgroundImage: `url(${iconMeditationSrc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <h6 className="collection-title-sub mb-3">MEDITATION</h6>
                    <h3 className="text-xl font-bold mb-3">冥想香氣</h3>
                    <p className="text-gray-500 text-sm">深度靜心 • 專注當下</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div data-aos="fade-up" data-aos-delay="200">
                <div className="h-full shadow-sm collection-card realtive overflow-hidden">
                  <div
                    className="collection-card-bg"
                    style={{ backgroundImage: `url(${iconRelaxationSrc})` }}
                  />
                  <div className="text-center p-4 py-5 relative z-[1]">
                    <div
                      className="collection-icon mb-4 mx-auto"
                      style={{
                        backgroundImage: `url(${iconRelaxationSrc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <h6 className="collection-title-sub mb-3">RELAXATION</h6>
                    <h3 className="text-xl font-bold mb-3">放鬆舒壓</h3>
                    <p className="text-gray-500 text-sm">釋放壓力 • 安眠修復</p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div data-aos="fade-up" data-aos-delay="300">
                <div className="h-full shadow-sm collection-card realtive overflow-hidden">
                  <div
                    className="collection-card-bg"
                    style={{ backgroundImage: `url(${iconPurificationSrc})` }}
                  />
                  <div className="text-center p-4 py-5 relative z-[1]">
                    <div
                      className="collection-icon mb-4 mx-auto"
                      style={{
                        backgroundImage: `url(${iconPurificationSrc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <h6 className="collection-title-sub mb-3">PURIFICATION</h6>
                    <h3 className="text-xl font-bold mb-3">空間淨化</h3>
                    <p className="text-gray-500 text-sm">清淨能量 • 淨化靈魂</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 精選線香 */}
      <section className="section-padding bg-enso-cream section-featured">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-start mb-5" data-aos="fade-up">
            <span className="collection-title-sub block mb-2">
              FEATURED INCENSE
            </span>
            <div className="flex items-center justify-between">
              <h2 className="collection-title mb-0">精選線香</h2>
              <Link
                href="/product"
                className="px-4 py-2 border border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition no-underline btn-hover-effect"
                aria-label="View more featured incense products"
              >
                查看更多
              </Link>
            </div>
          </div>

          {/* 精選線香輪播區 */}
          <div
            className="mb-5 featured-carousel"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              className="featured-swiper"
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {featuredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="h-full shadow-sm collection-card">
                    <img
                      className="w-full h-80 object-contain bg-[#f8f6f1]"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                    <div className="p-4 text-center">
                      <h4 className="font-bold mb-3">{product.title}</h4>
                      <p className="text-gray-500 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <button
                        onClick={() => handleViewDetail(product.id)}
                        className="cursor-pointer w-full py-2 border border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition btn-hover-effect"
                        aria-label={`View detailed information for ${product.title}`}
                      >
                        詳細介紹
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      {/* 品牌故事 */}
      <section className="section-padding bg-custom-light section-story">
        <div className="max-w-[1180px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* 左半邊 */}
            <div className="lg:pr-10" data-aos="fade-right">
              <span className="collection-title-sub block mb-3 uppercase">
                Our Story
              </span>
              <h2 className="story-title block">香，是時間的藝術</h2>

              <div className="story-text-content">
                <p>
                  我們相信，一縷香可以改變空間的能量。ENSO 創立於 2018
                  年，名取禪宗「圓相」之意——代表完整與空無的共存。
                </p>
                <p>
                  每一支線香，皆由工匠手工捲製，採用日本、印度與斯里蘭卡有機農場的天然原料，低煙配方讓香氛更適合現代室內空間。
                </p>
              </div>

              <button className="cursor-pointer mt-2 rounded-xl px-6 py-2 bg-enso-primary text-white font-bold hover:bg-enso-primary/90 transition btn-hover-effect">
                閱讀品牌故事
              </button>
            </div>

            {/* 右半邊: 2x2 Card Grid */}
            <div data-aos="fade-left" data-aos-delay="200">
              <div className="grid grid-cols-2 gap-3">
                {/* 左上 */}

                <div className="story-feature-card bg-enso-primary shadow-sm --natural">
                  <div className="emoji-icon">
                    <i className="bi bi-leaf"></i>

                    <h6
                      className=" font-bold mb-1"
                      style={{ color: "#c9a063", fontSize: "15px" }}
                    >
                      天然原料
                    </h6>
                    <p className="text-sm text-white/50">100% 有機</p>
                  </div>
                </div>
                {/* 右上 */}
                <div className="story-feature-card bg-light-beige shadow-sm --handmade">
                  <div className="emoji-icon">
                    <i className="bi bi-person-hearts"></i>
                  </div>
                  <h6
                    className="font-bold mb-1 text-gray-600"
                    style={{ fontSize: "15px" }}
                  >
                    手工製作
                  </h6>
                  <p className="text-sm text-gray-600 opacity-75">職人工藝</p>
                </div>
                {/* 左下 */}
                <div className="story-feature-card bg-light-beige shadow-sm --sustainability">
                  <div className="emoji-icon">
                    <i className="bi bi-globe2"></i>
                  </div>
                  <h6
                    className="font-bold mb-1 text-gray-600"
                    style={{ fontSize: "15px" }}
                  >
                    永續包裝
                  </h6>
                  <p className="text-sm text-gray-600 opacity-75">可降解材質</p>
                </div>
                {/* 右下 */}
                <div className="story-feature-card bg-enso-primary shadow-sm --delivery">
                  <div className="emoji-icon">
                    <i className="bi bi-truck"></i>
                  </div>
                  <h6
                    className=" font-bold mb-1"
                    style={{ color: "#c9a063", fontSize: "15px" }}
                  >
                    全台配送
                  </h6>
                  <p className="text-sm text-white/50">$800 免運</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 顧客心聲 */}
      <section className="section-padding bg-custom-white section-reviews">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="collection-title-sub block mb-2">REVIEWS</span>
            <h2 className="collection-title">顧客心聲</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Review 1 */}
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="review-card h-full">
                <div className="review-stars mb-3">
                  <span>★★★★★</span>
                </div>
                <p className="review-quote">
                  "禪林沉靜讓我每天早晨的冥想儀式更加完整。香氣純淨不嗆鼻，煙霧也很少，非常適合室內使用。"
                </p>
                <div className="review-author mt-auto pt-3">
                  <div className="review-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop"
                      alt="Yi-Ling C."
                    />
                  </div>
                  <div>
                    <div className="review-name">Yi-Ling C.</div>
                    <div className="review-role">冥想愛好者</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="review-card h-full">
                <div className="review-stars mb-3">
                  <span>★★★★★</span>
                </div>
                <p className="review-quote">
                  "龍血沉香的氣味非常獨特，學生們都問我哪裡買的。上課前點一支，整個教室的能量立刻不同。"
                </p>
                <div className="review-author mt-auto pt-3">
                  <div className="review-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"
                      alt="James W."
                    />
                  </div>
                  <div>
                    <div className="review-name">James W.</div>
                    <div className="review-role">瑜伽老師</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="review-card h-full">
                <div className="review-stars mb-3">
                  <span>★★★★★</span>
                </div>
                <p className="review-quote">
                  "『琥珀黃昏』的氣息非常溫暖迷人，下班後點上一支，整個房間彷彿被和煦的夕陽光芒包疊，是一天中最療癒的放鬆時刻。"
                </p>
                <div className="review-author mt-auto pt-3">
                  <div className="review-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop"
                      alt="Ariel L."
                    />
                  </div>
                  <div>
                    <div className="review-name">Ariel L.</div>
                    <div className="review-role">生活風格編輯</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
