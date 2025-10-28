// src/api/userApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // URL backend thật (sau này dùng)

// 🧩 API mô phỏng người dùng, admin và restaurant
export const userApi = {
  // ==============================
  // 👤 NGƯỜI DÙNG (USER)
  // ==============================

  // Lấy tất cả user (giả lập)
  getAllUsers: async () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
  },

  // Đăng ký người dùng mới
  register: async (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra trùng email
    if (users.some((u) => u.email === userData.email)) {
      throw new Error("Email đã tồn tại");
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      role: "user",
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("user", JSON.stringify(newUser));

    return newUser;

    // 📦 Khi có backend thật:
    // const res = await axios.post(`${BASE_URL}/users/register`, userData);
    // return res.data;
  },

  // Đăng nhập người dùng
  login: async (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) throw new Error("Sai email hoặc mật khẩu");

    localStorage.setItem("user", JSON.stringify(foundUser));
    return foundUser;

    // 📦 Backend thật:
    // const res = await axios.post(`${BASE_URL}/users/login`, { email, password });
    // return res.data;
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  },

  // Đăng xuất
  logout: async () => {
    localStorage.removeItem("user");
    return true;
  },

  // ==============================
  // 🏢 ADMIN
  // ==============================
  loginAdmin: async (email, password) => {
    const admins = JSON.parse(localStorage.getItem("admins")) || [
      { email: "admin@foodfast.com", password: "admin123", role: "admin" },
    ];

    const foundAdmin = admins.find(
      (a) => a.email === email && a.password === password
    );

    if (!foundAdmin) throw new Error("Sai tài khoản hoặc mật khẩu admin");

    localStorage.setItem("admin", JSON.stringify(foundAdmin));
    return foundAdmin;

    // 📦 Khi có backend thật:
    // const res = await axios.post(`${BASE_URL}/admin/login`, { email, password });
    // return res.data;
  },

  getCurrentAdmin: async () => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin || null;
  },

  logoutAdmin: async () => {
    localStorage.removeItem("admin");
    return true;
  },

  // ==============================
  // 🍽️ NHÀ HÀNG (RESTAURANT)
  // ==============================
  loginRestaurant: async (email, password) => {
    const restaurants = JSON.parse(localStorage.getItem("restaurants")) || [
      { email: "res@pho24.com", password: "123456", name: "Phở 24", role: "restaurant" },
    ];

    const foundRes = restaurants.find(
      (r) => r.email === email && r.password === password
    );

    if (!foundRes) throw new Error("Sai tài khoản nhà hàng");

    localStorage.setItem("restaurant", JSON.stringify(foundRes));
    return foundRes;

    // 📦 Khi có backend thật:
    // const res = await axios.post(`${BASE_URL}/restaurants/login`, { email, password });
    // return res.data;
  },

  getCurrentRestaurant: async () => {
    const res = JSON.parse(localStorage.getItem("restaurant"));
    return res || null;
  },

  logoutRestaurant: async () => {
    localStorage.removeItem("restaurant");
    return true;
  },
};
