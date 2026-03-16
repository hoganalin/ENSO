import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store/store.js";
import "./index.css";
import "./assets/all.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.jsx";
import { Provider } from "react-redux";
//引入swiper scss
import "swiper/css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
