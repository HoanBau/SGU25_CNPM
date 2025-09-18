import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import TrackOrder from "./pages/TrackOrder/TrackOrder"; // <-- TRANG THEO DÕI ĐƠN HÀNG MỚI

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // <-- NƠI LƯU DANH SÁCH ĐƠN HÀNG

  // 👉 HÀM MỚI: thêm đơn hàng vào danh sách
  const addOrder = (newOrder) => setOrders((prev) => [...prev, newOrder]);

  return (
    <>
      {showLogin && (
        <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />
      )}

      <div className="app">
        <Navbar
          setShowLogin={setShowLogin}
          user={user}
          setUser={setUser}        // truyền setUser xuống Navbar
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/order"
            element={<PlaceOrder orders={orders} addOrder={addOrder} />} 
            // ✅ truyền addOrder cho PlaceOrder để khi bấm “Đặt hàng”
            // có thể push đơn hàng mới vào state orders
          />
          <Route
            path="/track-order"
            element={<TrackOrder orders={orders} />} 
            // ✅ trang Theo dõi đơn hàng: chỉ cần đọc orders để tra cứu
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
