import { RouterProvider } from "react-router";

import MessageToast from "./components/MessageToast.js";
import routes from "./router/index.js";
function App(): JSX.Element {
  return (
    <>
      <MessageToast />
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
