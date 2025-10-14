import React from "react";
import "./Dashboard.css";

// Chuyển trạng thái cửa hàng
const translateStoreStatus = (status) => (status === "active" ? "Hoạt động" : "Ngừng hoạt động");

// Chuyển trạng thái drone
const translateDroneStatus = (status) => {
  switch (status) {
    case "ready":
      return "Sẵn sàng";
    case "delivering":
      return "Đang giao";
    case "maintenance":
      return "Bảo trì";
    default:
      return status;
  }
};

// Format VNĐ
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const Dashboard = ({ stores, drones, orders }) => {
  // Lấy 5 cửa hàng gần đây
  const topStores = stores.slice(0, 5);

  // Tính tổng đơn hàng đã bán cho từng cửa hàng
  const getOrderCount = (storeName) => {
    return orders.filter((o) => o.store === storeName && o.status === "done").length;
  };

  return (
    <div className="dashboard">
      <h1>📊 Server Dashboard</h1>

      {/* Thống kê nhanh */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>🏪 Tổng cửa hàng</h3>
          <p className="card-value">{stores.length}</p>
        </div>
        <div className="card">
          <h3>🚁 Tổng drone</h3>
          <p className="card-value">{drones.length}</p>
        </div>
        <div className="card">
          <h3>💰 Tổng doanh thu</h3>
          <p className="card-value">{formatCurrency(stores.reduce((a, b) => a + b.revenue, 0))}</p>
        </div>
        <div className="card">
          <h3>📝 Tổng đơn hàng</h3>
          <p className="card-value">{orders.length}</p>
        </div>
      </div>

      {/* Danh sách 5 cửa hàng */}
      <div className="dashboard-table">
        <h2>5 cửa hàng gần đây</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên cửa hàng</th>
              <th>Doanh thu</th>
              <th>Tổng đơn hàng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {topStores.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.name}</td>
                <td>{formatCurrency(store.revenue)}</td>
                <td>{getOrderCount(store.name)}</td>
                <td>{translateStoreStatus(store.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
