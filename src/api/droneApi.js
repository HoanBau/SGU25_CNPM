// src/api/droneApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ================================
// 🚁 API mô phỏng quản lý Drone
// ================================
export const droneApi = {
  // 🧩 Lấy danh sách drone (từ localStorage)
  getAll: async () => {
    const drones = JSON.parse(localStorage.getItem("drones_data")) || [
      { id: 1, name: "Drone 1", status: "ready" },
      { id: 2, name: "Drone 2", status: "ready" },
      { id: 3, name: "Drone 3", status: "maintenance" },
    ];
    return drones;

    // 📦 Khi có backend thật:
    // const res = await axios.get(`${BASE_URL}/drones`);
    // return res.data;
  },

  // 🧩 Thêm drone mới
  add: async (newDrone) => {
    const drones = JSON.parse(localStorage.getItem("drones_data")) || [];
    const newEntry = {
      id: Date.now(),
      ...newDrone,
      status: newDrone.status || "ready",
    };
    const updated = [...drones, newEntry];
    localStorage.setItem("drones_data", JSON.stringify(updated));
    return newEntry;

    // 📦 Backend thật:
    // const res = await axios.post(`${BASE_URL}/drones`, newDrone);
    // return res.data;
  },

  // 🧩 Cập nhật drone (sửa tên, trạng thái,…)
  update: async (id, updatedDrone) => {
    const drones = JSON.parse(localStorage.getItem("drones_data")) || [];
    const updated = drones.map((d) =>
      d.id === id ? { ...d, ...updatedDrone } : d
    );
    localStorage.setItem("drones_data", JSON.stringify(updated));
    return updated.find((d) => d.id === id);

    // 📦 Backend thật:
    // const res = await axios.put(`${BASE_URL}/drones/${id}`, updatedDrone);
    // return res.data;
  },

  // 🧩 Xóa drone
  delete: async (id) => {
    const drones = JSON.parse(localStorage.getItem("drones_data")) || [];
    const updated = drones.filter((d) => d.id !== id);
    localStorage.setItem("drones_data", JSON.stringify(updated));
    return true;

    // 📦 Backend thật:
    // await axios.delete(`${BASE_URL}/drones/${id}`);
    // return true;
  },

  // 🧩 Cập nhật trạng thái (ví dụ: từ “ready” → “delivering”)
  updateStatus: async (id, newStatus) => {
    const drones = JSON.parse(localStorage.getItem("drones_data")) || [];
    const updated = drones.map((d) =>
      d.id === id ? { ...d, status: newStatus } : d
    );
    localStorage.setItem("drones_data", JSON.stringify(updated));
    return updated.find((d) => d.id === id);

    // 📦 Backend thật:
    // const res = await axios.patch(`${BASE_URL}/drones/${id}/status`, { status: newStatus });
    // return res.data;
  },
};
