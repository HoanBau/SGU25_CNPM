import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom"; // ✅ THÊM

const LoginPopup = ({ setShowLogin, setUser }) => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate(); // ✅ THÊM

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameInput = e.target.elements.name?.value || "User";
    const emailInput = e.target.elements.email.value;
    const passwordInput = e.target.elements.password.value;

    // ✅ Kiểm tra nếu là admin
    if (emailInput === "admin@foodfast.com" && passwordInput === "admin123") {
      setUser({
        name: "Admin",
        avatar: assets.user_icon,
        role: "admin", // thêm role để phân quyền
      });
      setShowLogin(false);
      navigate("/admin");   // ✅ THÊM: chuyển hướng qua trang admin
      return;
    }

    // ✅ Người dùng thường
    if (currentState === "Sign up") {
      setUser({
        name: nameInput,
        avatar: assets.user_icon,
        role: "user",
      });
      setShowLogin(false);
    } else if (currentState === "Login") {
      // login thường → ở đây chưa có backend nên chỉ giả lập
      setUser({
        name: "User",
        avatar: assets.user_icon,
        role: "user",
      });
      setShowLogin(false);
    } else {
      setErrorMsg("❌ Sai email hoặc mật khẩu");
    }
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

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
