import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Drones.css";

const DRONES_KEY = "drones_data";
const ORDERS_KEY = "orders_data";
const STORES_KEY = "app_stores";

// Dữ liệu mặc định
const defaultDrones = [
  { id: 1, name: "Drone 1", status: "ready", eta: null, battery: 100, deliveriesLeft: 5 },
  { id: 2, name: "Drone 2", status: "ready", eta: null, battery: 100, deliveriesLeft: 5 },
  { id: 3, name: "Drone 3", status: "ready", eta: null, battery: 100, deliveriesLeft: 5 },
];

const defaultOrders = [
  { id: 101, store: "Pizza House", user: "Alice", status: "pending", drone: "", dronePos: null, distance: null },
  { id: 102, store: "Sushi King", user: "Bob", status: "pending", drone: "", dronePos: null, distance: null },
  { id: 103, store: "Burger Zone", user: "Charlie", status: "pending", drone: "", dronePos: null, distance: null },
  { id: 104, store: "Pizza House", user: "Dave", status: "pending", drone: "", dronePos: null, distance: null },
];

// Tính khoảng cách theo lat/lng (km)
const calcDistance = (a, b) => {
  if (!a || !b) return 0;
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
};

// Load vị trí cửa hàng
const loadStoreLocations = () => {
  const stored = JSON.parse(localStorage.getItem(STORES_KEY)) || [];
  if (stored.length === 0) {
    return {
      "Pizza House": [10.7769, 106.7009],
      "Sushi King": [10.7800, 106.7020],
      "Burger Zone": [10.7790, 106.7010],
    };
  }
  const locs = {};
  stored.forEach((s, i) => {
    locs[s.name || `Store ${i + 1}`] =
      s.location && Array.isArray(s.location)
        ? s.location
        : [10.77 + Math.random() * 0.02, 106.69 + Math.random() * 0.02];
  });
  return locs;
};

const storeLocations = loadStoreLocations();
const userLocations = {
  Alice: [10.7780, 106.7050],
  Bob: [10.7810, 106.7040],
  Charlie: [10.7770, 106.7060],
  Dave: [10.7820, 106.7030],
};

const droneIcon = L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/414/414927.png", iconSize: [40, 40] });
const storeIcon = L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [30, 30] });
const userIcon = L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png", iconSize: [30, 30] });

const translateDroneStatus = (status) => {
  switch (status) {
    case "ready": return "Sẵn sàng";
    case "delivering": return "Đang giao";
    case "maintenance": return "Bảo trì";
    case "low_battery": return "Pin yếu";
    default: return status;
  }
};

const translateOrderStatus = (status) => {
  switch (status) {
    case "pending": return "🕓 Chờ giao";
    case "delivering": return "🚁 Đang giao";
    case "done": return "✅ Hoàn thành";
    default: return status;
  }
};

const DroneOrders = () => {
  const [drones, setDrones] = useState(JSON.parse(localStorage.getItem(DRONES_KEY)) || defaultDrones);
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem(ORDERS_KEY)) || defaultOrders);
  const [newDroneName, setNewDroneName] = useState("");

  useEffect(() => { localStorage.setItem(DRONES_KEY, JSON.stringify(drones)); }, [drones]);
  useEffect(() => { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }, [orders]);

  const addDrone = () => {
    if (!newDroneName) return;
    setDrones([...drones, { id: Date.now(), name: newDroneName, status: "ready", eta: null, battery: 100, deliveriesLeft: 5 }]);
    setNewDroneName("");
  };

  const changeDroneStatus = (index, newStatus) => {
    setDrones(drones.map((drone, i) => i === index ? { ...drone, status: newStatus } : drone));
  };

const startDelivery = (droneIndex, orderId) => {
  const drone = drones[droneIndex];
  if (drone.status !== "ready") return alert("🚨 Drone không thể giao!");
  if (drone.deliveriesLeft <= 0 || drone.battery <= 0)
    return alert("⚠️ Drone đã hết pin hoặc hết lượt bay!");

  const order = orders.find((o) => o.id === orderId);
  const start = storeLocations[order.store];
  const end = userLocations[order.user];
  if (!start || !end) return alert("⚠️ Thiếu tọa độ!");

  const oneWayDist = calcDistance(start, end);
  const totalDist = oneWayDist * 2; // 👉 Tổng quãng đường cả đi và về
  const steps = 100;
  let step = 0;
  let going = true;

  // ✅ Cập nhật trạng thái ban đầu
  setDrones((prev) =>
    prev.map((d, i) =>
      i === droneIndex ? { ...d, status: "delivering", eta: 5 } : d
    )
  );

  setOrders((prev) =>
    prev.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "delivering",
            drone: drone.name,
            dronePos: start,
            // ✅ Hiển thị tổng khoảng cách ngay từ đầu
            distance: `${totalDist.toFixed(2)} (km, cả đi & về)`,
            totalDistance: totalDist, // để lưu cho nội bộ
          }
        : o
    )
  );

  // ✅ Bắt đầu bay
  const interval = setInterval(() => {
    if (going) {
      step++;
      const lat = start[0] + ((end[0] - start[0]) * step) / steps;
      const lng = start[1] + ((end[1] - start[1]) * step) / steps;
      const remaining = calcDistance([lat, lng], end);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, dronePos: [lat, lng], distance: `${remaining.toFixed(2)} km` }
            : o
        )
      );

      if (step >= steps) going = false;
    } else {
      step--;
      const lat = end[0] + ((start[0] - end[0]) * (steps - step)) / steps;
      const lng = end[1] + ((start[1] - end[1]) * (steps - step)) / steps;
      const remaining = calcDistance([lat, lng], start);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, dronePos: [lat, lng], distance: `${remaining.toFixed(2)} km` }
            : o
        )
      );

      if (step <= 0) {
        clearInterval(interval);

        // ✅ Cập nhật khi hoàn tất
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "done",
                  dronePos: start,
                  distance: `${totalDist.toFixed(2)} (km, cả đi & về)`,
                }
              : o
          )
        );

        setDrones((prev) =>
          prev.map((d, i) =>
            i === droneIndex
              ? {
                  ...d,
                  status: "ready",
                  eta: null,
                  battery: Math.max(0, d.battery - oneWayDist * 10 * 2), // bay 2 chiều hao pin gấp đôi
                  deliveriesLeft: Math.max(0, d.deliveriesLeft - 1),
                }
              : d
          )
        );
      }
    }
  }, 80);
};


