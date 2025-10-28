import React, { useState, useEffect } from "react";
import "./StoreRevenue.css";

const StoreRevenue = ({ restaurantRevenue }) => {
  const [balance, setBalance] = useState(restaurantRevenue || 0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankInfo, setBankInfo] = useState({
    bankName: "Vietcombank",
    accountNumber: "0123456789",
    accountHolder: "Nguyen Van A",
  });
  const [toast, setToast] = useState("");
  const [withdrawHistory, setWithdrawHistory] = useState([]);

  useEffect(() => {
    setBalance(restaurantRevenue || 0);
  }, [restaurantRevenue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleWithdraw = (full = false) => {
    const amount = full ? balance : parseInt(withdrawAmount);
    if (!amount || amount <= 0) {
      setToast("⚠️ Nhập số tiền hợp lệ!");
      return;
    }
    if (amount > balance) {
      setToast("❌ Số dư không đủ!");
      return;
    }

    const request = {
      id: Date.now(),
      amount,
      bankInfo,
      status: "pending",
    };

    setWithdrawHistory([request, ...withdrawHistory]);
    setWithdrawAmount("");
    setToast("⏳ Yêu cầu rút tiền đang chờ xử lý...");

    // Mô phỏng xử lý server
    setTimeout(() => {
      // ✅ Giả sử luôn approve
      setBalance((prev) => prev - amount);
      setWithdrawHistory((prev) =>
        prev.map((w) => (w.id === request.id ? { ...w, status: "done" } : w))
      );
      setToast(`✅ Rút tiền ${amount.toLocaleString()} VNĐ thành công!`);
    }, 2000);
  };

  return (
    <div className="store-revenue">
      <h2>💰 Doanh thu & Rút tiền</h2>
      {toast && <div className="toast">{toast}</div>}

      <div className="revenue-box">
        <p>Số dư khả dụng:</p>
        <h3>{balance.toLocaleString()} VNĐ</h3>
      </div>

      <div className="form-group">
        <label>Số tiền muốn rút:</label>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Nhập số tiền"
        />
      </div>

      <div className="bank-info">
        <h4>🏦 Thông tin ngân hàng</h4>
        <input name="bankName" value={bankInfo.bankName} onChange={handleChange} placeholder="Tên ngân hàng" />
        <input name="accountNumber" value={bankInfo.accountNumber} onChange={handleChange} placeholder="Số tài khoản" />
        <input name="accountHolder" value={bankInfo.accountHolder} onChange={handleChange} placeholder="Chủ tài khoản" />
      </div>

      <div className="withdraw-buttons">
        <button className="withdraw-btn" onClick={() => handleWithdraw(false)}>
          💸 Rút số tiền nhập
        </button>
        <button className="withdraw-btn full" onClick={() => handleWithdraw(true)}>
          💰 Rút toàn bộ
        </button>
      </div>

      {withdrawHistory.length > 0 && (
        <div className="withdraw-history">
          <h3>📜 Lịch sử rút tiền</h3>
          <table>
            <thead>
              <tr>
                <th>Số tiền</th>
                <th>Ngân hàng</th>
                <th>Chủ tài khoản</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {withdrawHistory.map((w) => (
                <tr key={w.id}>
                  <td>{w.amount.toLocaleString()} VNĐ</td>
                  <td>{w.bankInfo.bankName}</td>
                  <td>{w.bankInfo.accountHolder}</td>
                  <td>{w.status === "pending" ? "⏳ Đang xử lý" : w.status === "done" ? "✅ Hoàn tất" : "❌ Bị từ chối"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreRevenue;
