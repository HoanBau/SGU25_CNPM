import React from "react";
import "./SidebarServer.css";

// Sidebar cho trang Server
const SidebarServer = ({ setView, currentView }) => {
  return (
    <div className="sidebar-server">
      <h2>Server Panel</h2>
      <ul>
        <li
          className={currentView === "dashboard" ? "active" : ""}
          onClick={() => setView("dashboard")}
        >
          📊 Dashboard
        </li>

        <li
          className={currentView === "stores" ? "active" : ""}
          onClick={() => setView("stores")}
        >
          🏪 Danh sách cửa hàng
        </li>

        <li
          className={currentView === "orders" ? "active" : ""}
          onClick={() => setView("orders")}
        >
          📝 Quản lý đơn hàng
        </li>

         {/* Thêm quản lý người dùng */}
        <li
          className={currentView === "users" ? "active" : ""}
          onClick={() => setView("users")}
        >
          👤 Quản lý người dùng
        </li>

        <li
          className={currentView === "drones" ? "active" : ""}
          onClick={() => setView("drones")}
        >
          🚁 Quản lý Drone
        </li>

       
      </ul>
    </div>
  );
};

export default SidebarServer;
