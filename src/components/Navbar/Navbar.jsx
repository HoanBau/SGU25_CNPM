import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser, setShowLogin }) => {
  const { getTotalQuantity } = useContext(StoreContext);
  const totalQuantity = getTotalQuantity();
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Xóa user khỏi localStorage
    setUser(null);
    setShowUserDropdown(false);
    navigate("/"); // ✅ Quay lại trang chủ sau khi logout
  };

  const goToMenuSection = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("explore-menu");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setMenu("menu");
    setShowMobileMenu(false);
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo-text">
        FoodFast
      </Link>

      {/* Hamburger icon cho mobile */}
      <div
        className="hamburger"
        onClick={() => setShowMobileMenu((prev) => !prev)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`navbar-menu ${showMobileMenu ? "active" : ""}`}>
        <Link
          to="/"
          onClick={() => {
            setMenu("home");
            setShowMobileMenu(false);
          }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <a
          href="#explore-menu"
          onClick={goToMenuSection}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>

        <Link
          to="/track-order"
          onClick={() => {
            setMenu("track-order");
            setShowMobileMenu(false);
          }}
          className={menu === "track-order" ? "active" : ""}
        >
          Track Order
        </Link>

        <a
          href="#app-download"
          onClick={() => {
            setMenu("mobile-app");
            setShowMobileMenu(false);
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>

        <a
          href="#footer"
          onClick={() => {
            setMenu("contact-us");
            setShowMobileMenu(false);
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      <div className="navbar-right">
        {/* Giỏ hàng */}
        <div className="navbar-basket-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="basket_icon" />
          </Link>
          <div className={totalQuantity === 0 ? "dotHidden" : "dot"}>
            <p>{totalQuantity}</p>
          </div>
        </div>

        {/* User */}
        {user ? (
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
                alt="user_avatar"
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
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
