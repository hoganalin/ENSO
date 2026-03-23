import { Link } from "react-router";

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
                <li>
                  <Link to="/product" className="text-decoration-none text-light">
                    線香系列
                  </Link>
                </li>
              </ul>
              <ul className="col-6 col-md-4">
                <h3>品牌</h3>
                <li>
                  <Link to="/about" className="text-decoration-none text-light">
                    品牌故事
                  </Link>
                </li>
              </ul>
              <ul className="col-6 col-md-4">
                <h3>服務</h3>
                <li>
                  <Link to="/faq" className="text-decoration-none text-light">
                    常見問題
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-decoration-none text-light">
                    聯絡我們
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
