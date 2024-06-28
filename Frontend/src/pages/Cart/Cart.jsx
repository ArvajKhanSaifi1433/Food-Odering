import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContextProvider";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const { food_list, removeToCart, cartItems, getTotalAmount } =
    useContext(StoreContext);
  return (
    <>
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={index}>
                  <div className="cart-items-item cart-items-title">
                    <img src={item.image} alt="" />
                    <p>{item.name}</p>
                    <p>&#8377;{(Number(item.price) * 80).toFixed(2)}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>
                      &#8377;
                      {(Number(item.price) * 80 * cartItems[item._id]).toFixed(
                        2
                      )}
                    </p>
                    <p onClick={() => removeToCart(item._id)} className="crose">
                      X
                    </p>
                  </div>
                  <hr />
                </div>
              );
            }
          })}
        </div>
        <div className="cart-bottom">
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
            <button onClick={() => navigate("/order")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, Enter it here</p>
              <div className="card-promocode-input">
                <input type="text" placeholder="promo code" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
