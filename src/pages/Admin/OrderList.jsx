import React, { useState, useEffect } from "react";
import { food_list } from "../../assets/assets";
import "./OrderList.css";

const OrderList = ({ orders }) => {
  const [orderFilter, setOrderFilter] = useState("all");
  const [sortedOrders, setSortedOrders] = useState([]);
  const [todaySummary, setTodaySummary] = useState({ total: 0, count: 0, items: {} });
  const [currentDate, setCurrentDate] = useState(new Date()); // ✅ Thời gian thực

  // 🕒 Cập nhật thời gian thực mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔄 Sắp xếp và tính toán lại khi có đơn mới hoặc thời gian đổi ngày
  useEffect(() => {
    const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedOrders(sorted);

    // Tính tổng cho "hôm nay"
    const today = currentDate.toLocaleDateString();
    let total = 0;
    let count = 0;
    const items = {};

    sorted.forEach((o) => {
      const orderDate = new Date(o.date).toLocaleDateString();
      if (orderDate === today) {
        total += o.totalAmount;
        count++;
        for (const [foodId, qty] of Object.entries(o.items)) {
          items[foodId] = (items[foodId] || 0) + qty;
        }
      }
    });
    setTodaySummary({ total, count, items });
  }, [orders, currentDate]); // ✅ Khi thời gian đổi hoặc đơn mới => cập nhật lại

  const filteredOrders = sortedOrders.filter((o) =>
    orderFilter === "all" ? true : o.status === orderFilter
  );

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 Danh sách đơn hàng</h2>

      {/* 🕒 Hiển thị thời gian thực */}
      <div className="live-time">
        <p>⏰ {currentDate.toLocaleString("vi-VN")}</p>
      </div>

      {/* 🧾 Tổng quan hôm nay */}
      <div className="today-summary">
        <div className="summary-card">
          <h3>📅 Hôm nay</h3>
          <p><strong>{todaySummary.count}</strong> đơn hàng</p>
          <p>💰 <strong>{todaySummary.total.toLocaleString("vi-VN")}</strong> ₫</p>
        </div>

        <div className="summary-card">
          <h3>🍽️ Món bán hôm nay</h3>
          {Object.keys(todaySummary.items).length === 0 ? (
            <p>Chưa có món nào</p>
          ) : (
            <ul>
              {Object.entries(todaySummary.items).map(([foodId, qty]) => {
                const foodInfo = food_list.find((f) => f._id === foodId);
                return (
                  <li key={foodId}>
                    {foodInfo?.name || foodId}: <strong>{qty}</strong> phần
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 🎛️ Bộ lọc trạng thái */}
      <div className="filter-buttons">
        {["all", "order", "processing", "delivery", "done"].map((status) => (
          <button
            key={status}
            className={orderFilter === status ? "active" : ""}
            onClick={() => setOrderFilter(status)}
          >
            {status === "all"
              ? "Tất cả"
              : status === "order"
              ? "Đang đặt"
              : status === "processing"
              ? "Đang xử lý"
              : status === "delivery"
              ? "Đang giao"
              : "Hoàn tất"}
          </button>
        ))}
      </div>

      {/* 📋 Danh sách đơn */}
      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <p className="no-order">❌ Không có đơn hàng</p>
        ) : (
          filteredOrders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="order-header">
                <h3>🧾 Mã đơn: {o.id}</h3>
                <span className={`status-badge ${o.status}`}>{o.status}</span>
              </div>

              <div className="order-info">
                <p><strong>👤 Người đặt:</strong> {o.email}</p>
                <p><strong>📅 Ngày đặt:</strong> {new Date(o.date).toLocaleString()}</p>
                <p><strong>💰 Tổng tiền:</strong> {o.totalAmount.toLocaleString("vi-VN")} ₫</p>
              </div>

              <div className="order-items">
                <p><strong>🍽️ Món ăn:</strong></p>
                <ul>
                  {Object.entries(o.items).map(([foodId, qty]) => {
                    const foodInfo = food_list.find((f) => f._id === foodId);
                    return (
                      <li key={foodId}>
                        {foodInfo?.name || foodId} — <span>{qty} phần</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;

