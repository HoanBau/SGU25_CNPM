import React, { useMemo } from "react";
import "./Admin.css";
import Sidebar from "./Sidebar";
import RevenueChart from "./RevenueChart"; // ✅ import component biểu đồ

const Admin = ({ orders }) => {
  // ✅ Tính toán dữ liệu từ orders
  const stats = useMemo(() => {
    const totalOrders = orders.length;

    // Tính người dùng duy nhất
    const uniqueUsers = new Set(orders.map(o => o.email)).size;

    // Tính tổng doanh thu
    const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Tìm món ăn bán chạy
    const foodCount = {};
    orders.forEach(order => {
      if (order.items) {
        Object.entries(order.items).forEach(([foodId, qty]) => {
          foodCount[foodId] = (foodCount[foodId] || 0) + qty;
        });
      }
    });

    // Tên món bán chạy (hiển thị "Chưa có" nếu chưa có đơn)
    const topFood = Object.keys(foodCount).length
      ? Object.entries(foodCount).sort((a, b) => b[1] - a[1])[0][0]
      : "Chưa có";

    return { totalOrders, uniqueUsers, revenue, topFood };
  }, [orders]);

  return (
    <div className="admin-container">
      <Sidebar />

      <div className="admin-main">
        <h1>📊 Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h2>{stats.totalOrders}</h2>
            <p>Tổng đơn hàng</p>
          </div>
          <div className="stat-card">
            <h2>{stats.uniqueUsers}</h2>
            <p>Người dùng</p>
          </div>
          <div className="stat-card">
            <h2>{stats.revenue.toLocaleString("vi-VN")} ₫</h2>
            <p>Doanh thu</p>
          </div>
          <div className="stat-card">
            <h2>{stats.topFood}</h2>
            <p>Món ăn bán chạy</p>
          </div>
        </div>

        {/* ✅ Thêm biểu đồ doanh thu */}
        <div className="admin-chart">
          <RevenueChart orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
