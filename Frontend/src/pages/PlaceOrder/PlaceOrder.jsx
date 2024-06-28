import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {
  const { getTotalAmount, food_list, cartItems, token, url, loadCartData } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // console.log(data);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};
    if (!data.firstName) errors.firstName = "First Name is required";
    if (!data.lastName) errors.lastName = "Last Name is required";
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email address is invalid";
    }
    if (!data.street) errors.street = "Street is required";
    if (!data.city) errors.city = "City is required";
    if (!data.state) errors.state = "State is required";
    if (!data.zipCode) errors.zipCode = "Zip Code is required";
    if (!data.country) errors.country = "Country is required";
    if (!data.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number is invalid";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      items: orderItems,
      address: data,
      amount: getTotalAmount() + 2,
    };
    if (validate()) {
      try {
        const { data } = await axios.post(
          `${url}/api/v1/users/placeOrder`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.success) {
          window.location.replace(data.data.session_url);
          setData({
            firstName: "",
            lastName: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            phone: "",
          });
          await loadCartData(localStorage.getItem("token"));
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Error adding item to cart:", error);
        // Optionally, handle the error (e.g., show a notification to the user)
      }
    } else {
      console.log("Form data is invalid. Fix the errors and try again.");
    }
  };

  const onchangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const navigator = useNavigate();

  useEffect(() => {
    if (!token) {
      navigator("/cart");
    } else if (getTotalAmount() === 0) {
      navigator("/cart");
    }
  }, [token]);

  return (
    <>
      <form className="place-order" autoComplete="off" onSubmit={handleSubmit}>
        <div className="place-order-left">
          <div className="title">Delivery Information</div>
          <div className="multi-fields">
            <div className="input-group">
              <input
                type="text"
                name="firstName"
                value={data.firstName}
                onChange={onchangeHandler}
                placeholder="First Name"
              />
              {errors.firstName && (
                <span className="error">{errors.firstName}</span>
              )}
            </div>
            <div className="input-group">
              <input
                type="text"
                name="lastName"
                value={data.lastName}
                onChange={onchangeHandler}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <span className="error">{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onchangeHandler}
              placeholder="Email Address"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="input-group">
            <input
              type="text"
              name="street"
              value={data.street}
              onChange={onchangeHandler}
              placeholder="Street"
            />
            {errors.street && <span className="error">{errors.street}</span>}
          </div>
          <div className="multi-fields">
            <div className="input-group">
              <input
                type="text"
                placeholder="City"
                name="city"
                value={data.city}
                onChange={onchangeHandler}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="State"
                name="state"
                value={data.state}
                onChange={onchangeHandler}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
          </div>
          <div className="multi-fields">
            <div className="input-group">
              <input
                type="text"
                placeholder="Zip Code"
                name="zipCode"
                value={data.zipCode}
                onChange={onchangeHandler}
              />
              {errors.zipCode && (
                <span className="error">{errors.zipCode}</span>
              )}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={data.country}
                onChange={onchangeHandler}
              />
              {errors.country && (
                <span className="error">{errors.country}</span>
              )}
            </div>
          </div>
          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={data.phone}
              onChange={onchangeHandler}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>
                  &#8377;
                  {getTotalAmount() === 0
                    ? 0
                    : (getTotalAmount() * 80).toFixed(2)}
                </p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>&#8377;{getTotalAmount() === 0 ? 0 : (2 * 80).toFixed(2)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Total</p>
                <p>
                  &#8377;
                  {getTotalAmount() === 0
                    ? 0
                    : ((getTotalAmount() + 2) * 80).toFixed(2)}
                </p>
              </div>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default PlaceOrder;
