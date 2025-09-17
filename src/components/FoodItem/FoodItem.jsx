import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

// Hàm định dạng số tiền VNĐ (dấu chấm ngăn cách nghìn, không kèm chữ đ)
const formatVND = (amount) => {
  return amount.toLocaleString("vi-VN"); // ví dụ: 20.000
};

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt="image" className="food-item-img" />
        {!cartItems[id] ? (
          <img
            src={assets.add_icon_white}
            alt="add_icon_white"
            className="add"
            onClick={() => addToCart(id)}
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              alt="remove_icon_red"
              onClick={() => removeFromCart(id)}
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              alt="add_icon_green"
              onClick={() => addToCart(id)}
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating_starts" />
        </div>
        <p className="food-item-desc">{description}</p>
        {/* hiển thị giá đã format sang VNĐ */}
        <p className="food-item-price">{formatVND(price)}</p>
      </div>
    </div>
  );
};

export default FoodItem;
