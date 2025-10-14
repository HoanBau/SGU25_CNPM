import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const NavbarServer = ({ user, setUser, setShowLogin }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setShowUserDropdown(false);
    navigate("/"); // 👉 Điều hướng về trang chủ người dùng
    setShowLogin(true); // 👉 Mở popup đăng nhập người dùng
  };

  return (
    <div className="navbar-server" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#fff",
      borderBottom: "1px solid #ddd"
    }}>
      <div className="logo-text" style={{ fontWeight: "bold", fontSize: "20px" }}>
        FoodFast Server
      </div>

      <div className="navbar-right">
        {!user ? (
          <button
            style={{
              padding: "6px 12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#2ecc71",
              color: "#fff",
              cursor: "pointer"
            }}
            onClick={() => setShowLogin(true)}
          >
            Sign in
          </button>
        ) : (
          <div className="navbar-user-wrapper" style={{ position: "relative" }}>
            <div
              className="navbar-user"
              onClick={() => setShowUserDropdown(prev => !prev)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <img
                src={user.avatar || assets.user_icon}
                alt="server_avatar"
                style={{ width: "32px", borderRadius: "50%" }}
              />
              <span>{user.name}</span>
            </div>

            {showUserDropdown && (
              <div
                className="user-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: "6px",
                  padding: "10px",
                  zIndex: 100
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarServer;
