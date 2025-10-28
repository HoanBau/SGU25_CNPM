// src/api/orderApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const orderApi = {
  // 🧾 Tạo đơn hàng mới (gọi từ PlaceOrder)
  createOrder: async (orderData) => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrder = {
        ...orderData,
        id: Date.now(),
        status: "order", // Trạng thái mặc định
      };
      localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));

      // Khi có backend thật:
      // const res = await axios.post(`${BASE_URL}/orders`, orderData);
      // return res.data;

      return newOrder;
    } catch (err) {
      console.error("❌ Lỗi tạo đơn hàng:", err);
      throw err;
    }
  },

  // 📋 Lấy tất cả đơn hàng (cho admin / restaurant)
  getAllOrders: async () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return orders;

    // Khi có backend thật:
    // const res = await axios.get(`${BASE_URL}/orders`);
    // return res.data;
  },

  // 🔍 Lấy đơn hàng theo email (cho người dùng)
  getOrdersByEmail: async (email) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return orders.filter((o) => o.email === email);

    // Khi có backend thật:
    // const res = await axios.get(`${BASE_URL}/orders?email=${email}`);
    // return res.data;
  },

  // ⚙️ Cập nhật trạng thái đơn hàng (admin duyệt / drone giao)
  updateOrderStatus: async (orderId, newStatus) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    return updatedOrders.find((o) => o.id === orderId);

    // Khi có backend thật:
    // const res = await axios.put(`${BASE_URL}/orders/${orderId}`, { status: newStatus });
    // return res.data;
  },

  // ❌ Xóa đơn hàng
  deleteOrder: async (orderId) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const filtered = orders.filter((o) => o.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(filtered));
    return true;

    // Khi có backend thật:
    // await axios.delete(`${BASE_URL}/orders/${orderId}`);
  },
};
