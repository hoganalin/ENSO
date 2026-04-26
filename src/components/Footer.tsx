import Link from "next/link";

function Footer(): JSX.Element {
  return (
    <footer className="bg-enso-primary text-white py-12 ">
      <div className="max-w-[1180px] mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* footer左側 */}
          <div>
            <p className="text-3xl font-bold mb-3">ENSO</p>
            <p className="footer-logo-title-sub">
              <span className="block">天然手工線香品牌</span>
              <span className="block">致力於用香氣連結人們與內在寧靜。</span>
            </p>
          </div>
          {/* footer右側 */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ul>
                <h3 className="text-lg font-semibold mb-3">商品</h3>
                <li>
                  <Link
                    href="/product"
                    className="no-underline !text-white/80 hover:!text-enso-gold transition-colors duration-300"
                  >
                    線香系列
                  </Link>
                </li>
              </ul>
              <ul>
                <h3 className="text-lg font-semibold mb-3">品牌</h3>
                <li>
                  <Link
                    href="/about"
                    className="no-underline !text-white/80 hover:!text-enso-gold transition-colors"
                  >
                    品牌故事
                  </Link>
                </li>
              </ul>
              <ul>
                <h3 className="text-lg font-semibold mb-3">服務</h3>
                <li>
                  <Link
                    href="/faq"
                    className="no-underline !text-white/80 hover:!text-enso-gold transition-colors duration-300"
                  >
                    常見問題
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="no-underline !text-white/80 hover:!text-enso-gold transition-colors duration-300"
                  >
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
