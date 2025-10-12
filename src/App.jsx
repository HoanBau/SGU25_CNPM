import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";  
import Navbar from "./components/Navbar/Navbar";
import NavbarAdmin from "./components/Navbar/NavbarAdmin";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import TrackOrder from "./pages/TrackOrder/TrackOrder"; 
import Admin from "./pages/Admin/Admin";   
import OrderList from "./pages/Admin/OrderList";  {/* ✅ thêm dòng này */}

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Khởi tạo orders từ localStorage nếu có
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const location = useLocation();   
  const isAdminPage = location.pathname.startsWith("/admin"); 

  // ✅ Thêm đơn hàng mới và lưu vào localStorage
  const addOrder = (newOrder) => {
    setOrders((prev) => {
      const updated = [...prev, newOrder];
      localStorage.setItem("orders", JSON.stringify(updated));
      return updated;
    });
  };
  
  return (
    <>
      {showLogin && (
        <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />
      )}

      <div className="app">
        {isAdminPage ? (
          <NavbarAdmin 
            user={user}
            setUser={setUser}
            setShowLogin={setShowLogin}
          />
        ) : (
          <Navbar
            setShowLogin={setShowLogin}
            user={user}
            setUser={setUser}        
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/order"
            element={<PlaceOrder orders={orders} addOrder={addOrder} />} 
          />
          <Route
            path="/track-order"
            element={<TrackOrder orders={orders} />} 
          />
          <Route 
            path="/admin" 
            element={<Admin orders={orders} />}   
          />
          <Route 
            path="/admin/orders" 
            element={<OrderList orders={orders} setOrders={setOrders} />}  
          /> {/* ✅ thêm route mới */}
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </>
  );
};

export default App;
