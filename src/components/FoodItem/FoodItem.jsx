import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

// Hàm định dạng số tiền VNĐ
const formatVND = (amount) => {
  return amount.toLocaleString("vi-VN");
};

const FoodItem = ({ id, name, price, description, image, user, setShowLogin }) => {
  const { cartItems, addToCart, removeFromCart, foodItems } = useContext(StoreContext);

  const [showPopup, setShowPopup] = useState(false); // state popup

  const item = foodItems.find(f => f._id === id);
  const soldOut = item?.soldOut || false;

  const handleAddToCart = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (soldOut) {
      alert("Món này đã hết hàng!");
      return;
    }

    addToCart(id);

    // Hiển thị popup thành công
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000); // 2 giây tự ẩn
  };

  const handleRemoveFromCart = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    removeFromCart(id);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt="image" className="food-item-img" />

        {soldOut && <div className="sold-out-label">Hết hàng</div>}

        {!cartItems[id] ? (
          <img
            src={assets.add_icon_white}
            alt="add_icon_white"
            className="add"
            onClick={handleAddToCart}
            style={{ pointerEvents: soldOut ? "none" : "auto", opacity: soldOut ? 0.5 : 1 }}
          />
        ) : (
          <div className="food-item-counter">
            <img src={assets.remove_icon_red} alt="remove_icon_red" onClick={handleRemoveFromCart} />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              alt="add_icon_green"
              onClick={handleAddToCart}
              style={{ pointerEvents: soldOut ? "none" : "auto", opacity: soldOut ? 0.5 : 1 }}
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
        <p className="food-item-price">{formatVND(price)} ₫</p>
      </div>

      {/* Popup thêm món thành công */}
      {showPopup && (
        <div className="popup-success">
          ✅ Thêm món vào giỏ hàng thành công!
        </div>
      )}
    </div>
  );
};

export default FoodItem;
