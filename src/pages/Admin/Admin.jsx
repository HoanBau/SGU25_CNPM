import React, { useMemo, useState, useEffect } from "react";
import "./Admin.css";
import Sidebar from "./Sidebar";
import RevenueChart from "./RevenueChart";
import OrderList from "./OrderList";
import DroneMap from "./DroneMap";
import ManageFood from "./ManageFood";
import StoreSetting from "./StoreSetting";
import StoreRevenue from "./StoreRevenue"; 
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
  const [showRevenueDetails, setShowRevenueDetails] = useState(false);

  const COMMISSION_RATE = 0.3; // 💸 Chiết khấu 30% cho Grab

  // --- Gom dữ liệu tổng quan & món ăn ---
  const { totalOrders, uniqueUsers, revenue, grabCommission, restaurantRevenue, foodCount } =
    useMemo(() => {
      const totalOrders = orders.length;
      const uniqueUsers = new Set(orders.map((o) => o.email)).size;
      const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const grabCommission = revenue * COMMISSION_RATE;
      const restaurantRevenue = revenue - grabCommission;

      const foodCount = {};
      orders.forEach((order) => {
        // ✅ Sửa: kiểm tra order.items tồn tại và là object
        if (order.items && typeof order.items === "object" && !Array.isArray(order.items)) {
          Object.entries(order.items).forEach(([foodId, qty]) => {
            if (!foodCount[foodId]) foodCount[foodId] = 0;
            foodCount[foodId] += Number(qty) || 0; // đảm bảo là số
          });
        }
      });

      return { totalOrders, uniqueUsers, revenue, grabCommission, restaurantRevenue, foodCount };
    }, [orders]);

  // ✅ Tổng tất cả món ăn đã bán (không theo ngày)
  const totalFoodsSold = useMemo(() => {
    return Object.values(foodCount).reduce((sum, qty) => sum + qty, 0);
  }, [foodCount]);

  // ✅ Danh sách chi tiết món ăn đã bán (tổng cộng từ trước đến nay)
  const allSoldFoods = useMemo(() => {
    return Object.entries(foodCount)
      .map(([foodId, qty]) => {
        const foodInfo = food_list.find((f) => f._id === foodId);
        return {
          id: foodId,
          name: foodInfo?.name || `Món #${foodId}`,
          qty,
        };
      })
      .filter((f) => f.qty > 0)
      .sort((a, b) => b.qty - a.qty);
  }, [foodCount]);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar setView={setCurrentView} currentView={currentView} />

      <div className="admin-main">
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
              <div
                className="stat-card clickable"
                onClick={() => setShowRevenueDetails(!showRevenueDetails)}
              >
                <h2>{revenue.toLocaleString("vi-VN")} ₫</h2>
                <p>Doanh thu (click để xem chi tiết)</p>
              </div>
              <div
                className="stat-card clickable"
                onClick={() => setShowFoodStats(!showFoodStats)}
              >
                <h2>{totalFoodsSold}</h2>
                <p>Tổng món bán được</p>
              </div>
            </div>

            {/* 💰 Chi tiết doanh thu */}
            {showRevenueDetails && (
              <div className="revenue-details">
                <h2>💸 Chi tiết doanh thu & chiết khấu</h2>
                <table className="revenue-table">
                  <tbody>
                    <tr>
                      <td><b>Tổng doanh thu (Khách thanh toán):</b></td>
                      <td>{revenue.toLocaleString("vi-VN")} ₫</td>
                    </tr>
                    <tr>
                      <td><b>Chiết khấu Grab (30%):</b></td>
                      <td>{grabCommission.toLocaleString("vi-VN")} ₫</td>
                    </tr>
                    <tr>
                      <td><b>Doanh thu Nhà hàng nhận:</b></td>
                      <td>{restaurantRevenue.toLocaleString("vi-VN")} ₫</td>
                    </tr>
                  </tbody>
                </table>

                <h3>📄 Bảng chi tiết từng đơn</h3>
                <table className="revenue-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Tổng tiền</th>
                      <th>Chiết khấu Grab</th>
                      <th>Nhà hàng nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="4">Chưa có đơn hàng nào</td>
                      </tr>
                    ) : (
                      orders.map((o, i) => (
                        <tr key={o.id || i}>
                          <td>{o.id || `#${i + 1}`}</td>
                          <td>{(o.totalAmount || 0).toLocaleString("vi-VN")} ₫</td>
                          <td>{((o.totalAmount || 0) * COMMISSION_RATE).toLocaleString("vi-VN")} ₫</td>
                          <td>{((o.totalAmount || 0) * (1 - COMMISSION_RATE)).toLocaleString("vi-VN")} ₫</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 🍲 Chi tiết món bán được */}
            {showFoodStats && (
              <div className="top-foods">
                <h2>🍲 Chi tiết món bán được (Tổng từ trước đến nay)</h2>
                <table className="food-table">
                  <thead>
                    <tr>
                      <th>Món ăn</th>
                      <th>Số phần đã bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSoldFoods.length === 0 ? (
                      <tr>
                        <td colSpan={2}>Chưa có món nào được bán</td>
                      </tr>
                    ) : (
                      allSoldFoods.map((f) => (
                        <tr key={f.id}>
                          <td>{f.name}</td>
                          <td>{f.qty}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 📈 Biểu đồ doanh thu */}
            {!showFoodStats && !showRevenueDetails && (
              <div className="admin-chart">
                <RevenueChart orders={orders} />
              </div>
            )}
          </>
        )}

        {/* ✅ Các phần khác */}
        {currentView === "orders" && <OrderList orders={orders} setOrders={setOrders} />}
        {currentView === "manageFood" && <ManageFood />}
        {currentView === "drone" && <DroneMap />}
        {currentView === "settings" && <StoreSetting />}
        {currentView === "earnings" && <StoreRevenue restaurantRevenue={restaurantRevenue} />}

      </div>
    </div>
  );
};

export default Admin;
