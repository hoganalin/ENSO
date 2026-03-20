import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const API_BASE = import.meta.env.VITE_API_BASE;

    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, user);
      const { token, expired } = res.data;

      // 儲存 token 到 cookie
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;

      alert("登入成功！");
      navigate("/product"); // 登入後導引至產品頁
    } catch (error) {
      console.error(error);
      alert("登入失敗：" + (error.response?.data?.message || "請檢查帳號密碼"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-7">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold">登入 ENSO</h2>
              <p className="text-muted text-center mb-4">歡迎回來，請登入您的帳號</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">電子郵件</label>
                  <input
                    type="email"
                    name="username"
                    className="form-control form-control-lg border-light bg-light"
                    placeholder="name@example.com"
                    value={user.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">密碼</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg border-light bg-light"
                    placeholder="請輸入密碼"
                    value={user.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  立即登入
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-muted small">
                  還沒有帳號？{" "}
                  <Link
                    to="/register"
                    className="text-primary text-decoration-none fw-bold"
                  >
                    立即註冊
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
