import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";

const LoginPopup = ({ setShowLogin, setUser }) => {
  const [currentState, setCurrentState] = useState("Sign up");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameInput = e.target.elements.name?.value || "User";

    setUser({
      name: nameInput,
      avatar: assets.user_icon,
    });

    setShowLogin(false);
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            src={assets.cross_icon}
            alt="cross_icon"
            onClick={() => setShowLogin(false)}
          />
        </div>

        <div className="login-popup-inputs">
          {currentState === "Sign up" && (
            <input type="text" name="name" placeholder="Your name" required />
          )}
          <input type="email" name="email" placeholder="Your email" required />
          <input type="password" name="password" placeholder="Password" required />
        </div>

        <button type="submit">
          {currentState === "Sign up" ? "Create Account" : "Login"}
        </button>

        {currentState === "Sign up" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        )}

        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
