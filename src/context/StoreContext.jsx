import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [discount, setDiscount] = useState(0);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // 🧩 Thêm trạng thái món ăn
  const [foodItems, setFoodItems] = useState(() => {
    const saved = localStorage.getItem("foodItems");
    return saved ? JSON.parse(saved) : food_list.map(f => ({ ...f, soldOut: false }));
  });

  // Lưu vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
  }, [foodItems]);

  // Cập nhật trạng thái sold out
  const toggleSoldOut = (id) => {
    setFoodItems(prev =>
      prev.map(f => (f._id === id ? { ...f, soldOut: !f.soldOut } : f))
    );
  };

  // Khi thêm vào giỏ hàng → kiểm tra nếu soldOut thì không cho thêm
  const addToCart = (itemId) => {
    const item = foodItems.find(f => f._id === itemId);
    if (item?.soldOut) {
      alert("Món này đã hết hàng!");
      return;
    }
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] === 1) {
      const newCartItems = { ...cartItems };
      delete newCartItems[itemId];
      setCartItems(newCartItems);
    } else {
      setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const item = foodItems.find(f => f._id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const getTotalQuantity = () =>
    Object.values(cartItems).reduce((sum, q) => sum + q, 0);

  const applyDiscount = (code) => {
    if (code.trim().toUpperCase() === "DISCOUNT") {
      setDiscount(15000);
      return true;
    }
    setDiscount(0);
    return false;
  };

  // Thêm hàm addFood trong context
const addFood = (newFood) => {
  setFoodItems(prev => [...prev, { ...newFood, soldOut: false }]);
};

// Xóa món ăn theo _id
const deleteFood = (id) => {
  setFoodItems(prev => prev.filter(f => f._id !== id));
};


  const contextValue = {
    foodItems,
    setFoodItems,
    toggleSoldOut,
     addFood,  // thêm vào đây
     deleteFood, // thêm vào đây
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
    discount,
    applyDiscount,
    user,
    setUser,
    showLogin,
    setShowLogin,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
