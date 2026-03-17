import { useState, useEffect } from "react";
import { currency } from "../utils/filter";
import { useNavigate } from "react-router";
import { getProductApi, getAllProductsApi } from "../services/product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const navigate = useNavigate();
  const handleViewDetail = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await getAllProductsApi();
        const result = [
          "all",
          ...new Set(response.data.products.map((product) => product.category)),
        ];
        setCategories(result);
      } catch (error) {
        console.log(error?.response || error.message);
      }
    };

    getAllProducts();
  }, []);

  useEffect(() => {
    const getProducts = async (page = 1, category) => {
      try {
        const response = await getProductApi(page, category);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error?.response || error.message);
      }
    };

    getProducts(1, currentCategory);
  }, [currentCategory]);

  return (
    <>
      {/* desktop / tablet pills */}
      <div className="d-none d-md-block">
        <nav className="navbar navbar-expand-lg navbar-light justify-content-center custom-nav">
          <div className="navbar-nav flex-row overflow-auto navbar-custom-scroll nav-pills">
            {/* categories */}
            {categories.map((category) => {
              return (
                <a
                  key={category}
                  className={`nav-item nav-link text-nowrap px-4 mx-1 ${
                    currentCategory === category ? "active" : ""
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentCategory(category);
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </a>
              );
            })}
            {/* end categories */}
          </div>
        </nav>
      </div>
      {/* mobile / small screens dropdown */}
      <div className="d-block d-md-none mb-4 px-3">
        <select
          className="form-select rounded-pill"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="row g-4">
          {/* 產品列表 */}
          {products.map((product) => {
            return (
              <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                <div className="product-card">
                  <div className="product-img-wrapper">
                    <img
                      src={product.imageUrl}
                      className="product-img"
                      alt={product.title}
                    />
                    <div className="product-img-overlay">
                      <button
                        className="btn btn-light rounded-pill px-4 shadow-sm"
                        onClick={(e) => handleViewDetail(e, product.id)}
                      >
                        查看詳情
                      </button>
                    </div>
                    {/* 這裡可以根據邏輯加入 Badge，目前範例加入一個 NEW */}
                    <div className="product-badge">精選</div>
                  </div>
                  <div className="product-content">
                    <div className="product-category">{product.category}</div>
                    <h4 className="product-title">
                      <a
                        href="#"
                        onClick={(e) => handleViewDetail(e, product.id)}
                      >
                        {product.title}
                      </a>
                    </h4>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">
                        NT$ {currency(product.price)}
                      </span>
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle"
                        // style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}
                        title="加入購物車"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                aria-label="Previous"
                onClick={(e) => e.preventDefault()}
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active">
              <a
                className="page-link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                1
              </a>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                2
              </a>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                3
              </a>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                href="#"
                aria-label="Next"
                onClick={(e) => e.preventDefault()}
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Products;
