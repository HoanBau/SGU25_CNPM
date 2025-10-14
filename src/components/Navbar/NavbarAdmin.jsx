// src/components/Navbar/NavbarAdmin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const NavbarAdmin = ({ user, setUser, setShowLogin }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  // ✅ Khi admin logout: quay về trang chủ người dùng + bật popup login
  const handleLogout = () => {
    setUser(null); // xóa thông tin admin đang đăng nhập
    localStorage.removeItem("user"); // xóa user trong localStorage
    setShowUserDropdown(false);

    // 👉 Điều hướng về trang chủ
    navigate("/");

    // 👉 Hiển thị popup đăng nhập sau khi về trang chủ
    setTimeout(() => {
      setShowLogin(true);
    }, 300);
  };

  return (
    <div className="navbar">
      <Link to="/admin" className="logo-text">
        FoodFast Admin
      </Link>

      <div className="navbar-right">
        {/* ✅ Nếu admin đã đăng nhập */}
        {user && user.role === "admin" ? (
          <div className="navbar-user-wrapper">
            <div
              className="navbar-user"
              onClick={() => setShowUserDropdown((prev) => !prev)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={user.avatar || assets.user_icon}
                alt="admin_avatar"
                className="user-avatar"
                style={{ width: "32px", borderRadius: "50%" }}
              />
              <span>{user.name}</span>
            </div>

            {/* Dropdown logout */}
            {showUserDropdown && (
              <div className="user-dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          // ✅ Nếu chưa đăng nhập thì chỉ có nút Sign in
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default NavbarAdmin;
