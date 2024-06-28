import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Verify from "./pages/Verify/Verify.jsx";
import MyOrder from "./pages/MyOrder/MyOrder.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Auto from "./components/Auto/Auto.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order",
        element: <PlaceOrder />,
      },
      {
        path: "/verify",
        element: <Verify />,
      },
      {
        path: "/myOrder",
        element: (
          <Auto>
            <MyOrder />
          </Auto>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
