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
                  className={`nav-item nav-link text-nowrap px-3 ${
                    currentCategory === category ? "active" : ""
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentCategory(category);
                  }}
                >
                  {category}
                </a>
              );
            })}
            {/* end categories */}
          </div>
        </nav>
      </div>
      {/* mobile / small screens dropdown */}
      <div className="d-block d-md-none mb-3">
        <select
          className="form-select"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="row">
          {/* 產品列表 */}
          {products.map((product) => {
            return (
              <div className="col-md-3" key={product.id}>
                <div className="card border-0 mb-4 position-relative">
                  <img
                    src={product.imageUrl}
                    className="card-img-top rounded-0"
                    alt="..."
                  />
                  <a
                    href="#"
                    className="text-dark"
                    onClick={(e) => handleViewDetail(e, product.id)}
                  >
                    <i
                      className="far fa-heart position-absolute"
                      style={{ right: "16px", top: "16px" }}
                    ></i>
                  </a>
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-3">
                      <a
                        href="#"
                        onClick={(e) => handleViewDetail(e, product.id)}
                      >
                        {product.title}
                      </a>
                    </h4>
                    <p className="card-text text-muted mb-0">
                      {product.description}
                    </p>
                    <p className="text-muted mt-3">
                      NT$ {currency(product.price)}
                    </p>
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
