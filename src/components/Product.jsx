import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getProductApi } from "../services/product";
import { createAsyncAddCart } from "../slice/cartSlice";
import { RotatingLines } from "react-loader-spinner";
import { currency } from "../utils/filter";
import useMessage from "../hooks/useMessage";
import Pagination from "./Pagination";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useMessage();

  const handleAddCart = async (e, productId, qty = 1) => {
    e.preventDefault();
    setLoadingCartId(productId);
    try {
      await dispatch(createAsyncAddCart({ id: productId, qty })).unwrap();
      showSuccess("已成功加入購物車！");
    } catch (error) {
      console.error("加入購物車失敗：", error);
      showError(error || "加入購物車失敗");
    } finally {
      setLoadingCartId(null);
    }
  };

  const handleViewDetail = async (e, productId) => {
    e.preventDefault();
    setLoadingProductId(productId);
    try {
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error("導航出錯：", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const getProducts = async (page = 1, category = currentCategory) => {
    try {
      const response = await getProductApi(page, category);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      showError(error.response?.data?.message || "獲取產品列表失敗");
    }
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await getProductApi(1, "all");
        const result = [
          "all",
          ...new Set(response.data.products.map((product) => product.category)),
        ];
        //如果不解構會變成 ["all", Set(2) { "淨化系列", "放送系列" }] 這種結構
        setCategories(result);
      } catch (error) {
        console.error("獲取類別失敗：", error);
        showError("獲取產品類別失敗");
      }
    };
    getAllProducts();
  }, []);

  useEffect(() => {
    getProducts(1, currentCategory);
  }, [currentCategory]);

  return (
    <>
      <div className="d-none d-md-block">
        <nav className="navbar navbar-expand-lg navbar-light justify-content-center custom-nav">
          <div className="navbar-nav flex-row overflow-auto navbar-custom-scroll nav-pills">
            {categories.map((category) => (
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
            ))}
          </div>
        </nav>
      </div>
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
          {products.map((product) => (
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
                      disabled={loadingProductId === product.id}
                    >
                      {loadingProductId === product.id ? (
                        <RotatingLines
                          strokeColor="grey"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="16"
                        />
                      ) : (
                        "查看詳情"
                      )}
                    </button>
                  </div>
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
                      className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px", padding: 0 }}
                      title="加入購物車"
                      onClick={(e) => handleAddCart(e, product.id)}
                      disabled={loadingCartId === product.id}
                    >
                      {loadingCartId === product.id ? (
                        <RotatingLines
                          strokeColor="#6a994e"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="20"
                        />
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>
    </>
  );
};

export default Products;
