import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import NavbarAdmin from "./components/Navbar/NavbarAdmin";
import NavbarServer from "./components/Navbar/NavbarServer";

import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import Admin from "./pages/Admin/Admin";
import OrderList from "./pages/Admin/OrderList";
import Server from "./pages/Server/Server"; // Trang server mới

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  const isServerPage = location.pathname.startsWith("/server");

  // ✅ Load user từ localStorage khi khởi động app
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      // Nếu đang là admin và reload lại thì vẫn ở trang admin
      if (savedUser.role === "admin" && !isAdminPage) {
        navigate("/admin");
      }
      // Nếu đang là server và reload lại thì vẫn ở trang server
      if (savedUser.role === "server" && !isServerPage) {
        navigate("/server");
      }
    }
  }, [navigate, isAdminPage, isServerPage]);

  // ✅ Lưu đơn hàng trong localStorage
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // ✅ Cập nhật đơn hàng mới
  const addOrder = (newOrder) => {
    setOrders((prev) => {
      const updated = [...prev, newOrder];
      localStorage.setItem("orders", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Đăng xuất user
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setShowLogin(true); // sau khi logout → về trang chủ và mở popup login
  };

  return (
    <>
      {/* Hiện popup login khi cần */}
      {showLogin && (
        <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />
      )}

      <div className="app">
        {/* Navbar thay đổi theo trang admin / server / người dùng */}
        {isServerPage ? (
          <NavbarServer
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
          />
        ) : isAdminPage ? (
          <NavbarAdmin
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
            handleLogout={handleLogout}
          />
        ) : (
          <Navbar
            setShowLogin={setShowLogin}
            user={user}
            setUser={setUser}
            handleLogout={handleLogout}
          />
        )}

        {/* Routes */}
        <Routes>
          {/* Trang người dùng */}
          <Route
            path="/"
            element={<Home user={user} setShowLogin={setShowLogin} />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/order"
            element={<PlaceOrder orders={orders} addOrder={addOrder} />}
          />
          <Route path="/track-order" element={<TrackOrder orders={orders} />} />

          {/* Trang admin */}
          <Route path="/admin" element={<Admin orders={orders} />} />
          <Route
            path="/admin/orders"
            element={<OrderList orders={orders} setOrders={setOrders} />}
          />

          {/* Trang server */}
          <Route path="/server" element={<Server />} />
        </Routes>
      </div>

      {/* Footer chỉ hiển thị trên trang người dùng */}
      {!isAdminPage && !isServerPage && <Footer />}
    </>
  );
};

export default App;
