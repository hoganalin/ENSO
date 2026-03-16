import { Swiper, SwiperSlide } from "swiper/react";
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
            <button className="btn btn-warning btn-hover-effect">立即選購</button>
            <button className="btn btn-outline-light">品牌故事</button>
          </div>
        </section>
      </div>
    </header>

      {/* 探索香氣世界 */}
      <section className="collection-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="collection-title-sub d-block mb-2">COLLECTION</span>
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
                  <div className="collection-icon mb-4 mx-auto" style={{ backgroundImage: `url(${iconMeditation})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  </div>
                  <h6 className="collection-title-sub mb-3">MEDITATION</h6>
                  <h3 className="h4 fw-bold mb-3">冥想香氣</h3>
                  <p className="text-secondary small mb-0">深度靜心 • 專注當下</p>
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
                  <div className="collection-icon mb-4 mx-auto" style={{ backgroundImage: `url(${iconRelaxation})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  </div>
                  <h6 className="collection-title-sub mb-3">RELAXATION</h6>
                  <h3 className="h4 fw-bold mb-3">放鬆舒壓</h3>
                  <p className="text-secondary small mb-0">釋放壓力 • 安眠修復</p>
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
                  <div className="collection-icon mb-4 mx-auto" style={{ backgroundImage: `url(${iconPurification})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  </div>
                  <h6 className="collection-title-sub mb-3">PURIFICATION</h6>
                  <h3 className="h4 fw-bold mb-3">空間淨化</h3>
                  <p className="text-secondary small mb-0">清淨能量 • 淨化靈魂</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 精選線香 */}
      <section className="featured-incense-section">
        <div className="container">
          <div className="text-start my-5">
            <span className="collection-title-sub d-block mb-2">FEATURED INCENSE</span>
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="collection-title mb-0">精選線香</h2>
              <button className="btn btn-outline-dark btn-hover-effect px-4">查看更多</button>
            </div>
          </div>
          
          {/* 精選線香卡片區 */}
          <div className="row g-4 justify-content-center mb-5">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm collection-card">
                <img 
                  className="card-img-top" 
                  src="https://images.unsplash.com/photo-1608528577891-eb0559d1df64?q=80&w=1470&auto=format&fit=crop" 
                  style={{ height: '240px', objectFit: 'cover' }}
                  alt="香爐與線香"
                />
                <div className="card-body p-4 text-center">
                  <h4 className="card-title fw-bold mb-3">晨霧之森</h4>
                  <p className="card-text text-secondary mb-4">
                    清晨森林的清新木質調，帶有些許露水氣息，適合早晨提神與喚醒身心。
                  </p>
                  <a href="#" className="btn btn-outline-dark btn-hover-effect w-100">詳細介紹</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
