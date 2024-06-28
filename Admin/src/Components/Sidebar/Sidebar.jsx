import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-options">
          <NavLink to={"/add"} className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>add Items</p>
          </NavLink>
          <NavLink to={"/list"} className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Item</p>
          </NavLink>
          <NavLink to={"/order"} className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
