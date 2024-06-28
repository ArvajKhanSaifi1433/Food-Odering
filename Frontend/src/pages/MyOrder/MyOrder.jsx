import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContextProvider";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./MyOrder.css";

function MyOrder() {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async (req, res) => {
    try {
      const { data } = await axios.post(
        `${url}/api/v1/users/userOrders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);
  return (
    <>
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="container">
          {orders.map((order, ind) => {
            return (
              <div key={ind} className="my-orders-order">
                <img src={assets.parcel_icon} alt="" />
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + " , ";
                    }
                  })}
                </p>
                <p>&#8377;{(order.amount * 80).toFixed(2)}</p>
                <p>{order.items.length}</p>
                <p>
                  <span>&#x25cf;</span>
                  <b>{order.status}</b>
                </p>
                <button>Track Order</button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MyOrder;
