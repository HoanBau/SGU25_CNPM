import React from "react";
import "./Sidebar.css";

// Giữ nguyên component cũ nhưng thêm mục Drone
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

        {/* ✅ Mục mới: Drone Map */}
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
