import { Swiper, SwiperSlide } from "swiper/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Autoplay } from "swiper/modules";
// Import Swiper styles
import "../../assets/swiper.scss";
import hero1 from "../../images/hero1.jpg";
import hero2 from "../../images/hero2.jpg";
import hero3 from "../../images/hero3.png";
import hero4 from "../../images/hero4.jpg";
import iconMeditation from "../../images/冥想香氣.png";
import iconRelaxation from "../../images/放鬆紓壓.png";
import iconPurification from "../../images/空間淨化.png";

export default function Home() {
  return (
    <>
      <header className="hero-header">
        <div className="hero-header__bg" aria-hidden="true">
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
          <div className="hero-header__overlay" />
        </div>

        <div className="container hero-header__inner">
          <section className="hero-header__content d-flex flex-column align-items-center text-center">
            <p className="text-yellow mb-3">天然手工製作 ， 日本原料</p>

            <h1 className="mb-3 hero-header__content_title ">
              <span className="d-block text-white">點燃一縷香</span>
              <span className="d-block text-warning">靜下心</span>
            </h1>

            <div className="text-gray-550 mb-5">
              <p className="mb-1">Find Your Inner Silence</p>
              <p className="mb-0">每一縷煙， 都是回歸自我的邀請</p>
            </div>
            <div className="d-flex gap-3">
              <button className="btn btn-warning btn-hover-effect">
                立即選購
              </button>
              <button className="btn btn-outline-light">品牌故事</button>
            </div>
          </section>
        </div>
      </header>

      {/* 探索香氣世界 */}
      <section className="section-padding bg-custom-light section-explore">
        <div className="container">
          <div className="text-center mb-5">
            <span className="collection-title-sub d-block mb-2">
              COLLECTION
            </span>
            <h2 className="collection-title">探索香氣世界</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Card 1 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm collection-card position-relative overflow-hidden">
                <div
                  className="collection-card-bg"
                  style={{ backgroundImage: `url(${iconMeditation})` }}
                />
                <div className="card-body text-center p-4 py-5 position-relative z-1">
                  <div
                    className="collection-icon mb-4 mx-auto"
                    style={{
                      backgroundImage: `url(${iconMeditation})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <h6 className="collection-title-sub mb-3">MEDITATION</h6>
                  <h3 className="h4 fw-bold mb-3">冥想香氣</h3>
                  <p className="text-secondary small mb-0">
                    深度靜心 • 專注當下
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm collection-card position-relative overflow-hidden">
                <div
                  className="collection-card-bg"
                  style={{ backgroundImage: `url(${iconRelaxation})` }}
                />
                <div className="card-body text-center p-4 py-5 position-relative z-1">
                  <div
                    className="collection-icon mb-4 mx-auto"
                    style={{
                      backgroundImage: `url(${iconRelaxation})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <h6 className="collection-title-sub mb-3">RELAXATION</h6>
                  <h3 className="h4 fw-bold mb-3">放鬆舒壓</h3>
                  <p className="text-secondary small mb-0">
                    釋放壓力 • 安眠修復
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm collection-card position-relative overflow-hidden">
                <div
                  className="collection-card-bg"
                  style={{ backgroundImage: `url(${iconPurification})` }}
                />
                <div className="card-body text-center p-4 py-5 position-relative z-1">
                  <div
                    className="collection-icon mb-4 mx-auto"
                    style={{
                      backgroundImage: `url(${iconPurification})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <h6 className="collection-title-sub mb-3">PURIFICATION</h6>
                  <h3 className="h4 fw-bold mb-3">空間淨化</h3>
                  <p className="text-secondary small mb-0">
                    清淨能量 • 淨化靈魂
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 精選線香 */}
      <section className="section-padding bg-custom-white section-featured">
        <div className="container">
          <div className="text-start mb-5">
            <span className="collection-title-sub d-block mb-2">
              FEATURED INCENSE
            </span>
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="collection-title mb-0">精選線香</h2>
              <button className="btn btn-outline-dark btn-hover-effect px-4">
                查看更多
              </button>
            </div>
          </div>

          {/* 精選線香卡片區 */}
          <div className="row g-4 justify-content-center mb-5">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm collection-card">
                <img
                  className="card-img-top"
                  src="https://images.unsplash.com/photo-1608528577891-eb0559d1df64?q=80&w=1470&auto=format&fit=crop"
                  style={{ height: "240px", objectFit: "cover" }}
                  alt="香爐與線香"
                />
                <div className="card-body p-4 text-center">
                  <h4 className="card-title fw-bold mb-3">晨霧之森</h4>
                  <p className="card-text text-secondary mb-4">
                    清晨森林的清新木質調，帶有些許露水氣息，適合早晨提神與喚醒身心。
                  </p>
                  <a
                    href="#"
                    className="btn btn-outline-dark btn-hover-effect w-100"
                  >
                    詳細介紹
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 品牌故事 */}
      <section className="section-padding bg-custom-light section-story">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* 左半邊 */}
            <div className="col-12 col-md-6 pe-lg-5">
              <span className="collection-title-sub d-block mb-3 text-uppercase">
                Our Story
              </span>
              <h2 className="story-title d-block">香，是時間的藝術</h2>

              <div className="story-text-content">
                <p>
                  我們相信，一縷香可以改變空間的能量。ENSO 創立於 2018
                  年，名取禪宗「圓相」之意——代表完整與空無的共存。
                </p>
                <p>
                  每一支線香，皆由工匠手工捲製，採用日本、印度與斯里蘭卡有機農場的天然原料，低煙配方讓香氛更適合現代室內空間。
                </p>
              </div>

              <button className="btn btn-primary btn-hover-effect  mt-2 rounded-3">
                閱讀品牌故事
              </button>
            </div>

            {/* 右半邊: 2x2 Card Grid */}
            <div className="col-12 col-md-6">
              <div className="row g-3">
                {/* 左上 */}
                <div className="col-6">
                  <div className="story-feature-card bg-primary shadow-sm">
                    <div className="emoji-icon">
                      <i className="bi bi-leaf"></i>
                    </div>
                    <h6
                      className="fw-bold mb-1"
                      style={{ color: "#c9a063", fontSize: "15px" }}
                    >
                      天然原料
                    </h6>
                    <p className="small mb-0 text-white-50">100% 有機</p>
                  </div>
                </div>
                {/* 右上 */}
                <div className="col-6">
                  <div className="story-feature-card bg-light-beige shadow-sm">
                    <div className="emoji-icon">
                      <i className="bi bi-person-hearts"></i>
                    </div>
                    <h6
                      className="fw-bold mb-1 text-secondary"
                      style={{ fontSize: "15px" }}
                    >
                      手工製作
                    </h6>
                    <p className="small mb-0 text-secondary opacity-75">
                      職人工藝
                    </p>
                  </div>
                </div>
                {/* 左下 */}
                <div className="col-6">
                  <div className="story-feature-card bg-light-beige shadow-sm">
                    <div className="emoji-icon">
                      <i className="bi bi-globe2"></i>
                    </div>
                    <h6
                      className="fw-bold mb-1 text-secondary"
                      style={{ fontSize: "15px" }}
                    >
                      永續包裝
                    </h6>
                    <p className="small mb-0 text-secondary opacity-75">
                      可降解材質
                    </p>
                  </div>
                </div>
                {/* 右下 */}
                <div className="col-6">
                  <div className="story-feature-card bg-primary shadow-sm">
                    <div className="emoji-icon">
                      <i className="bi bi-truck"></i>
                    </div>
                    <h6
                      className="fw-bold mb-1"
                      style={{ color: "#c9a063", fontSize: "15px" }}
                    >
                      全台配送
                    </h6>
                    <p className="small mb-0 text-white-50">$800 免運</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 顧客心聲 */}
      <section className="section-padding bg-custom-white section-reviews">
        <div className="container">
          <div className="text-center mb-5">
            <span className="collection-title-sub d-block mb-2">REVIEWS</span>
            <h2 className="collection-title">顧客心聲</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Review 1 */}
            <div className="col-md-4">
              <div className="review-card h-100">
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
            <div className="col-md-4">
              <div className="review-card h-100">
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
            <div className="col-md-4">
              <div className="review-card h-100">
                <div className="review-stars mb-3">
                  <span>★★★★★</span>
                </div>
                <p className="review-quote">
                  "四季香氣組合是我這週最受歡迎的生日禮物。包裝精美，每款香氣都有它獨特的個性。"
                </p>
                <div className="review-author mt-auto pt-3">
                  <div className="review-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop"
                      alt="Mei-Hua L."
                    />
                  </div>
                  <div>
                    <div className="review-name">Mei-Hua L.</div>
                    <div className="review-role">香氣收藏者</div>
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
