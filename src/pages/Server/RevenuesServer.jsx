import React, { useState, useEffect } from "react";
import "./RevenuesServer.css";

const COMMISSION_RATE = 0.2; // 20% phí dịch vụ
const LS_STORES = "app_stores";
const LS_WITHDRAW = "server_withdraws";

const currency = (v) =>
  new Intl.NumberFormat("vi-VN").format(Math.floor(v || 0)) + " ₫";

const RevenuesServer = () => {
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem(LS_STORES);
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawRequests, setWithdrawRequests] = useState(() => {
    const saved = localStorage.getItem(LS_WITHDRAW);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LS_WITHDRAW, JSON.stringify(withdrawRequests));
  }, [withdrawRequests]);

  useEffect(() => {
    const syncStores = () => {
      const data = localStorage.getItem(LS_STORES);
      if (data) setStores(JSON.parse(data));
    };
    window.addEventListener("storage", syncStores);
    return () => window.removeEventListener("storage", syncStores);
  }, []);

  const requestWithdraw = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store || store.revenue === 0)
      return alert("Không có doanh thu để rút!");
    const commission = Math.floor(store.revenue * COMMISSION_RATE);
    const netAmount = Math.floor(store.revenue - commission);
    const req = {
      id: `WD-${Date.now()}-${storeId}`,
      storeId,
      storeName: store.name,
      grossAmount: store.revenue,
      commission,
      netAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setWithdrawRequests((prev) => [req, ...prev]);
  };

  const approveWithdraw = (id) => {
    const req = withdrawRequests.find((r) => r.id === id);
    if (!req) return;

    setWithdrawRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", approvedAt: new Date().toISOString() }
          : r
      )
    );

    const updatedStores = stores.map((s) =>
      s.id === req.storeId
        ? { ...s, revenue: Math.max(0, s.revenue - req.grossAmount) }
        : s
    );
    setStores(updatedStores);
    localStorage.setItem(LS_STORES, JSON.stringify(updatedStores));
    window.dispatchEvent(new Event("storage"));
  };

  const rejectWithdraw = (id) => {
    setWithdrawRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "rejected", rejectedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const processMonthlyPayout = () => {
    const newRequests = stores
      .filter((s) => s.revenue > 0)
      .map((s) => {
        const commission = Math.floor(s.revenue * COMMISSION_RATE);
        const netAmount = s.revenue - commission;
        return {
          id: `WD-${Date.now()}-${s.id}`,
          storeId: s.id,
          storeName: s.name,
          grossAmount: s.revenue,
          commission,
          netAmount,
          status: "approved",
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        };
      });

    if (newRequests.length === 0)
      return alert("Không có cửa hàng nào có doanh thu để chuyển.");

    setWithdrawRequests((prev) => [...newRequests, ...prev]);
    const updatedStores = stores.map((s) => ({ ...s, revenue: 0 }));
    setStores(updatedStores);
    localStorage.setItem(LS_STORES, JSON.stringify(updatedStores));
    window.dispatchEvent(new Event("storage"));
    alert("✅ Đã chuyển tiền định kỳ cho tất cả nhà hàng.");
  };

  return (
    <div className="revenues-server">
      <h1>💰 Quản lý doanh thu</h1>

      <button className="monthly-payout" onClick={processMonthlyPayout}>
        🗓️ Chuyển tiền định kỳ (hàng tháng)
      </button>

      <section>
        <h2>🏪 Danh sách cửa hàng</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Doanh thu hiện có</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Chưa có cửa hàng nào
                </td>
              </tr>
            )}
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{currency(s.revenue)}</td>
                <td>
                  <button onClick={() => requestWithdraw(s.id)}>
                    📤 Yêu cầu rút tiền
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>📝 Yêu cầu rút tiền</h2>
        <table>
          <thead>
            <tr>
              <th>Mã yêu cầu</th>
              <th>Store</th>
              <th>Tổng doanh thu</th>
              <th>Chiết khấu (20%)</th>
              <th>Nhận về (sau chiết khấu)</th>
              <th>Trạng thái</th>
              <th>Thời gian tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequests.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  Chưa có yêu cầu nào
                </td>
              </tr>
            )}
            {withdrawRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.storeName}</td>
                <td>{currency(r.grossAmount)}</td>
                <td>{currency(r.commission)}</td>
                <td>
                  <strong style={{ color: "green" }}>
                    {currency(r.netAmount)}
                  </strong>
                </td>
                <td>{r.status}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => approveWithdraw(r.id)}>
                        ✅ Duyệt
                      </button>
                      <button onClick={() => rejectWithdraw(r.id)}>
                        ❌ Từ chối
                      </button>
                    </>
                  )}
                  {r.status === "approved" && <span>💸 Đã chuyển</span>}
                  {r.status === "rejected" && <span>❌ Bị từ chối</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default RevenuesServer;
