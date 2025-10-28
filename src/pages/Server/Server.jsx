import React, { useState, useEffect } from "react";
import SidebarServer from "./SidebarServer";
import Dashboard from "./Dashboard";
import Stores from "./Stores";
import Orders from "./Orders";
import Drones from "./Drones";
import Users from "./Users"; // import component mới
import RevenuesServer from "./RevenuesServer";

// LocalStorage keys
const LS_STORES = "app_stores";
const LS_ORDERS = "app_orders";
const LS_DRONES = "app_drones";
const LS_USERS = "app_users"; // key cho user

// Default data
const defaultStores = [
  { id: 1, name: "Pizza House", revenue: 5000000, status: "active", ordersCount: 2 },
  { id: 2, name: "Sushi King", revenue: 3000000, status: "inactive", ordersCount: 1 },
  { id: 3, name: "Burger Zone", revenue: 2000000, status: "active", ordersCount: 1 },
];

const defaultOrders = [
  { id: 101, store: "Pizza House", user: "Alice", status: "done", drone: "" },
  { id: 102, store: "Sushi King", user: "Bob", status: "done", drone: "" },
  { id: 103, store: "Pizza House", user: "Charlie", status: "done", drone: "" },
  { id: 104, store: "Burger Zone", user: "David", status: "pending", drone: "" },
];

const defaultDrones = [
  { id: 1, name: "Drone 1", status: "ready" },
  { id: 2, name: "Drone 2", status: "delivering" },
];

const defaultUsers = [
  { id: 1, name: "Alice", email: "alice@gmail.com", role: "customer" },
  { id: 2, name: "Bob", email: "bob@gmail.com", role: "customer" },
];

const Server = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const [stores, setStores] = useState(() => {
    const stored = localStorage.getItem(LS_STORES);
    return stored ? JSON.parse(stored) : defaultStores;
  });

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem(LS_ORDERS);
    return stored ? JSON.parse(stored) : defaultOrders;
  });

  const [drones, setDrones] = useState(() => {
    const stored = localStorage.getItem(LS_DRONES);
    return stored ? JSON.parse(stored) : defaultDrones;
  });

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem(LS_USERS);
    return stored ? JSON.parse(stored) : defaultUsers;
  });

  // Lưu data vào LocalStorage
  useEffect(() => { localStorage.setItem(LS_STORES, JSON.stringify(stores)); }, [stores]);
  useEffect(() => { localStorage.setItem(LS_ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(LS_DRONES, JSON.stringify(drones)); }, [drones]);
  useEffect(() => { localStorage.setItem(LS_USERS, JSON.stringify(users)); }, [users]);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard stores={stores} orders={orders} drones={drones} />;
      case "stores":
        return <Stores stores={stores} setStores={setStores} />;
      case "orders":
        return <Orders orders={orders} setOrders={setOrders} drones={drones} setDrones={setDrones} />;
      case "drones":
        return <Drones drones={drones} setDrones={setDrones} />;
      case "users":
        return <Users users={users} setUsers={setUsers} />;
      case "revenues":
  return <RevenuesServer stores={stores} />;

      default:
        return <Dashboard stores={stores} orders={orders} drones={drones} />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarServer setView={setCurrentView} currentView={currentView} />
      <div style={{ flex: 1, padding: "20px" }}>
        {renderView()}
      </div>
    </div>
  );
};

export default Server;
