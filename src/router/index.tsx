import { createHashRouter } from "react-router";

import About from "../components/About";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import CheckoutSuccess from "../components/CheckoutSuccess";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Login from "../components/Login";
import NotFound from "../components/NotFound";
import Products from "../components/Product";
import Register from "../components/Register";
import SingleProduct from "../components/SingleProduct";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../views/frontend/Home";
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
        path: "checkout-success/:orderId?",
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
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
