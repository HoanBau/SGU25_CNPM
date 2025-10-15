import React, { useMemo, useState, useEffect } from "react";
import "./Admin.css";
import Sidebar from "./Sidebar";
import RevenueChart from "./RevenueChart";
import OrderList from "./OrderList";
import DroneMap from "./DroneMap";
import ManageFood from "./ManageFood";
import { food_list } from "../../assets/assets";

const Admin = () => {
  // ✅ Lưu danh sách đơn hàng vào localStorage (để không mất khi reload)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Tự động lưu lại mỗi khi có thay đổi đơn hàng
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const [currentView, setCurrentView] = useState("dashboard");
  const [showFoodStats, setShowFoodStats] = useState(false);
  const [filter, setFilter] = useState("day");
  const [selectedDate, setSelectedDate] = useState("");

  // --- Gom dữ liệu tổng quan & món ăn ---
  const { totalOrders, uniqueUsers, revenue, foodCount, availableDates } = useMemo(() => {
    const totalOrders = orders.length;
    const uniqueUsers = new Set(orders.map((o) => o.email)).size;
    const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const foodCount = {};
    const availableDatesSet = new Set();

    orders.forEach((order) => {
      if (order.items) {
        const date = new Date(order.date || Date.now());
        const dayKey = date.toISOString().split("T")[0];
        availableDatesSet.add(dayKey);

        Object.entries(order.items).forEach(([foodId, qty]) => {
          if (!foodCount[foodId])
            foodCount[foodId] = { total: 0, daily: {}, monthly: {}, yearly: {} };
          foodCount[foodId].total += qty;

          const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
          const yearKey = `${date.getFullYear()}`;
          foodCount[foodId].daily[dayKey] = (foodCount[foodId].daily[dayKey] || 0) + qty;
          foodCount[foodId].monthly[monthKey] =
            (foodCount[foodId].monthly[monthKey] || 0) + qty;
          foodCount[foodId].yearly[yearKey] =
            (foodCount[foodId].yearly[yearKey] || 0) + qty;
        });
      }
    });

    const availableDates = Array.from(availableDatesSet).sort(
      (a, b) => new Date(b) - new Date(a)
    );
    return { totalOrders, uniqueUsers, revenue, foodCount, availableDates };
  }, [orders]);

  useMemo(() => {
    if (filter === "day" && !selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, [filter, selectedDate, availableDates]);

  const totalFoodsSold = useMemo(() => {
  // ✅ Luôn tính tổng tất cả món ăn đã bán (bỏ qua filter)
  return Object.values(foodCount).reduce((sum, stats) => sum + stats.total, 0);
}, [foodCount]);

  const filteredFoods = useMemo(() => {
    const today = new Date();
    return Object.entries(foodCount)
      .map(([foodId, stats]) => {
        const foodInfo = food_list.find((f) => f._id === foodId);
        let qty = 0;
        if (filter === "day" && selectedDate) qty = stats.daily[selectedDate] || 0;
        else if (filter === "month")
          qty = stats.monthly[`${today.getMonth() + 1}/${today.getFullYear()}`] || 0;
        else if (filter === "year")
          qty = stats.yearly[`${today.getFullYear()}`] || 0;
        else qty = stats.total;
        return { id: foodId, name: foodInfo?.name || foodId, qty };
      })
      .filter((f) => f.qty > 0)
      .sort((a, b) => b.qty - a.qty);
  }, [foodCount, filter, selectedDate]);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar setView={setCurrentView} currentView={currentView} />

      <div className="admin-main">
        {/* Dashboard */}
        {currentView === "dashboard" && (
          <>
            <h1>📊 Admin Dashboard</h1>
            <div className="admin-stats">
              <div className="stat-card">
                <h2>{totalOrders}</h2>
                <p>Tổng đơn hàng</p>
              </div>
              <div className="stat-card">
                <h2>{uniqueUsers}</h2>
                <p>Người dùng</p>
              </div>
              <div className="stat-card">
                <h2>{revenue.toLocaleString("vi-VN")} ₫</h2>
                <p>Doanh thu</p>
              </div>
              <div
                className="stat-card clickable"
                onClick={() => setShowFoodStats(!showFoodStats)}
              >
                <h2>{totalFoodsSold}</h2>
                <p>Tổng món bán được </p>
              </div>
            </div>

            {showFoodStats ? (
              <div className="top-foods">
                <h2>🍲 Chi tiết món bán được</h2>
                <table className="food-table">
      <thead>
        <tr>
          <th>Món ăn</th>
          <th>Số phần bán được</th>
        </tr>
      </thead>
      <tbody>
        {filteredFoods.length === 0 ? (
          <tr>
            <td colSpan={2}>Chưa có món nào</td>
          </tr>
        ) : (
          filteredFoods.map((f) => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{f.qty}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
              </div>
            ) : (
              <div className="admin-chart">
                <RevenueChart orders={orders} />
              </div>
            )}
          </>
        )}

        {/* ✅ OrderList có cả setOrders */}
        {currentView === "orders" && <OrderList orders={orders} setOrders={setOrders} />}

        {currentView === "manageFood" && <ManageFood />}


        {/* ✅ DroneMap */}
        {currentView === "drone" && <DroneMap />}
      </div>
    </div>
  );
};

export default Admin;
