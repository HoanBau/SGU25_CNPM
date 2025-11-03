// src/api/storeApi.js
// 🔥 Fake API mô phỏng backend cho phần "Stores.jsx"

const COMMISSION_RATE = 0.2;

const defaultStores = [
  { id: 1, name: "Phở 24", address: "Quận 1", phone: "0900000001", status: "active", note: "Đang nhận đơn", revenue: 550000 },
  { id: 2, name: "Cơm Tấm 123", address: "Quận 3", phone: "0900000002", status: "active", note: "Nhận đơn buổi sáng", revenue: 340000 },
  { id: 3, name: "Bún Bò Huế O Loan", address: "Quận 5", phone: "0900000003", status: "active", note: "Hoạt động tốt", revenue: 720000 },
  { id: 4, name: "Bánh Mì Sài Gòn", address: "Quận 10", phone: "0900000004", status: "pending", note: "Đang chờ Grab kiểm duyệt", revenue: 0 },
  { id: 5, name: "Cơm Niêu Nhà Lửa", address: "Quận 7", phone: "0900000005", status: "pending", note: "Đang chờ kiểm duyệt", revenue: 0 },
  { id: 6, name: "Trà Sữa Mlem", address: "Bình Thạnh", phone: "0900000006", status: "pending", note: "Đang chờ duyệt hồ sơ", revenue: 0 },
];

// ============================
// ⚙️ HÀM TIỆN ÍCH
// ============================
const getStores = () => JSON.parse(localStorage.getItem("stores")) || defaultStores;
const saveStores = (data) => localStorage.setItem("stores", JSON.stringify(data));
const getOrders = () => JSON.parse(localStorage.getItem("orders")) || [];
const saveOrders = (data) => localStorage.setItem("orders", JSON.stringify(data));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================
// 🍜 DỮ LIỆU MÓN ĂN GIẢ LẬP
// ============================
const sampleItems = [
  { name: "Cơm gà", price: 65000 },
  { name: "Phở bò", price: 70000 },
  { name: "Bún chả", price: 60000 },
  { name: "Bánh mì", price: 30000 },
  { name: "Trà sữa", price: 45000 },
];

// ============================
// 📦 TẠO ĐƠN GIẢ
// ============================
const makeFakeOrder = (store) => {
  const itemCount = randomInt(1, 3);
  const items = [];
  let subtotal = 0;
  for (let i = 0; i < itemCount; i++) {
    const itm = sampleItems[randomInt(0, sampleItems.length - 1)];
    const qty = randomInt(1, 2);
    items.push({ name: itm.name, price: itm.price, qty });
    subtotal += itm.price * qty;
  }
  const shipping = randomInt(10000, 20000);
  return {
    id: `ORD-${Date.now()}-${randomInt(100, 999)}`,
    storeId: store.id,
    storeName: store.name,
    items,
    subtotal,
    shipping,
    totalAmount: subtotal,
    createdAt: new Date().toISOString(),
  };
};

// ============================
// 🧩 API GIẢ LẬP
// ============================
export const storeApi = {
  // 📋 Lấy danh sách cửa hàng
  getStores: async () => getStores(),

  // 🏠 Đăng ký cửa hàng mới
  registerStore: async (data) => {
    const stores = getStores();
    const id = stores.length > 0 ? Math.max(...stores.map((s) => s.id)) + 1 : 1;
    const created = {
      id,
      ...data,
      status: "pending",
      note: "Đã gửi hồ sơ, chờ Grab kiểm duyệt.",
      revenue: 0,
    };
    const newStores = [...stores, created];
    saveStores(newStores);
    return created;
  },

  // 🗑️ Xóa cửa hàng
  deleteStore: async (id) => {
    const stores = getStores().filter((s) => s.id !== id);
    saveStores(stores);

    // Xóa đơn liên quan
    const orders = getOrders().filter((o) => o.storeId !== id);
    saveOrders(orders);
    return true;
  },

  // ✏️ Cập nhật thông tin cửa hàng
  updateStore: async (id, field, value) => {
    const stores = getStores().map((s) => (s.id === id ? { ...s, [field]: value } : s));
    saveStores(stores);
    return stores.find((s) => s.id === id);
  },

  // =====================
  // 🧾 QUY TRÌNH KIỂM DUYỆT
  // =====================
  startReview: async (id) => {
    const stores = getStores().map((s) =>
      s.id === id ? { ...s, status: "verifying", note: "Grab đang kiểm duyệt hồ sơ..." } : s
    );
    saveStores(stores);
    return stores.find((s) => s.id === id);
  },

  acceptStore: async (id) => {
    const stores = getStores().map((s) =>
      s.id === id
        ? { ...s, status: "approved", note: "✅ Hồ sơ được chấp nhận. Bấm Kích hoạt để active." }
        : s
    );
    saveStores(stores);
    return stores.find((s) => s.id === id);
  },

  rejectStore: async (id) => {
    const stores = getStores().map((s) =>
      s.id === id
        ? { ...s, status: "rejected", note: "❌ Hồ sơ bị từ chối. Yêu cầu bổ sung giấy tờ." }
        : s
    );
    saveStores(stores);
    return stores.find((s) => s.id === id);
  },

  activateStore: async (id) => {
    const stores = getStores().map((s) =>
      s.id === id ? { ...s, status: "active", note: "Đã kích hoạt. Bắt đầu nhận đơn." } : s
    );
    saveStores(stores);
    return stores.find((s) => s.id === id);
  },

  requestMoreDocs: async (id) => {
    const stores = getStores().map((s) =>
      s.id === id ? { ...s, status: "pending", note: "Grab yêu cầu bổ sung giấy tờ." } : s
    );
    saveStores(stores);
    return stores.find((s) => s.id === id);
  },

  // =====================
  // 💰 ĐƠN HÀNG & DOANH THU
  // =====================
  generateOrder: async (storeId) => {
    const stores = getStores();
    const store = stores.find((s) => s.id === storeId);
    if (!store || store.status !== "active") throw new Error("Cửa hàng không khả dụng.");

    const order = makeFakeOrder(store);
    const updatedStores = stores.map((s) =>
      s.id === storeId ? { ...s, revenue: (s.revenue || 0) + order.totalAmount } : s
    );
    saveStores(updatedStores);

    const orders = [order, ...getOrders()];
    saveOrders(orders);

    return order;
  },

  getOrders: async () => getOrders(),

  clearOrders: async () => {
    localStorage.removeItem("orders");
    return true;
  },
};
