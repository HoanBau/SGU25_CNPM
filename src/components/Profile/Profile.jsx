import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 để điều hướng
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate(); // 👈 hook điều hướng

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // ✅ Lấy dữ liệu user từ localStorage khi vào trang
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // ✅ Cập nhật dữ liệu khi nhập (trừ email)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Lưu lại thông tin vào localStorage
  const handleSave = () => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = { ...savedUser, ...user }; // giữ lại role, password,...
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // 🧠 Cập nhật trong danh sách "users"
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map((u) =>
      u.email === updatedUser.email ? { ...u, ...updatedUser } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("✅ Cập nhật thông tin thành công!");
  };

  // ✅ Xóa tài khoản và tự động đăng xuất
  const handleDeleteAccount = () => {
    if (window.confirm("⚠️ Bạn có chắc muốn xóa tài khoản này không?")) {
      // Xóa user khỏi danh sách
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      const remainingUsers = allUsers.filter((u) => u.email !== user.email);
      localStorage.setItem("users", JSON.stringify(remainingUsers));

      // Xóa user hiện tại
      localStorage.removeItem("user");

      alert("🚫 Tài khoản đã bị xóa! Bạn sẽ được đăng xuất.");

      // Xóa thông tin trên giao diện
      setUser({ name: "", email: "", phone: "", address: "" });

      // ⏩ Điều hướng về trang chủ
      navigate("/");
      window.location.reload(); // 👈 reload để reset toàn bộ trạng thái đăng nhập
    }
  };

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>

      <div className="profile-form">
        <label>Họ tên</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
        />

        <label>Email (không thể thay đổi)</label>
        <input
          type="email"
          name="email"
          value={user.email}
          readOnly
          className="readonly-input"
        />

        <label>Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />

        <label>Địa chỉ giao hàng</label>
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
        />

        <div className="profile-actions">
          <button className="save-btn" onClick={handleSave}>
            💾 Lưu thông tin
          </button>
          <button className="delete-btn" onClick={handleDeleteAccount}>
            🗑️ Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
