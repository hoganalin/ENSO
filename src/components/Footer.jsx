function Footer() {
  return (
    <footer className="bg-dark text-light py-5 footer">
      <div className="container ">
        <div className="row">
          {/* footer左側 */}
          <div className="col-md-6 mb-5 mb-md-0">
            <p className="footer-logo-title">ENSO</p>
            <p className="footer-logo-title-sub">
              <span className="d-block">天然手工線香品牌</span>
              <span className="d-block">致力於用香氣連結人們與內在寧靜。</span>
            </p>
          </div>
          {/* footer右側 */}
          <div className="col-md-6 ">
            <div className="row g-4">
              <ul className="col-6 col-md-4">
                <h3>商品</h3>
                <li>線香系列</li>
                <li>禮盒推薦</li>
              </ul>
              <ul className="col-6 col-md-4">
                <h3>品牌</h3>
                <li>品牌故事</li>
                <li>永續理念</li>
              </ul>
              <ul className="col-6 col-md-4">
                <h3>服務</h3>
                <li>常見問題</li>
                <li>聯絡我們</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
