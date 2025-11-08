import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DroneMap.css";

const storePos = [10.762622, 106.660172];

const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2010/2010887.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});
const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const destIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const LocationPicker = ({ setDeliveryPos, disabled }) => {
  useMapEvents({
    click(e) {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      setDeliveryPos([lat, lng]);
    },
  });
  return null;
};

const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.2 });
  }, [position]);
  return null;
};

const DroneMap = () => {
  const [dronePos, setDronePos] = useState(storePos);
  const [deliveryPos, setDeliveryPos] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("🚁 Drone đang chờ tại quán.");
  const [direction, setDirection] = useState("idle");
  const [address, setAddress] = useState("");

  const [readyOrders, setReadyOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([
    { id: 101, email: "nguyen.van.a@example.com", totalAmount: 95000, deliveredAt: "09:45 AM" },
    { id: 102, email: "tran.thi.b@example.com", totalAmount: 120000, deliveredAt: "10:15 AM" },
    { id: 103, email: "le.hoang.c@example.com", totalAmount: 78000, deliveredAt: "11:05 AM" },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const isBusy = direction !== "idle";
  const dronePosRef = useRef(dronePos);
  useEffect(() => { dronePosRef.current = dronePos; }, [dronePos]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("drones_data"));
    if (Array.isArray(saved) && saved.length) setReadyOrders(saved);
    else {
      const demo = [
        { id: 201, email: "alice@example.com", totalAmount: 120000, customerLocation: [10.7668, 106.6620] },
        { id: 202, email: "bob@example.com", totalAmount: 85000, customerLocation: [10.7595, 106.6590] },
      ];
      setReadyOrders(demo);
      localStorage.setItem("drones_data", JSON.stringify(demo));
    }
  }, []);

  const calcDistanceKm = (pos1, pos2) => {
    if (!pos1 || !pos2) return 0;
    const R = 6371;
    const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
    const dLon = ((pos2[1] - pos1[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pos1[0] * Math.PI) / 180) *
      Math.cos((pos2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calcETA = (distanceKm, speedKmH = 40) => {
    const minutes = Math.max(1, Math.round((distanceKm / speedKmH) * 60));
    return `${minutes} phút`;
  };

  useEffect(() => {
    if (direction !== "toCustomer" || !deliveryPos) return;
    let cancelled = false;
    const stepFactor = 0.01;
    const tickMs = 100;
    const id = setInterval(() => {
      if (cancelled) return;
      const cur = dronePosRef.current || storePos;
      const [lat, lng] = cur;
      const [targetLat, targetLng] = deliveryPos;
      const latDiff = targetLat - lat;
      const lngDiff = targetLng - lng;
      const dist = Math.sqrt(latDiff ** 2 + lngDiff ** 2);
      if (dist < 0.0001) {
        setStatus("✅ Giao hàng thành công!");
        setCompletedOrders(prev => [
          ...prev,
          { ...selectedOrder, deliveredAt: new Date().toLocaleTimeString() },
        ]);
        setReadyOrders(prev => prev.filter(o => o.id !== selectedOrder?.id));
        setSelectedOrder(null);
        setDirection("idle");
        setProgress(1);
        clearInterval(id);
        return;
      }
      setDronePos([lat + latDiff * stepFactor, lng + lngDiff * stepFactor]);
      setProgress(prev => Math.min(1, prev + stepFactor));
    }, tickMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [direction, deliveryPos]);

  const handleSelectOrder = (order) => {
    if (isBusy) { alert("🚫 Drone đang bận"); return; }
    if (!order.customerLocation) { alert("⚠️ Đơn chưa có tọa độ khách"); return; }
    setSelectedOrder(order);
    setDeliveryPos(order.customerLocation);
    setStatus(`📦 Đã chọn đơn #${order.id}. Sẵn sàng gửi drone.`);
  };

  const handleStartDelivery = () => {
    if (!selectedOrder) { alert("⚠️ Chọn đơn trước khi gửi drone."); return; }
    setStatus("🚁 Drone rời quán, đến giao cho khách...");
    setDirection("toCustomer");
    setProgress(0);
  };

  const handleSearchAddress = async () => {
    if (!address.trim()) return;
    if (isBusy) return alert("🚫 Drone đang bận");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.length > 0) {
        setDeliveryPos([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setStatus("📍 Đã chọn vị trí giao hàng (thủ công).");
      } else alert("Không tìm thấy địa chỉ.");
    } catch { alert("Lỗi khi tìm địa chỉ."); }
  };

  useEffect(() => { localStorage.setItem("drones_data", JSON.stringify(readyOrders)); }, [readyOrders]);

  return (
    <div className="drone-map-container">
      <h2 className="page-title">🚁 Drone giao hàng</h2>

      <div className="orders-section">
        <div className="order-box">
          <h3>📦 Đơn chưa giao</h3>
          <div className="order-list">
            {readyOrders.map(order => {
              const distKm = calcDistanceKm(storePos, order.customerLocation || storePos);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-info"><b>#{order.id}</b> – {order.email}</div>
                  <div className="order-meta">💰 {order.totalAmount.toLocaleString("vi-VN")} ₫ <br />🎯 {distKm.toFixed(2)} km • ETA: {calcETA(distKm)}</div>
                  <button onClick={() => handleSelectOrder(order)} disabled={isBusy}>Chọn đơn</button>
                </div>
              );
            })}
            {readyOrders.length === 0 && <p>Không có đơn nào.</p>}
          </div>
        </div>

        <div className="order-box">
          <h3>✅ Đơn đã giao</h3>
          <div className="order-list">
            {completedOrders.map(order => (
              <div key={order.id} className="order-card completed">
                <div className="order-info"><b>#{order.id}</b> – {order.email}</div>
                <div className="order-meta">💰 {order.totalAmount.toLocaleString("vi-VN")} ₫ <br />🕓 Giao lúc: {order.deliveredAt}</div>
              </div>
            ))}
            {completedOrders.length === 0 && <p>Chưa có đơn nào hoàn tất.</p>}
          </div>
        </div>
      </div>

      <div className="control-section">
        <div className="address-input">
          <input type="text" placeholder="Nhập địa chỉ..." value={address} onChange={e => setAddress(e.target.value)} disabled={isBusy}/>
          <button onClick={handleSearchAddress} disabled={isBusy || !address}>Tìm</button>
        </div>

        <div className="status-box">
          <p><b>Trạng thái:</b> {status}</p>
          {direction === "toCustomer" && deliveryPos ? (
            <>
              <p>⏱️ <b>Thời gian còn lại:</b> {calcETA(calcDistanceKm(dronePos, deliveryPos))}</p>
              <p>📏 <b>Khoảng cách còn lại:</b> {calcDistanceKm(dronePos, deliveryPos).toFixed(2)} km</p>
            </>
          ) : (
            <p>⏳ <b>Tiến độ:</b> {Math.round(progress * 100)}%</p>
          )}
          {selectedOrder && <p>🧾 <b>Đơn đang xử lý:</b> #{selectedOrder.id}</p>}
        </div>

        <button className="start-button" onClick={handleStartDelivery} disabled={direction !== "idle" || !selectedOrder}>
          {direction === "idle" ? "🚀 Gửi drone giao đơn" : "🛫 Drone đang bay..."}
        </button>
      </div>

      <div className="map-container">
        <MapContainer center={storePos} zoom={14} className="drone-map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap'/>
          <LocationPicker setDeliveryPos={setDeliveryPos} disabled={isBusy} />
          {deliveryPos && <FlyToLocation position={deliveryPos} />}
          <Marker position={storePos} icon={storeIcon}/>
          {deliveryPos && <Marker position={deliveryPos} icon={destIcon}/>}
          {dronePos && <Marker position={dronePos} icon={droneIcon}/>}
          {direction === "toCustomer" && deliveryPos && <Polyline positions={[dronePos, deliveryPos]} color="#0078ff"/>}
        </MapContainer>
      </div>
    </div>
  );
};

export default DroneMap;
