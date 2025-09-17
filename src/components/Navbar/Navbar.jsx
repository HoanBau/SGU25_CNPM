import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = ({ user, setUser, setShowLogin }) => {
  const { getTotalQuantity } = useContext(StoreContext);
  const totalQuantity = getTotalQuantity();
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowUserDropdown(false);
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
          onClick={() => { setMenu("home"); setShowMobileMenu(false); }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => { setMenu("menu"); setShowMobileMenu(false); }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => { setMenu("mobile-app"); setShowMobileMenu(false); }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => { setMenu("contact-us"); setShowMobileMenu(false); }}
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
              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
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
