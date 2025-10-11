import React, { useEffect, useState } from "react";
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

// 🏠 Tọa độ quán
const storePos = [10.762622, 106.660172]; // Quán demo: SG

// Icon
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

// 📍 Chọn vị trí trực tiếp bằng click
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

// 🔍 Di chuyển bản đồ đến vị trí mới khi nhập địa chỉ
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 2 });
    }
  }, [position]);
  return null;
};

const DroneMap = () => {
  const [dronePos, setDronePos] = useState(storePos);
  const [deliveryPos, setDeliveryPos] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Chưa chọn địa điểm giao hàng.");
  const [direction, setDirection] = useState("idle");
  const [address, setAddress] = useState("");

  const isBusy = direction !== "idle"; // ❌ Không cho chọn nếu đang giao hàng hoặc quay về

  // 🚁 Giả lập drone bay
  useEffect(() => {
    if (!deliveryPos || direction === "idle") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        let newProgress = prev;

        if (direction === "toCustomer") {
          if (prev >= 1) {
            setStatus("✅ Đã giao hàng thành công!");
            setTimeout(() => {
              setDirection("toStore");
              setStatus("🔙 Đang quay về quán...");
              setProgress(0);
            }, 2000);
            return 1;
          }
          newProgress = prev + 0.005;
          const lat = storePos[0] + (deliveryPos[0] - storePos[0]) * newProgress;
          const lng = storePos[1] + (deliveryPos[1] - storePos[1]) * newProgress;
          setDronePos([lat, lng]);
        } else if (direction === "toStore") {
          if (prev >= 1) {
            setStatus("🏁 Đã trở về quán, sẵn sàng giao đơn mới!");
            setDirection("idle");
            setDeliveryPos(null);
            return 1;
          }
          newProgress = prev + 0.005;
          const lat = deliveryPos[0] + (storePos[0] - deliveryPos[0]) * newProgress;
          const lng = deliveryPos[1] + (storePos[1] - deliveryPos[1]) * newProgress;
          setDronePos([lat, lng]);
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, deliveryPos]);

  const handleStartDelivery = () => {
    if (!deliveryPos) {
      alert("⚠️ Vui lòng chọn địa điểm giao hàng (bằng click hoặc nhập địa chỉ)!");
      return;
    }
    setStatus("🚁 Đang bay đến điểm giao hàng...");
    setDirection("toCustomer");
    setProgress(0);
  };

  // 📦 Nhập địa chỉ rồi tìm tọa độ (geocoding)
  const handleSearchAddress = async () => {
    if (!address.trim()) return;

    if (isBusy) {
      alert("🚫 Drone đang giao hàng, vui lòng chờ quay về quán trước khi chọn địa điểm mới!");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setDeliveryPos([lat, lon]);
        setStatus("📍 Đã chọn địa chỉ giao hàng!");
      } else {
        alert("Không tìm thấy địa chỉ này. Hãy thử lại!");
      }
    } catch (err) {
      console.error("Lỗi khi tìm địa chỉ:", err);
    }
  };

  return (
    <div className="drone-map-container">
      <h2>🚁 Mô phỏng Drone giao hàng</h2>

      <div className="address-input">
        <input
          type="text"
          placeholder="Nhập địa chỉ giao hàng..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isBusy}
        />
        <button onClick={handleSearchAddress} disabled={isBusy}>
          Tìm địa chỉ
        </button>
      </div>

      <p>
        <b>Trạng thái:</b> {status}
        <br />
        <b>Tiến độ:</b> {Math.round(progress * 100)}%
      </p>

      <button
        className="start-button"
        onClick={handleStartDelivery}
        disabled={direction !== "idle" || !deliveryPos}
      >
        {direction === "idle" ? "Bắt đầu giao hàng" : "Đang giao..."}
      </button>

      <MapContainer
        center={storePos}
        zoom={14}
        style={{ height: "75vh", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPicker setDeliveryPos={setDeliveryPos} disabled={isBusy} />
        {deliveryPos && <FlyToLocation position={deliveryPos} />}

        <Marker position={storePos} icon={storeIcon}></Marker>
        {deliveryPos && <Marker position={deliveryPos} icon={destIcon}></Marker>}
        <Marker position={dronePos} icon={droneIcon}></Marker>

        {deliveryPos && (
          <Polyline
            positions={[storePos, deliveryPos]}
            color={direction === "toStore" ? "green" : "blue"}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default DroneMap;
