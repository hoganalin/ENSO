import { createHashRouter } from "react-router";
import FrontendLayout from "../layout/FrontendLayout.jsx";
import Home from "../views/frontend/Home.jsx";
import Products from "../components/Product.jsx";
import SingleProduct from "../components/SingleProduct.jsx";
import Cart from "../components/Cart.jsx";
import CheckoutSuccess from "../components/CheckoutSuccess.jsx";
export const routes = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout-success",
        element: <CheckoutSuccess />,
      },
    ],
  },
]);

export default routes;
