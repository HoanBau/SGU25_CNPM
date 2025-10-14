import React from "react";
import "./Sidebar.css";

// Sidebar có thêm mục "Quản lý món ăn"
const Sidebar = ({ setView, currentView }) => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li
          className={currentView === "dashboard" ? "active" : ""}
          onClick={() => setView("dashboard")}
        >
          📊 Dashboard
        </li>

        <li
          className={currentView === "orders" ? "active" : ""}
          onClick={() => setView("orders")}
        >
          📝 Danh sách đơn hàng
        </li>

        {/* ✅ Mục mới: Quản lý món ăn */}
        <li
          className={currentView === "manageFood" ? "active" : ""}
          onClick={() => setView("manageFood")}
        >
          🍜 Quản lý món ăn
        </li>

        {/* ✅ Mục Drone giữ nguyên */}
        <li
          className={currentView === "drone" ? "active" : ""}
          onClick={() => setView("drone")}
        >
          🚁 Drone
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
