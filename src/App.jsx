import { RouterProvider } from "react-router";
import routes from "./router/index.jsx";
function App() {
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
