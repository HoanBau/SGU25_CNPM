// src/api/paymentApi.js
import axios from "axios";

//const BASE_URL = "http://localhost:5000/api"; // backend thật
const COMMISSION_RATE = 0.2;

// ================== HÀM TIỆN ÍCH ==================
const getLocal = (key, fallback = []) =>
  JSON.parse(localStorage.getItem(key)) || fallback;
const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const paymentApi = {
  // ================== ORDERS (Khách) ==================
  createOrder: async (order) => {
    const orders = getLocal("orders");
    const newOrder = {
      ...order,
      id: Date.now(),
      status: "order",
      date: new Date().toISOString(),
    };
    setLocal("orders", [...orders, newOrder]);
    return newOrder;

    // Backend thật:
    // const res = await axios.post(`${BASE_URL}/orders`, order);
    // return res.data;
  },

  getOrders: async (email = null) => {
    const orders = getLocal("orders");
    return email ? orders.filter((o) => o.email === email) : orders;

    // Backend thật:
    // const res = await axios.get(`${BASE_URL}/orders`, { params: { email } });
    // return res.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const orders = getLocal("orders");
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    setLocal("orders", updated);
    return updated.find((o) => o.id === orderId);

    // Backend thật:
    // const res = await axios.patch(`${BASE_URL}/orders/${orderId}`, { status });
    // return res.data;
  },

  // ================== STORES (Nhà hàng) ==================
  getStores: async () => {
    return getLocal("stores", [
      { id: 1, name: "Phở 24", revenue: 550000 },
      { id: 2, name: "Cơm Tấm 123", revenue: 340000 },
      { id: 3, name: "Bún Bò Huế O Loan", revenue: 720000 },
    ]);

    // Backend thật:
    // const res = await axios.get(`${BASE_URL}/stores`);
    // return res.data;
  },

  updateStoreInfo: async (storeId, updateData) => {
    const stores = getLocal("stores");
    const updated = stores.map((s) =>
      s.id === storeId ? { ...s, ...updateData } : s
    );
    setLocal("stores", updated);
    return updated.find((s) => s.id === storeId);
  },

  // ================== RÚT TIỀN ==================
  requestWithdraw: async (storeId, amount = null, bankInfo = null) => {
    const stores = await paymentApi.getStores();
    const withdrawRequests = getLocal("withdrawRequests");
    const store = stores.find((s) => s.id === storeId);

    if (!store) throw new Error("Không tìm thấy quán");
    if (store.revenue <= 0 && !amount)
      throw new Error("Không có doanh thu để rút");

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

    setLocal("withdrawRequests", [req, ...withdrawRequests]);
    return req;

    // Backend thật:
    // const res = await axios.post(`${BASE_URL}/withdraws`, { storeId, amount, bankInfo });
    // return res.data;
  },

  updateWithdrawStatus: async (id, status) => {
    const withdrawRequests = getLocal("withdrawRequests");
    const target = withdrawRequests.find((r) => r.id === id);
    if (!target) throw new Error("Không tìm thấy yêu cầu rút tiền");

    const updated = withdrawRequests.map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    setLocal("withdrawRequests", updated);

    // Nếu duyệt rút -> trừ doanh thu của quán
    if (status === "approved") {
      const stores = await paymentApi.getStores();
      const updatedStores = stores.map((s) =>
        s.id === target.storeId
          ? { ...s, revenue: Math.max(s.revenue - target.grossAmount, 0) }
          : s
      );
      setLocal("stores", updatedStores);
    }

    return updated.find((r) => r.id === id);

    // Backend thật:
    // const res = await axios.patch(`${BASE_URL}/withdraws/${id}`, { status });
    // return res.data;
  },

  getWithdrawHistory: async (storeId = null) => {
    const all = getLocal("withdrawRequests");
    return storeId ? all.filter((r) => r.storeId === storeId) : all;

    // Backend thật:
    // const res = await axios.get(`${BASE_URL}/withdraws`, { params: { storeId } });
    // return res.data;
  },

  // ================== THANH TOÁN CUỐI THÁNG (SERVER) ==================
  processMonthlyPayout: async () => {
    const stores = await paymentApi.getStores();
    const withdrawRequests = getLocal("withdrawRequests");

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

    setLocal("withdrawRequests", [...newRequests, ...withdrawRequests]);
    setLocal("stores", stores.map((s) => ({ ...s, revenue: 0 })));

    return newRequests;

    // Backend thật:
    // const res = await axios.post(`${BASE_URL}/withdraws/monthly-payout`);
    // return res.data;
  },
};
