import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// LocalStorage key
const ORDERS_KEY = "orders_data";
const DRONES_KEY = "drones_data";

// Vị trí cửa hàng và khách hàng
const storeLocations = {
  "Pizza House": [10.7769, 106.7009],
  "Sushi King": [10.7800, 106.7020],
  "Burger Zone": [10.7790, 106.7010],
};
const userLocations = {
  "Alice": [10.7780, 106.7050],
  "Bob": [10.7810, 106.7040],
  "Charlie": [10.7770, 106.7060],
  "Dave": [10.7820, 106.7030],
};

// Lấy dữ liệu từ LocalStorage
const getOrdersFromStorage = () => {
  const data = localStorage.getItem(ORDERS_KEY);
  return data
    ? JSON.parse(data)
    : [
        { id: 101, store: "Pizza House", user: "Alice", status: "pending", drone: "", dronePos: null },
        { id: 102, store: "Sushi King", user: "Bob", status: "pending", drone: "", dronePos: null },
        { id: 103, store: "Burger Zone", user: "Charlie", status: "pending", drone: "", dronePos: null },
        { id: 104, store: "Pizza House", user: "Dave", status: "pending", drone: "", dronePos: null },
      ];
};
const getDronesFromStorage = () => {
  const data = localStorage.getItem(DRONES_KEY);
  return data
    ? JSON.parse(data)
    : [
        { name: "Drone 1", status: "ready" },
        { name: "Drone 2", status: "ready" },
        { name: "Drone 3", status: "ready" },
        { name: "Drone 4", status: "ready" },
      ];
};

// Dịch trạng thái
const translateOrderStatus = (status) => {
  switch (status) {
    case "pending": return "🕓 Đang chờ";
    case "delivering": return "🚁 Đang giao";
    case "done": return "✅ Hoàn thành";
    default: return status;
  }
};
const translateDroneStatus = (status) => {
  switch (status) {
    case "ready": return "Sẵn sàng";
    case "delivering": return "Đang giao";
    case "maintenance": return "Bảo trì";
    default: return status;
  }
};

// Icon
const droneIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/414/414927.png",
  iconSize: [40, 40],
});
const storeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  iconSize: [30, 30],
});

const Orders = () => {
  const [orders, setOrders] = useState(getOrdersFromStorage());
  const [drones, setDrones] = useState(getDronesFromStorage());

  useEffect(() => { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(DRONES_KEY, JSON.stringify(drones)); }, [drones]);

  const startDelivery = (orderId, droneName) => {
    const order = orders.find(o => o.id === orderId);
    if (!droneName) return alert("🚨 Chọn drone trước khi giao hàng!");

    const start = storeLocations[order.store];
    const end = userLocations[order.user];
    let step = 0;
    const steps = 100;

    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "delivering", drone: droneName, dronePos: start } : o));
    setDrones(drones.map(d => d.name === droneName ? { ...d, status: "delivering" } : d));

    const interval = setInterval(() => {
      step++;
      const lat = start[0] + ((end[0] - start[0]) * step / steps);
      const lng = start[1] + ((end[1] - start[1]) * step / steps);
      setOrders(o => o.map(or => or.id === orderId ? { ...or, dronePos: [lat, lng] } : or));

      if (step >= steps) {
        clearInterval(interval);
        alert(`✅ ${droneName} đã giao hàng thành công cho ${order.user}!`);

        // Drone quay về
        let backStep = 0;
        const backInterval = setInterval(() => {
          backStep++;
          const latBack = end[0] + ((start[0] - end[0]) * backStep / steps);
          const lngBack = end[1] + ((start[1] - end[1]) * backStep / steps);
          setOrders(o => o.map(or => or.id === orderId ? { ...or, dronePos: [latBack, lngBack] } : or));
          if (backStep >= steps) {
            clearInterval(backInterval);
            setOrders(o => o.map(or => or.id === orderId ? { ...or, status: "done", dronePos: null } : or));
            setDrones(d => d.map(dr => dr.name === droneName ? { ...dr, status: "ready" } : dr));
          }
        }, 50);
      }
    }, 50);
  };

  const resetOrders = () => {
    const reset = orders.map(o => ({ ...o, status: "pending", drone: "", dronePos: null }));
    setOrders(reset);
    setDrones(d => d.map(dr => ({ ...dr, status: "ready" })));
    alert("🔄 Đã khởi tạo lại tất cả đơn hàng và drone!");
  };

  return (
    <div className="orders-container">
      <h1>📦 Quản lý đơn hàng Drone</h1>
      <button className="reset-btn" onClick={resetOrders}>🔁 Khởi tạo lại</button>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cửa hàng</th>
            <th>Khách hàng</th>
            <th>Trạng thái</th>
            <th>Drone</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.store}</td>
              <td>{order.user}</td>
              <td className={`status ${order.status}`}>{translateOrderStatus(order.status)}</td>
              <td>{order.drone}</td>
              <td>
                {order.status !== "done" && (
                  <>
                    <select
                      value={order.drone}
                      onChange={e =>
                        setOrders(o =>
                          o.map(or => or.id === order.id ? { ...or, drone: e.target.value } : or)
                        )
                      }
                    >
                      <option value="">Chọn drone</option>
                      {drones.filter(d => d.status === "ready" || d.name === order.drone).map(d => (
                        <option key={d.name} value={d.name}>{d.name} ({translateDroneStatus(d.status)})</option>
                      ))}
                    </select>
                    <button className="start-btn" onClick={() => startDelivery(order.id, order.drone)}>
                      🚀 Giao hàng
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="map-wrapper">
        <MapContainer className="map-container" center={[10.779, 106.702]} zoom={16}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Object.entries(storeLocations).map(([name, pos]) => <Marker key={name} position={pos} icon={storeIcon} />)}
          {Object.entries(userLocations).map(([name, pos]) => <Marker key={name} position={pos} icon={userIcon} />)}
          {orders.map(o => o.dronePos && (
            <Marker key={o.id} position={o.dronePos} icon={droneIcon}>
              <Popup>{o.drone} đang giao cho {o.user}</Popup>
            </Marker>
          ))}
          {orders.map(o => o.dronePos && (
            <Polyline key={o.id} positions={[storeLocations[o.store], userLocations[o.user]]} color="blue" />
          ))}
        </MapContainer>
      </div>

      <style>{`
        .orders-container {
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
          background: #f9fafb;
          min-height: 100vh;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #2d3748;
        }
        .reset-btn {
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          display: block;
          margin: 0 auto 20px;
          transition: 0.3s;
        }
        .reset-btn:hover { background: #c53030; }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 10px 50px;
          text-align: center;
        }
        th {
          background-color: #edf2f7;
          color: #2d3748;
        }
        td select {
          padding: 5px;
          border-radius: 5px;
        }
        .start-btn {
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 6px 10px;
          margin-left: 5px;
          cursor: pointer;
          transition: 0.3s;
        }
        .start-btn:hover { background: #2b6cb0; }

        .status.pending { color: #d69e2e; font-weight: bold; }
        .status.delivering { color: #3182ce; font-weight: bold; }
        .status.done { color: #38a169; font-weight: bold; }

        .map-wrapper {
          margin-top: 20px;
        }
        .map-container {
          height: 420px;
          width: 100%;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          th, td { font-size: 14px; padding: 8px; }
          .start-btn, .reset-btn { font-size: 14px; padding: 6px 10px; }
          .map-container { height: 300px; }
        }
      `}</style>
    </div>
  );
};

export default Orders;
