import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, user, setShowLogin }) => {
  const { foodItems } = useContext(StoreContext); // ✅ dùng foodItems thay vì food_list

  if (!foodItems) return <p>Đang tải món ăn...</p>; // phòng trường hợp chưa load

  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes Near You</h2>
      <div className="food-display-list">
        {foodItems.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                soldOut={item.soldOut} // ✅ thêm để disable nếu hết hàng
                user={user}
                setShowLogin={setShowLogin}
              />
            );
          }
          return null; // tránh warning React
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
