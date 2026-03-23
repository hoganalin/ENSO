import { Link, useLocation } from "react-router";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // 路徑與名稱對照表
  const breadcrumbMap = {
    "product": "所有產品",
    "cart": "購物車",
    "checkout": "節帳流程",
    "checkout-success": "訂單完成",
    "about": "關於我們",
    "faq": "常見問題",
    "contact": "聯絡我們",
    "login": "會員登入",
    "register": "會員註冊",
  };

  // 首頁不顯示麵包屑，或是只顯示首頁
  if (location.pathname === "/") return null;

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-wrapper container mt-4">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/" aria-label="Go to Home page">首頁</Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // 處理動態路由，例如 product/:id
          let label = breadcrumbMap[value] || value;
          
          // 如果是 ID (假設是 product/之後的那個)，標註為產品詳情
          if (index > 0 && pathnames[index - 1] === 'product') {
            label = "產品詳情";
          }

          return last ? (
            <li className="breadcrumb-item active" aria-current="page" key={to}>
              {label}
            </li>
          ) : (
            <li className="breadcrumb-item" key={to}>
              <Link to={to} aria-label={`Go to ${label}`}>{label}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