const restartOrders = () => {
  // Reset đơn về trạng thái pending, xóa drone, reset distance
  setOrders(prev => 
    prev.map(o => ({
      ...o,
      status: "pending",
      drone: "",
      dronePos: null,
      distance: null, // ✅ reset khoảng cách
      totalDistance: null, // ✅ nếu lưu nội bộ
    }))
  );

  // Reset drone về trạng thái ready, ETA null
  setDrones(prev => 
    prev.map(d => ({
      ...d,
      status: "ready",
      eta: null,
      // giữ pin & lượt giao còn nguyên để demo tiếp
    }))
  );
};


  const deleteDrone = (index) => {
    if (drones[index].status === "delivering") return alert("🚨 Không thể xóa drone đang giao!");
    setDrones(drones.filter((_, i) => i !== index));
  };

  return (
    <div className="drones-container">
      <h1>🚁 Quản lý Drone</h1>

      <div className="drone-form">
        <input type="text" placeholder="Tên Drone mới" value={newDroneName} onChange={e => setNewDroneName(e.target.value)} />
        <button onClick={addDrone}>Thêm Drone</button>
        <button onClick={restartOrders} style={{ marginLeft: "10px" }}>🔄 Restart đơn</button>
      </div>

      <table className="drones-table">
        <thead>
          <tr><th>#</th><th>Tên Drone</th><th>Trạng thái</th><th>Pin</th><th>Lượt giao còn</th><th>ETA</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {drones.map((drone, index) => (
            <tr key={drone.id}>
              <td>{index + 1}</td>
              <td>{drone.name}</td>
              <td>{translateDroneStatus(drone.status)}</td>
              <td>{(drone.battery ?? 0).toFixed(0)}%</td>

              <td>{drone.deliveriesLeft}</td>
              <td>{drone.eta ? `${drone.eta}s` : "-"}</td>
              <td>
                {orders.filter(o => o.status === "pending").length > 0 && (
                  <select onChange={e => startDelivery(index, Number(e.target.value))} defaultValue="" disabled={drone.status !== "ready"}>
                    <option value="">🚀 Giao đơn</option>
                    {orders.filter(o => o.status === "pending").map(o =>
                      <option key={o.id} value={o.id}>#{o.id} {o.user}</option>
                    )}
                  </select>
                )}
                <select value="" onChange={e => changeDroneStatus(index, e.target.value)}>
                  <option value="">⚙️ Trạng thái</option>
                  <option value="ready">Sẵn sàng</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="low_battery">Pin yếu</option>
                </select>
                <button onClick={() => deleteDrone(index)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📦 Đơn hàng</h2>
      <table className="drones-table">
        <thead><tr><th>ID</th><th>Cửa hàng</th><th>Khách hàng</th><th>Trạng thái</th><th>Drone</th><th>Khoảng cách (km)</th></tr></thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.store}</td>
              <td>{order.user}</td>
              <td>{translateOrderStatus(order.status)}</td>
              <td>{order.drone || "-"}</td>
              <td>{order.distance || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="map-wrapper" style={{ height: "400px", marginTop: "20px" }}>
        <MapContainer center={[10.779, 106.702]} zoom={16} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {Object.entries(storeLocations).map(([k, v]) =>
            v && Array.isArray(v) ? <Marker key={`store-${k}`} position={v} icon={storeIcon} /> : null
          )}

          {Object.entries(userLocations).map(([k, v]) =>
            v && Array.isArray(v) ? <Marker key={`user-${k}`} position={v} icon={userIcon} /> : null
          )}

          {orders.filter(o => o.dronePos && Array.isArray(o.dronePos)).map(o => (
            <Marker key={`drone-${o.id}`} position={o.dronePos} icon={droneIcon}>
              <Popup>
                {o.drone} → {o.user}
                <br />📏 Cách còn lại: {o.distance || 0} km
              </Popup>
            </Marker>
          ))}

          {orders
            .filter(o => o.status === "delivering")
            .map(o => {
              const start = storeLocations[o.store];
              const end = userLocations[o.user];
              if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) return null;
              return <Polyline key={`path-${o.id}`} positions={[start, end]} color="blue" />;
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneOrders;
