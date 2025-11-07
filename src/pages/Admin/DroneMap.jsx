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

// 📍 Tọa độ quán (drone bắt đầu tại đây)
const storePos = [10.762622, 106.660172];

// 🖼️ Icon
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

// 📍 Click chọn vị trí khách hàng (nếu không bận)
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

// 🗺️ Khi có vị trí mới, map flyTo đó
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
  const [direction, setDirection] = useState("idle"); // idle | toCustomer
  const [address, setAddress] = useState("");

  // Danh sách đơn (lấy từ localStorage hoặc giả lập)
  const [readyOrders, setReadyOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showReady, setShowReady] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const isBusy = direction !== "idle";

  // Ref tránh stale closure
  const dronePosRef = useRef(dronePos);
  useEffect(() => { dronePosRef.current = dronePos; }, [dronePos]);

  // Load dữ liệu
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("drones_data"));
    if (Array.isArray(saved) && saved.length) {
      setReadyOrders(saved);
    } else {
      // demo data
      const demo = [
        { id: 201, email: "alice@example.com", totalAmount: 120000, customerLocation: [10.7668, 106.6620] },
        { id: 202, email: "bob@example.com", totalAmount: 85000, customerLocation: [10.7595, 106.6590] },
      ];
      setReadyOrders(demo);
      localStorage.setItem("drones_data", JSON.stringify(demo));
    }
  }, []);

  // Helper tính khoảng cách (km)
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

  // 🛫 Di chuyển drone
  useEffect(() => {
    if (direction !== "toCustomer") return;
    if (!deliveryPos) return;

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
      const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

      // Đến nơi
      if (dist < 0.0001) {
        setStatus("✅ Giao hàng thành công!");
        setCompletedOrders((prev) => [
          ...prev,
          { ...selectedOrder, deliveredAt: new Date().toLocaleTimeString() },
        ]);
        setReadyOrders((prev) => prev.filter((o) => o.id !== selectedOrder?.id));
        setSelectedOrder(null);
        setDirection("idle");
        setProgress(1);
        clearInterval(id);
        return;
      }

      // Di chuyển
      const nextLat = lat + latDiff * stepFactor;
      const nextLng = lng + lngDiff * stepFactor;
      setDronePos([nextLat, nextLng]);
      setProgress((prev) => Math.min(1, prev + stepFactor));
    }, tickMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [direction, deliveryPos]);

  // 🧾 Chọn đơn
  const handleSelectOrder = (order) => {
    if (isBusy) {
      alert("🚫 Drone đang bận, vui lòng chờ.");
      return;
    }
    if (!order.customerLocation) {
      alert("⚠️ Đơn này chưa có tọa độ khách.");
      return;
    }
    setSelectedOrder(order);
    setDeliveryPos(order.customerLocation);
    setStatus(`📦 Đã chọn đơn #${order.id}. Sẵn sàng gửi drone.`);
  };

  // 🚀 Bắt đầu bay
  const handleStartDelivery = () => {
    if (!selectedOrder) {
      alert("⚠️ Vui lòng chọn đơn trước khi gửi drone.");
      return;
    }
    setStatus("🚁 Drone rời quán, đến giao cho khách...");
    setDirection("toCustomer");
    setProgress(0);
  };

  // 🔍 Tìm vị trí theo địa chỉ (nếu nhập tay)
  const handleSearchAddress = async () => {
    if (!address.trim()) return;
    if (isBusy) return alert("🚫 Drone đang bận");

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setDeliveryPos([lat, lon]);
        setStatus("📍 Đã chọn vị trí giao hàng (thủ công).");
      } else alert("Không tìm thấy địa chỉ.");
    } catch {
      alert("Lỗi khi tìm địa chỉ.");
    }
  };

  // Lưu danh sách vào localStorage
  useEffect(() => {
    localStorage.setItem("drones_data", JSON.stringify(readyOrders));
  }, [readyOrders]);

  return (
    <div className="drone-map-container">
      <h2>🚁 Mô phỏng Drone giao hàng </h2>

      <div className="order-sections">
        <div className="order-toggle">
          <h3 onClick={() => setShowReady(!showReady)} style={{ cursor: "pointer" }}>
            📦 Đơn chưa giao {showReady ? "▲" : "▼"}
          </h3>
          {showReady && (
            <ul>
              {readyOrders.length === 0 ? (
                <p>Không có đơn nào.</p>
              ) : (
                readyOrders.map((order) => {
                  const distKm = calcDistanceKm(storePos, order.customerLocation || storePos);
                  return (
                    <li key={order.id}>
                      <b>#{order.id}</b> – {order.email} – {order.totalAmount.toLocaleString("vi-VN")} ₫
                      <br />
                      🎯 {distKm.toFixed(2)} km • ETA: {calcETA(distKm)}
                      <br />
                      <button onClick={() => handleSelectOrder(order)} disabled={isBusy}>
                        Chọn
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>

        <div className="order-toggle">
          <h3 onClick={() => setShowCompleted(!showCompleted)} style={{ cursor: "pointer" }}>
            ✅ Đơn đã giao {showCompleted ? "▲" : "▼"}
          </h3>
          {showCompleted && (
            <ul>
              {completedOrders.length === 0 ? (
                <p>Chưa có đơn nào hoàn tất.</p>
              ) : (
                completedOrders.map((order) => (
                  <li key={order.id}>
                    <b>#{order.id}</b> – {order.email} – {order.totalAmount.toLocaleString("vi-VN")} ₫
                    <br />🕓 Giao lúc: {order.deliveredAt}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="address-input">
        <input
          type="text"
          placeholder="Nhập địa chỉ giao hàng (nếu muốn chọn thủ công)..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isBusy}
        />
        <button onClick={handleSearchAddress} disabled={isBusy || !address}>Tìm</button>
      </div>

<p>
  <b>Trạng thái:</b> {status}
  <br />
  {direction === "toCustomer" && deliveryPos ? (
    <>
      <b>⏱️ Thời gian còn lại:</b>{" "}
      {calcETA(calcDistanceKm(dronePos, deliveryPos))}
      <br />
      <b>📏 Khoảng cách còn lại:</b>{" "}
      {calcDistanceKm(dronePos, deliveryPos).toFixed(2)} km
    </>
  ) : (
    <>
      <b>Tiến độ:</b> {Math.round(progress * 100)}%
    </>
  )}
  {selectedOrder && (
    <>
      <br />
      <b>Đơn đang xử lý:</b> #{selectedOrder.id}
    </>
  )}
</p>

      <button
        className="start-button"
        onClick={handleStartDelivery}
        disabled={direction !== "idle" || !selectedOrder}
      >
        {direction === "idle" ? "Gửi drone giao đơn" : "Drone đang bay..."}
      </button>

      <MapContainer center={storePos} zoom={14} style={{ height: "65vh", width: "100%", borderRadius: 12 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker setDeliveryPos={setDeliveryPos} disabled={isBusy} />
        {deliveryPos && <FlyToLocation position={deliveryPos} />}

        <Marker position={storePos} icon={storeIcon} />
        {deliveryPos && <Marker position={deliveryPos} icon={destIcon} />}
        {dronePos && <Marker position={dronePos} icon={droneIcon} />}

        {direction === "toCustomer" && deliveryPos && (
          <Polyline positions={[dronePos, deliveryPos]} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default DroneMap;
