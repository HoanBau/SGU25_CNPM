import React, { useState, useEffect } from "react";
import { food_list } from "../../assets/assets";
import "./OrderList.css";

const flow = ["order", "processing", "done"]; // 3 bước quy trình

const OrderList = ({ orders, setOrders }) => {
  const [filterStatus, setFilterStatus] = useState("all"); // trạng thái lọc
  const [sortedOrders, setSortedOrders] = useState([]);
  const [todaySummary, setTodaySummary] = useState({ total: 0, count: 0, items: {} });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [orderSteps, setOrderSteps] = useState({}); // lưu step hiện tại của từng đơn

  // Cập nhật thời gian
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sắp xếp đơn + tổng hôm nay
  useEffect(() => {
    const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedOrders(sorted);

    const today = currentDate.toLocaleDateString();
    let total = 0, count = 0;
    const items = {};

    sorted.forEach(o => {
      if (new Date(o.date).toLocaleDateString() === today) {
        total += o.totalAmount;
        count++;
        Object.entries(o.items).forEach(([foodId, qty]) => {
          items[foodId] = (items[foodId] || 0) + qty;
        });
      }
    });

    setTodaySummary({ total, count, items });
  }, [orders, currentDate]);

  // Khởi tạo step cho từng đơn
  useEffect(() => {
    const steps = {};
    orders.forEach(o => {
      const index = flow.indexOf(o.status) !== -1 ? flow.indexOf(o.status) : 0;
      steps[o.id] = index;
    });
    setOrderSteps(steps);
  }, [orders]);

  // Bấm step – một chiều + cập nhật order
  const handleStepClick = (orderId, stepIndex) => {
    const currentStep = orderSteps[orderId] ?? 0;
    if (stepIndex < currentStep) return;

    // Cập nhật step
    setOrderSteps(prev => ({ ...prev, [orderId]: stepIndex }));

    // Cập nhật trạng thái trong orders
    const newStatus = flow[stepIndex];
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // Lọc đơn hàng dựa vào step hiện tại
  const filteredOrders = sortedOrders.filter(o => {
    const currentStepIndex = orderSteps[o.id] ?? 0;
    const currentStepStatus = flow[currentStepIndex];
    return filterStatus === "all" ? true : currentStepStatus === filterStatus;
  });

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 Danh sách đơn hàng</h2>
      <div className="live-time">⏰ {currentDate.toLocaleString("vi-VN")}</div>

      {/* Tổng quan hôm nay */}
      <div className="today-summary">
        <div className="summary-card">
          <h3>📅 Hôm nay</h3>
          <p><strong>{todaySummary.count}</strong> đơn hàng</p>
          <p>💰 <strong>{todaySummary.total.toLocaleString("vi-VN")}</strong> ₫</p>
        </div>
        <div className="summary-card">
          <h3>🍽️ Món bán hôm nay</h3>
          {Object.keys(todaySummary.items).length === 0 ? <p>Chưa có món nào</p> :
            <ul>{Object.entries(todaySummary.items).map(([foodId, qty]) => {
              const foodInfo = food_list.find(f => f._id === foodId);
              return <li key={foodId}>{foodInfo?.name || foodId}: <strong>{qty}</strong> phần</li>;
            })}</ul>}
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="filter-buttons">
        {["all", ...flow].map(status => (
          <button
            key={status}
            className={filterStatus === status ? "active" : ""}
            onClick={() => setFilterStatus(status)}
          >
            {status === "all" ? "Tất cả" :
             status === "order" ? "Đã nhận" :
             status === "processing" ? "Đang xử lý" : "Đã xong"}
          </button>
        ))}
      </div>

      {/* Danh sách đơn */}
      <div className="order-list">
        {filteredOrders.length === 0 ? <p className="no-order">❌ Không có đơn hàng</p> :
          filteredOrders.map(o => (
            <div key={o.id} className="order-card">
              <div className="order-header">
                <h3>🧾 Mã đơn: {o.id}</h3>
              </div>
              <div className="order-info">
                <p><strong>👤 Người đặt:</strong> {o.email}</p>
                <p><strong>📅 Ngày đặt:</strong> {new Date(o.date).toLocaleString()}</p>
                <p><strong>💰 Tổng tiền:</strong> {o.totalAmount.toLocaleString("vi-VN")} ₫</p>
              </div>
              <div className="order-items">
                <p><strong>🍽️ Món ăn:</strong></p>
                <ul>{Object.entries(o.items).map(([foodId, qty]) => {
                  const foodInfo = food_list.find(f => f._id === foodId);
                  return <li key={foodId}>{foodInfo?.name || foodId} — <span>{qty} phần</span></li>;
                })}</ul>
              </div>

              {/* Quy trình một chiều */}
              <div className="order-status-controls">
                <p><strong>Quy trình:</strong></p>
                <div className="status-buttons">
                  {flow.map((st, i) => {
                    const currentStep = orderSteps[o.id] ?? 0;
                    let btnClass = i < currentStep ? "completed" :
                                   i === currentStep ? "active" : "upcoming";
                    return (
                      <button
                        key={st}
                        className={`status-btn ${btnClass}`}
                        onClick={() => handleStepClick(o.id, i)}
                      >
                        {st === "order" ? "Đã nhận" :
                         st === "processing" ? "Đang xử lý" : "Đã xong"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default OrderList;
