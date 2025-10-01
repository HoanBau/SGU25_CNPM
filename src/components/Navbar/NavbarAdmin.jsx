// src/components/Navbar/NavbarAdmin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const NavbarAdmin = ({ user, setUser, setShowLogin }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // xoá user hiện tại
    setShowUserDropdown(false);
    navigate("/"); // 👉 chuyển về trang user
    setShowLogin(true); // 👉 mở popup Sign in
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
          // ✅ Nếu chưa đăng nhập thì chỉ có Sign in
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default NavbarAdmin;
