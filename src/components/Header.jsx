import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { createAsyncGetCart } from "../slice/cartSlice";
import logo from "../images/logo.png";
import { useSelector } from "react-redux";

function Header() {
  const carts = useSelector((state) => state.cart.carts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);
  return (
    <div className="sticky-top bg-navbar">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link className="navbar-brand d-inline-block text-center" to="/">
            <div className="d-flex header-logo-wrapper">
              <img src={logo} alt="Enso logo" className="header-logo-image" />

              <div className="header-logo-text">
                <p className="header-logo mb-0">ENSO</p>
                <p className="header-sublogo mb-0">INCENSE</p>
              </div>
            </div>
          </Link>

          <div className="d-flex align-items-center ms-lg-3 me-3 me-lg-0 ms-auto order-lg-3">
            <a href="#">
              <i className="fa-solid fa-heart me-3"></i>
            </a>
            <Link to="/cart" className="position-relative d-inline-block">
              <i className="fa-solid fa-cart-shopping"></i>
              {carts?.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {carts?.length}
                </span>
              )}
            </Link>
          </div>

          <button
            className="navbar-toggler order-lg-4 ms-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse order-lg-2"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item active">
                <Link className="nav-link" href="#">
                  線香商品 <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  禮盒推薦
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  關於品牌
                </a>
              </li>
            </ul>

            <form className="d-flex" role="search">
              <input
                className="form-control me-2 "
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
