import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContextProvider";

function FoodItem({ id, name, price, description, image }) {
  
  const { addToCart, removeToCart, cartItems } = useContext(StoreContext);
  return (
    <>
      <div className="food-item">
        <div className="food-item-img-container">
          <img src={image} className="food-item-image" alt="" />
          {!cartItems[id] ? (
            <img
              className="add"
              src={assets.add_icon_white}
              onClick={() => addToCart(id)}
            />
          ) : (
            <div className="food-item-counter">
              <img
                onClick={() => removeToCart(id)}
                src={assets.remove_icon_red}
              />
              <p>{cartItems[id]}</p>
              <img onClick={() => addToCart(id)} src={assets.add_icon_green} />
            </div>
          )}
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
          </div>
          <p className="food-item-description">{description}</p>
          <p className="food-item-price">
            &#8377;{(Number(price) * 80).toFixed(2)}
          </p>
        </div>
      </div>
    </>
  );
}

export default FoodItem;
