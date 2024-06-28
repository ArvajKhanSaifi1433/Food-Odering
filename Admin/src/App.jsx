import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <hr />
        <div className="app-content">
          <Sidebar />
          <Outlet />
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
