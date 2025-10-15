import React, { useState, useEffect } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin, setUser }) => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setShowLogin(false);
    }
  }, [setUser, setShowLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameInput = e.target.elements.name?.value || "User";
    const emailInput = e.target.elements.email.value;
    const passwordInput = e.target.elements.password.value;
    const phoneInput = e.target.elements.phone?.value || "";
    const addressInput = e.target.elements.address?.value || "";

    // 🧠 Nếu đăng nhập là server hoặc admin
    if (emailInput === "server@foodfast.com" && passwordInput === "server123") {
      const serverUser = {
        name: "Server Admin",
        avatar: assets.user_icon,
        role: "server",
        email: emailInput,
      };
      localStorage.setItem("user", JSON.stringify(serverUser));
      setUser(serverUser);
      setShowLogin(false);
      navigate("/server");
      return;
    }

    if (emailInput === "admin@foodfast.com" && passwordInput === "admin123") {
      const adminUser = {
        name: "Admin",
        avatar: assets.user_icon,
        role: "admin",
        email: emailInput,
      };
      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
      setShowLogin(false);
      navigate("/admin");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // 🧩 Đăng ký
    if (currentState === "Sign up") {
      if (storedUsers.some((u) => u.email === emailInput)) {
        setErrorMsg("❌ Email đã tồn tại, vui lòng dùng email khác.");
        return;
      }

      const newUser = {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        avatar: assets.user_icon,
        role: "user",
        phone: phoneInput,
        address: addressInput,
      };

      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setShowLogin(false);
      return;
    }

    // 🧩 Đăng nhập
    if (currentState === "Login") {
      const foundUser = storedUsers.find(
        (u) => u.email === emailInput && u.password === passwordInput
      );
      if (foundUser) {
        // ✅ Giữ lại thông tin người dùng đã chỉnh sửa trong Profile
        const oldUser = JSON.parse(localStorage.getItem("user")) || {};
        const mergedUser = { ...foundUser, ...oldUser }; // merge giữ phone, address, name đã chỉnh
        localStorage.setItem("user", JSON.stringify(mergedUser));
        setUser(mergedUser);
        setShowLogin(false);
      } else {
        setErrorMsg("❌ Sai email hoặc mật khẩu");
      }
      return;
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
            <>
              <input type="text" name="name" placeholder="Your name" required />
              <input type="text" name="phone" placeholder="Phone number" />
              <input type="text" name="address" placeholder="Delivery address" />
            </>
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
