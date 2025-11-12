import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ setView, currentView }) => {
  const [isOpen, setIsOpen] = useState(false); // để toggle sidebar trên mobile

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger icon cho mobile */}
      <div className="hamburger" onClick={handleToggle}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
            alt="logo"
            className="sidebar-logo"
          />
          <h2>FoodFast Panel</h2>
        </div>
        <ul>
          <li
            className={currentView === "dashboard" ? "active" : ""}
            onClick={() => { setView("dashboard"); setIsOpen(false); }}
          >
            📊 Dashboard
          </li>
          <li
            className={currentView === "orders" ? "active" : ""}
            onClick={() => { setView("orders"); setIsOpen(false); }}
          >
            📝 Danh sách đơn hàng
          </li>
          <li
            className={currentView === "manageFood" ? "active" : ""}
            onClick={() => { setView("manageFood"); setIsOpen(false); }}
          >
            🍜 Quản lý món ăn
          </li>
          <li
            className={currentView === "drone" ? "active" : ""}
            onClick={() => { setView("drone"); setIsOpen(false); }}
          >
            🚁 Drone
          </li>
          <li
            className={currentView === "settings" ? "active" : ""}
            onClick={() => { setView("settings"); setIsOpen(false); }}
          >
            ⚙️ Cài đặt quán
          </li>
          <li
            className={currentView === "earnings" ? "active" : ""}
            onClick={() => { setView("earnings"); setIsOpen(false); }}
          >
            💳 Rút tiền doanh thu
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
