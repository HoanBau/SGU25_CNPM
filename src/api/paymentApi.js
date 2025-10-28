// src/api/paymentApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // URL backend thật
const COMMISSION_RATE = 0.2;

export const paymentApi = {
  // ================== ORDERS (Khách) ==================
  createOrder: async (order) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = { ...order, id: Date.now(), status: "order", date: new Date().toISOString() };
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    return newOrder;

    // Backend thật:
    // const res = await axios.post(`${BASE_URL}/orders`, order);
    // return res.data;
  },

  getOrders: async (email) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return email ? orders.filter((o) => o.email === email) : orders;

    // Backend thật:
    // const res = await axios.get(`${BASE_URL}/orders`, { params: { email } });
    // return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem("orders", JSON.stringify(updated));
    return updated.find((o) => o.id === orderId);

    // Backend thật:
    // const res = await axios.patch(`${BASE_URL}/orders/${orderId}`, { status });
    // return res.data;
  },

  // ================== STORES & REVENUE (Nhà hàng & Server) ==================
  getStores: async () => {
    return JSON.parse(localStorage.getItem("stores")) || [
      { id: 1, name: "Phở 24", revenue: 550000 },
      { id: 2, name: "Cơm Tấm 123", revenue: 340000 },
      { id: 3, name: "Bún Bò Huế O Loan", revenue: 720000 },
    ];

    // Backend thật:
    // const res = await axios.get(`${BASE_URL}/stores`);
    // return res.data;
  },

  requestWithdraw: async (storeId, amount = null, bankInfo = null) => {
    const stores = await paymentApi.getStores();
    const withdrawRequests = JSON.parse(localStorage.getItem("withdrawRequests")) || [];

    const store = stores.find((s) => s.id === storeId);
    if (!store || (store.revenue === 0 && !amount)) throw new Error("Không có doanh thu để rút");

    const grossAmount = amount || store.revenue;
    const netAmount = Math.floor(grossAmount * (1 - COMMISSION_RATE));

    const req = {
      id: `WD-${Date.now()}`,
      storeId,
      storeName: store.name,
      grossAmount,
      netAmount,
      bankInfo,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("withdrawRequests", JSON.stringify([req, ...withdrawRequests]));
    return req;

    // Backend thật:
    // const res = await axios.post(`${BASE_URL}/withdraws`, { storeId, amount, bankInfo });
    // return res.data;
  },

  updateWithdrawStatus: async (id, status) => {
    const withdrawRequests = JSON.parse(localStorage.getItem("withdrawRequests")) || [];
    const updated = withdrawRequests.map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    localStorage.setItem("withdrawRequests", JSON.stringify(updated));

    if (status === "approved") {
      const stores = await paymentApi.getStores();
      const req = withdrawRequests.find((r) => r.id === id);
      const updatedStores = stores.map((s) =>
        s.id === req.storeId ? { ...s, revenue: s.revenue - req.grossAmount } : s
      );
      localStorage.setItem("stores", JSON.stringify(updatedStores));
    }

    return updated.find((r) => r.id === id);

    // Backend thật:
    // const res = await axios.patch(`${BASE_URL}/withdraws/${id}`, { status });
    // return res.data;
  },

  getWithdrawHistory: async (storeId = null) => {
    const allRequests = JSON.parse(localStorage.getItem("withdrawRequests")) || [];
    return storeId ? allRequests.filter((r) => r.storeId === storeId) : allRequests;

    // Backend thật:
    // const res = await axios.get(`${BASE_URL}/withdraws`, { params: { storeId } });
    // return res.data;
  },

  processMonthlyPayout: async () => {
    const stores = await paymentApi.getStores();
    const withdrawRequests = JSON.parse(localStorage.getItem("withdrawRequests")) || [];

    const newRequests = stores
      .filter((s) => s.revenue > 0)
      .map((s) => ({
        id: `WD-${Date.now()}-${s.id}`,
        storeId: s.id,
        storeName: s.name,
        grossAmount: s.revenue,
        netAmount: Math.floor(s.revenue * (1 - COMMISSION_RATE)),
        status: "approved",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      }));

    localStorage.setItem("withdrawRequests", JSON.stringify([...newRequests, ...withdrawRequests]));
    localStorage.setItem("stores", JSON.stringify(stores.map((s) => ({ ...s, revenue: 0 }))));

    return newRequests;

    // Backend thật:
    // const res = await axios.post(`${BASE_URL}/withdraws/monthly-payout`);
    // return res.data;
  },
};
