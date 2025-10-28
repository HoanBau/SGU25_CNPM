import React, { useState } from "react";
import "./RevenuesServer.css";

const COMMISSION_RATE = 0.2; // 20% phí dịch vụ
const currency = (v) =>
  new Intl.NumberFormat("vi-VN").format(Math.floor(v || 0)) + " ₫";

const sampleStores = [
  { id: 1, name: "Phở 24", revenue: 550000 },
  { id: 2, name: "Cơm Tấm 123", revenue: 340000 },
  { id: 3, name: "Bún Bò Huế O Loan", revenue: 720000 },
];

const RevenuesServer = () => {
  const [stores, setStores] = useState(sampleStores);
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  /** Tạo yêu cầu rút tiền */
  const requestWithdraw = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store || store.revenue === 0) return alert("Không có doanh thu để rút");
    const netAmount = Math.floor(store.revenue * (1 - COMMISSION_RATE));
    const req = {
      id: `WD-${Date.now()}`,
      storeId,
      storeName: store.name,
      grossAmount: store.revenue,
      netAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setWithdrawRequests([req, ...withdrawRequests]);
  };

  /** Duyệt yêu cầu rút tiền */
  const approveWithdraw = (id) => {
    setWithdrawRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", approvedAt: new Date().toISOString() }
          : r
      )
    );
    const req = withdrawRequests.find((r) => r.id === id);
    setStores((prev) =>
      prev.map((s) =>
        s.id === req.storeId ? { ...s, revenue: s.revenue - req.grossAmount } : s
      )
    );
  };

  /** Từ chối yêu cầu rút tiền */
  const rejectWithdraw = (id) => {
    setWithdrawRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "rejected", rejectedAt: new Date().toISOString() }
          : r
      )
    );
  };

  /** Chuyển tiền định kỳ cho tất cả store active */
  const processMonthlyPayout = () => {
    const newRequests = stores
      .filter((s) => s.revenue > 0)
      .map((s) => {
        const netAmount = Math.floor(s.revenue * (1 - COMMISSION_RATE));
        return {
          id: `WD-${Date.now()}-${s.id}`,
          storeId: s.id,
          storeName: s.name,
          grossAmount: s.revenue,
          netAmount,
          status: "approved",
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        };
      });
    setWithdrawRequests([...newRequests, ...withdrawRequests]);
    setStores((prev) => prev.map((s) => ({ ...s, revenue: 0 })));
    alert("Đã chuyển tiền định kỳ cho tất cả nhà hàng.");
  };

  return (
    <div className="revenues-server">
      <h1>💰 Quản lý doanh thu (Server)</h1>

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
              <th>Doanh thu</th>
              <th>Nhận về</th>
              <th>Trạng thái</th>
              <th>Thời gian tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {withdrawRequests.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Chưa có yêu cầu
                </td>
              </tr>
            )}
            {withdrawRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.storeName}</td>
                <td>{currency(r.grossAmount)}</td>
                <td>{currency(r.netAmount)}</td>
                <td>{r.status}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => approveWithdraw(r.id)}>✅ Duyệt</button>
                      <button onClick={() => rejectWithdraw(r.id)}>❌ Từ chối</button>
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
