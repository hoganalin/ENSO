import { createHashRouter } from "react-router";

import Cart from "../components/Cart.jsx";
import CheckoutSuccess from "../components/CheckoutSuccess.jsx";
import NotFound from "../components/NotFound.jsx";
import Products from "../components/Product.jsx";
import SingleProduct from "../components/SingleProduct.jsx";
import FrontendLayout from "../layout/FrontendLayout.jsx";
import Home from "../views/frontend/Home.jsx";
import Checkout from "../components/Checkout.jsx";
import About from "../components/About.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
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
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "checkout-success",
        element: <CheckoutSuccess />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
