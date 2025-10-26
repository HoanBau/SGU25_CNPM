import React, { useState, useEffect, useRef } from "react";
import "./Stores.css";

/** ---------------------------
 * ⚙️ Cấu hình mô phỏng
 ---------------------------- */
const COMMISSION_RATE = 0.2; // Grab thu 20%
const currency = (v) => new Intl.NumberFormat("vi-VN").format(Math.floor(v || 0)) + " ₫";
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** ---------------------------
 * 🍜 Món ăn mẫu (GrabFood menu)
 ---------------------------- */
const sampleItems = [
  { name: "Cơm gà", price: 65000 },
  { name: "Phở bò", price: 70000 },
  { name: "Bún chả", price: 60000 },
  { name: "Bánh mì", price: 30000 },
  { name: "Trà sữa", price: 45000 },
];

/** ---------------------------
 * 📦 Hàm tạo đơn hàng giả lập
 ---------------------------- */
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

/** ---------------------------
 * 🏪 COMPONENT CHÍNH
 ---------------------------- */
const Stores = () => {
  /** ====== STATE ====== */
  const [stores, setStores] = useState([
    // ban đầu có 3 active + 3 pending (như bạn yêu cầu)
    { id: 1, name: "Phở 24", address: "Quận 1", phone: "0900000001", status: "active", note: "Đang nhận đơn", revenue: 550000 },
    { id: 2, name: "Cơm Tấm 123", address: "Quận 3", phone: "0900000002", status: "active", note: "Nhận đơn buổi sáng", revenue: 340000 },
    { id: 3, name: "Bún Bò Huế O Loan", address: "Quận 5", phone: "0900000003", status: "active", note: "Hoạt động tốt", revenue: 720000 },
    { id: 4, name: "Bánh Mì Sài Gòn", address: "Quận 10", phone: "0900000004", status: "pending", note: "Đang chờ Grab kiểm duyệt", revenue: 0 },
    { id: 5, name: "Cơm Niêu Nhà Lửa", address: "Quận 7", phone: "0900000005", status: "pending", note: "Đang chờ kiểm duyệt", revenue: 0 },
    { id: 6, name: "Trà Sữa Mlem", address: "Bình Thạnh", phone: "0900000006", status: "pending", note: "Đang chờ duyệt hồ sơ", revenue: 0 },
  ]);

  const [newStore, setNewStore] = useState({ name: "", address: "", phone: "", documents: "" });
  const [orders, setOrders] = useState([]);
  const [autoRunning, setAutoRunning] = useState(false);
  const autoRef = useRef(null);

  /** ====== THỐNG KÊ ====== */
  const totalRevenue = stores.reduce((s, t) => s + (t.revenue || 0), 0);
  const totalGrab = Math.floor(totalRevenue * COMMISSION_RATE);
  const totalRestaurant = totalRevenue - totalGrab;

  /** ====== HÀNH ĐỘNG NHÀ HÀNG ====== */
  const registerStore = () => {
    if (!newStore.name || !newStore.address || !newStore.phone || !newStore.documents)
      return alert("Vui lòng nhập đầy đủ thông tin và giấy tờ hợp lệ!");
    const id = stores.length > 0 ? Math.max(...stores.map((s) => s.id)) + 1 : 1;
    const created = {
      id,
      ...newStore,
      status: "pending",
      note: "Đã gửi hồ sơ, chờ Grab kiểm duyệt.",
      revenue: 0,
    };
    setStores((prev) => [...prev, created]);
    setNewStore({ name: "", address: "", phone: "", documents: "" });
  };

  const deleteStore = (id) => {
    if (!window.confirm("Xóa cửa hàng này?")) return;
    setStores((prev) => prev.filter((s) => s.id !== id));
    setOrders((prev) => prev.filter((o) => o.storeId !== id));
  };

  const startEditStore = (id, field, value) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  /** ====== HÀNH ĐỘNG GRAB (KIỂM DUYỆT RÕ 2 LỰA CHỌN) ====== */
  // khi bấm "Kiểm duyệt" -> chuyển qua trạng thái verifying và hiển thị nút Accept/Reject
  const startReview = (id) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, status: "verifying", note: "Grab đang kiểm duyệt hồ sơ..." } : s)));
  };

  // Grab chấp nhận (approve)
  const acceptStore = (id) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "approved", note: "✅ Hồ sơ được chấp nhận. Bấm Kích hoạt để active." }
          : s
      )
    );
  };

  // Grab từ chối (reject)
  const rejectStore = (id) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "rejected", note: "❌ Hồ sơ bị từ chối. Yêu cầu bổ sung giấy tờ." }
          : s
      )
    );
  };

  // Sau khi approved, admin Grab kích hoạt thành active để nhận đơn
  const activateStore = (id) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, status: "active", note: "Đã kích hoạt. Bắt đầu nhận đơn." } : s)));
  };

  // Yêu cầu bổ sung giấy tờ -> trở lại pending
  const requestMoreDocs = (id) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, status: "pending", note: "Grab yêu cầu bổ sung giấy tờ." } : s)));
  };

  /** ====== ĐƠN HÀNG ====== */
  const generateOrder = (id) => {
    const store = stores.find((s) => s.id === id);
    if (!store || store.status !== "active") return;
    const order = makeFakeOrder(store);
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, revenue: (s.revenue || 0) + order.totalAmount } : s)));
    setOrders((prev) => [order, ...prev]);
  };

  /** ====== MÔ PHỎNG TỰ ĐỘNG NHẬN ĐƠN ====== */
  useEffect(() => {
    if (autoRunning) {
      autoRef.current = setInterval(() => {
        const active = stores.filter((s) => s.status === "active");
        if (active.length === 0) return;
        const chosen = active[randomInt(0, active.length - 1)];
        generateOrder(chosen.id);
      }, 3000 + randomInt(0, 3000));
    } else {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
    return () => {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    };
  }, [autoRunning, stores]);

  /** ====== UI ====== */
  return (
    <div className="stores-grab stores">
      <h1>🚀 Quản lý Merchant & Đơn hàng</h1>

      <section className="panel">
        <h2>📝 Đăng ký nhà hàng (Merchant submits)</h2>
        <div className="form-inline">
          <input placeholder="Tên cửa hàng" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
          <input placeholder="Địa chỉ" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
          <input placeholder="SĐT" value={newStore.phone} onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })} />
          <input placeholder="Giấy phép (mã/URL)" value={newStore.documents} onChange={(e) => setNewStore({ ...newStore, documents: e.target.value })} />
          <button onClick={registerStore}>📤 Gửi hồ sơ</button>
        </div>
      </section>

      <section className="panel">
        <h2>📊 Thống kê tổng quan </h2>
        <div className="stats-row">
          <div className="stat"><div className="stat-title">Tổng cửa hàng</div><div className="stat-value">{stores.length}</div></div>
          <div className="stat"><div className="stat-title">Tổng doanh thu (món)</div><div className="stat-value">{currency(totalRevenue)}</div></div>
          <div className="stat"><div className="stat-title">Grab thu ({COMMISSION_RATE * 100}%)</div><div className="stat-value">{currency(totalGrab)}</div></div>
          <div className="stat"><div className="stat-title">Nhà hàng nhận</div><div className="stat-value">{currency(totalRestaurant)}</div></div>
          <div className="stat">
            <div className="stat-title">Auto-order</div>
            <button onClick={() => setAutoRunning((p) => !p)}>{autoRunning ? "⏸️ Dừng" : "▶️ Bật"}</button>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>🏬 Danh sách cửa hàng </h2>
        <table className="stores-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th>Doanh thu</th>
              <th>Hành động (Grab)</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => {
              const grabShare = Math.floor((s.revenue || 0) * COMMISSION_RATE);
              const storeShare = Math.floor((s.revenue || 0) * (1 - COMMISSION_RATE));
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td><input value={s.name} onChange={(e) => startEditStore(s.id, "name", e.target.value)} /></td>
                  <td><input value={s.address} onChange={(e) => startEditStore(s.id, "address", e.target.value)} /></td>
                  <td><input value={s.phone} onChange={(e) => startEditStore(s.id, "phone", e.target.value)} /></td>
                  <td style={{ textAlign: "left", maxWidth: 240 }}>{s.note || "-"}</td>
                  <td>
                    {s.status === "pending" && <span>📤 pending</span>}
                    {s.status === "verifying" && <span>🔍 verifying</span>}
                    {s.status === "approved" && <span>✅ approved</span>}
                    {s.status === "active" && <span>🟢 active</span>}
                    {s.status === "rejected" && <span>❌ rejected</span>}
                  </td>
                  <td>
                    <div>{currency(s.revenue)}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>Store: {currency(storeShare)}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>Grab: {currency(grabShare)}</div>
                  </td>
                  <td>
                    {s.status === "pending" && (
                      <>
                        <button onClick={() => startReview(s.id)}>👀 Kiểm duyệt</button>
                      </>
                    )}

                    {s.status === "verifying" && (
                      <>
                        <button onClick={() => acceptStore(s.id)} style={{ background: "#28a745", color: "#fff" }}>✅ Chấp nhận</button>
                        <button onClick={() => rejectStore(s.id)} style={{ background: "#dc3545", color: "#fff" }}>❌ Từ chối</button>
                        <button onClick={() => requestMoreDocs(s.id)} style={{ background: "#f0ad4e", color: "#fff" }}>📑 Yêu cầu bổ sung</button>
                      </>
                    )}

                    {s.status === "approved" && (
                      <>
                        <button onClick={() => activateStore(s.id)}>🚀 Kích hoạt</button>
                        <button onClick={() => requestMoreDocs(s.id)}>📑 Yêu cầu bổ sung</button>
                      </>
                    )}

                    {s.status === "active" && (
                      <>
                        <button onClick={() => generateOrder(s.id)}>➕ Sinh đơn</button>
                      </>
                    )}

                    <button onClick={() => deleteStore(s.id)} style={{ background: "#ff6b6b", color: "#fff", marginLeft: 6 }}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>🧾 Danh sách đơn hàng </h2>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#666", fontSize: 13, marginRight: 12 }}>Tổng đơn: {orders.length}</span>
          <button onClick={() => { if (window.confirm("Xóa tất cả đơn hàng?")) setOrders([]); }}>Xóa tất cả đơn</button>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Store</th>
              <th>Tổng món</th>
              <th>Phí giao (khách trả)</th>
              <th>Created</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6}>Chưa có đơn hàng</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.storeName}</td>
                <td>{currency(o.totalAmount)}</td>
                <td>{currency(o.shipping)}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td><button onClick={() => { if (window.confirm("Xóa đơn này?")) setOrders((prev) => prev.filter(x => x.id !== o.id)); }}>Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Stores;
