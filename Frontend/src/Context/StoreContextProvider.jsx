import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

function StoreContextProvider({ children }) {
  const url = "http://localhost:5000";

  const [cartItems, setCartItems] = useState({});

  const [token, setToken] = useState("");

  const [food_list, setFood_list] = useState([]);

  const fetchList = async () => {
    try {
      const { data } = await axios.get(`${url}/api/v1/users/getFoodList`);
      // console.log(data);
      setFood_list(data.data);
    } catch (error) {
      toast.error("Error");
    }
  };

  const loadCartData = async (token) => {
    try {
      const { data } = await axios.post(
        `${url}/api/v1/users/getCart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authorization token
          },
        }
      );
      setCartItems(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("hello");
    async function loadData() {
      await fetchList();
      if (localStorage.getItem("token")) {
        console.log("hello2");
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, [token]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/v1/users/addToCart`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Optionally, handle the error (e.g., show a notification to the user)
      }
    }
  };

  const removeToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        await axios.post(
          `${url}/api/v1/users/removeFromCart`,
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
        // Optionally, handle the error (e.g., show a notification to the user)
      }
    }
  };

  const getTotalAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const ContextValue = {
    food_list,
    cartItems,
    token,
    addToCart,
    removeToCart,
    getTotalAmount,
    url,
    setToken,
    setCartItems,
    loadCartData,
  };
  return (
    <StoreContext.Provider value={ContextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export default StoreContextProvider;
