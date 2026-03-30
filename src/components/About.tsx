import { Link } from "react-router";

function About(): JSX.Element {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container text-center">
          <span className="about-subtitle" data-aos="fade-down">
            OUR STORY
          </span>
          <h1 className="about-title" data-aos="fade-up" data-aos-delay="100">
            香，是時間的藝術
          </h1>
          <div
            className="about-divider"
            data-aos="zoom-in"
            data-aos-delay="200"
          ></div>
          <p className="about-desc" data-aos="fade-up" data-aos-delay="300">
            ENSO，圓相。代表著禪宗中「完整」與「空無」的共存。
            <br />
            我們相信，每一縷香煙，都是一次回歸當下的邀請。
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="container text-center">
          <h2 className="about-section-title">我們的故事</h2>
          <div className="story-divider mx-auto"></div>
          <div className="story-content">
            <p>
              創辦人旅居京都期間，深受傳統香道啟發，在百年老舖中第一次體驗到香氣對心靈的深刻影響。2018
              年回台後，決心將這份靜心的力量帶給更多人。
            </p>
            <p>
              每一支 ENSO
              線香，都是工匠以雙手捲製，選用日本、印度與斯里蘭卡有機認證原料，配合我們開發的專利低煙配方，讓香氛更適合現代生活。
            </p>
          </div>
        </div>
      </section>

      <section className="about-philosophy">
        <div className="container text-center">
          <h2 className="about-section-title">品牌理念</h2>
          <div className="story-divider mx-auto"></div>
          <div className="row g-4 mt-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="philosophy-card card--nature">
                <h4 className="philosophy-title">純淨天然</h4>
                <p className="philosophy-text">
                  所有原料皆來自有機認證農場，拒絕人工添加物，讓每一縷煙都是最純粹的自然香氣。
                </p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="philosophy-card card--craft">
                <h4 className="philosophy-title">職人工藝</h4>
                <p className="philosophy-text">
                  每一支線香由工匠手捲製，遵循傳統製法，在現代工藝中保留最珍貴的手工溫度。
                </p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="philosophy-card card--sustainability">
                <h4 className="philosophy-title">永續承諾</h4>
                <p className="philosophy-text">
                  全面採用可生物降解包裝，從原料到包裝，我們對地球的每一份承諾都認真以待。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-milestones">
        <div className="container text-center">
          <h2 className="about-section-title">品牌里程碑</h2>
          <div className="story-divider mx-auto"></div>
          <div className="timeline-wrapper">
            <div className="timeline-item" data-aos="fade-up">
              <div className="timeline-year">2018</div>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h5 className="milestone-title">品牌創立</h5>
                <p className="milestone-desc">
                  創辦人旅居京都期間，深受傳統香道啟發，回台後創立 ENSO。
                </p>
              </div>
            </div>
            <div className="timeline-item" data-aos="fade-up">
              <div className="timeline-year">2020</div>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h5 className="milestone-title">有機認證</h5>
                <p className="milestone-desc">
                  與日本、印度、斯里蘭卡有機農場建立長期合作，確保原料純淨。
                </p>
              </div>
            </div>
            <div className="timeline-item" data-aos="fade-up">
              <div className="timeline-year">2022</div>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h5 className="milestone-title">低煙配方</h5>
                <p className="milestone-desc">
                  與調香師合作開發專利低煙配方，讓線香更適合現代室內空間。
                </p>
              </div>
            </div>
            <div className="timeline-item" data-aos="fade-up">
              <div className="timeline-year">2024</div>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h5 className="milestone-title">永續包裝</h5>
                <p className="milestone-desc">
                  全面改用 100% 可生物降解包裝，實踐對環境的長期承諾。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container text-center">
          <span className="about-subtitle">JOIN US</span>
          <h2 className="about-title">開始你的香氣旅程</h2>
          <div className="about-divider"></div>
          <p className="about-desc">
            每一支 ENSO 線香，都是一份給自己的禮物。
            <br />
            讓香氣成為你日常靜心的開始。
          </p>
          <div className="mt-5">
            <Link
              to="/product"
              className="btn btn-enso-gold btn-lg rounded-pill px-5 py-3"
            >
              探索所有線香
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default About;
