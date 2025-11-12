import React, { useState, useEffect } from "react";
import "./SidebarServer.css";

const SidebarServer = ({ setView, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Cập nhật isMobile khi resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger chỉ hiện trên mobile */}
      {isMobile && (
        <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div>
      )}

      {/* Overlay mờ */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isOpen ? "" : "hidden"}`}
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar-server ${isMobile && isOpen ? "open" : isMobile ? "closed" : ""}`}>
        <h2>Server Panel</h2>
        <ul>
          <li
            className={currentView === "dashboard" ? "active" : ""}
            onClick={() => { setView("dashboard"); closeSidebar(); }}
          >
            📊 Dashboard
          </li>
          <li
            className={currentView === "stores" ? "active" : ""}
            onClick={() => { setView("stores"); closeSidebar(); }}
          >
            🏪 Danh sách cửa hàng
          </li>
          <li
            className={currentView === "users" ? "active" : ""}
            onClick={() => { setView("users"); closeSidebar(); }}
          >
            👤 Quản lý người dùng
          </li>
          <li
            className={currentView === "drones" ? "active" : ""}
            onClick={() => { setView("drones"); closeSidebar(); }}
          >
            🚁 Quản lý Drone
          </li>
          <li
            className={currentView === "revenues" ? "active" : ""}
            onClick={() => { setView("revenues"); closeSidebar(); }}
          >
            💰 Quản lý doanh thu
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarServer;
