import React from "react";
import "./Sidebar.css";

// Giữ nguyên component cũ nhưng thêm props để chuyển tab
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
      </ul>
    </div>
  );
};

export default Sidebar;
