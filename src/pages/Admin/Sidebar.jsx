import React from "react";
import "./Sidebar.css";

// Sidebar có thêm mục "Quản lý món ăn", "Cài đặt quán", "Rút tiền doanh thu"
const Sidebar = ({ setView, currentView }) => {
  return (
    <div className="sidebar">
       {/* ===== Header có logo và tiêu đề ===== */}
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

        {/* ✅ Mục mới: Cài đặt quán */}
        <li
          className={currentView === "settings" ? "active" : ""}
          onClick={() => setView("settings")}
        >
          ⚙️ Cài đặt quán
        </li>

        {/* ✅ Mục mới: Rút tiền doanh thu */}
        <li
          className={currentView === "earnings" ? "active" : ""}
          onClick={() => setView("earnings")}
        >
          💳 Rút tiền doanh thu
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
