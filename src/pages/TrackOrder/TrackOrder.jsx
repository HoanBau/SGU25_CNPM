import React, { useState, useEffect } from "react";
import "./TrackOrder.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";

// 🛰️ Icon
const icons = {
  drone: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3022/3022106.png",
    iconSize: [40, 40],
  }),
  store: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    iconSize: [40, 40],
  }),
  customer: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4470/4470316.png",
    iconSize: [40, 40],
  }),
};

const TrackOrder = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [result, setResult] = useState(null);

  const storePos = [10.762622, 106.660172]; // SGU
  const [dronePos, setDronePos] = useState(storePos);
  const [customerPos, setCustomerPos] = useState(null);
  const [status, setStatus] = useState("pending");
  const [progress, setProgress] = useState(0);

  // 🔹 Lấy dữ liệu từ localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const storedFoodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    setOrders(storedOrders);
    setFoodItems(storedFoodItems);
  }, []);

  // 🔹 Khi nhập email để kiểm tra đơn
  const handleCheck = () => {
    const foundOrders = orders.filter((order) => order.email === email);
    setResult(foundOrders);

    if (foundOrders.length > 0) {
      const randomLat = 10.762622 + (Math.random() - 0.5) * 0.05;
      const randomLng = 106.660172 + (Math.random() - 0.5) * 0.05;
      setCustomerPos([randomLat, randomLng]);
      startGrabSimulation(storePos, [randomLat, randomLng]);
    }
  };

  // 🎬 Mô phỏng quy trình kiểu Grab
  const startGrabSimulation = (start, end) => {
    setStatus("confirmed");
    setDronePos(start);
    setProgress(0);

    // 1️⃣ Đã xác nhận
    setTimeout(() => setStatus("preparing"), 2000);

    // 2️⃣ Đang chuẩn bị
    setTimeout(() => {
      setStatus("delivering");
      simulateDroneMoving(start, end);
    }, 5000);

    // 3️⃣ Đang giao hàng → hoàn tất sau 25s
    setTimeout(() => {
      setStatus("delivered");
      setProgress(100);
      setDronePos(end);
    }, 30000);
  };

  // 🚁 Drone bay dần theo thời gian
  const simulateDroneMoving = (start, end) => {
    const steps = 100;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const lat = start[0] + ((end[0] - start[0]) * currentStep) / steps;
      const lng = start[1] + ((end[1] - start[1]) * currentStep) / steps;
      setDronePos([lat, lng]);
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) clearInterval(interval);
    }, 200);
  };

  const formatVND = (amount) => amount.toLocaleString("vi-VN");

  // 🎨 Hiển thị trạng thái kiểu Grab
  const getStatusText = () => {
    switch (status) {
      case "confirmed":
        return "✅ Đơn hàng đã được xác nhận";
      case "preparing":
        return "👨‍🍳 Nhà hàng đang chuẩn bị món ăn";
      case "delivering":
        return "🚁 Drone đang giao hàng đến bạn";
      case "delivered":
        return "🎉 Đơn hàng đã được giao thành công";
      default:
        return "🔍 Nhập email để kiểm tra đơn hàng";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "preparing":
        return "#ffc107";
      case "delivering":
        return "#17a2b8";
      case "delivered":
        return "#007bff";
      default:
        return "#6c757d";
    }
  };

  // ⚙️ Hàm tính khoảng cách (km)
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

  // ⚙️ Ước tính thời gian giao hàng (phút)
  const calcETA = (distanceKm, speedKmH = 40) => {
    const minutes = Math.max(1, Math.round((distanceKm / speedKmH) * 60));
    return `${minutes} phút`;
  };

  return (
    <div className="trackorder-container">
      <h2>Theo dõi đơn hàng</h2>

      <div className="trackorder-form">
        <input
          type="email"
          placeholder="Nhập email đặt hàng"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleCheck}>Kiểm tra</button>
      </div>

      {/* 🗺️ Bản đồ và tiến trình */}
      {result && result.length > 0 && (
        <div className="map-section">
          <MapContainer
            center={storePos}
            zoom={14}
            style={{ height: "400px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />

            <Marker position={storePos} icon={icons.store}>
              <Popup>🏠 Cửa hàng</Popup>
            </Marker>

            {customerPos && (
              <Marker position={customerPos} icon={icons.customer}>
                <Popup>👤 Khách hàng</Popup>
              </Marker>
            )}

            <Marker position={dronePos} icon={icons.drone}>
              <Popup>{getStatusText()}</Popup>
            </Marker>

            {customerPos && (
              <Polyline
                positions={[storePos, dronePos, customerPos]}
                color={status === "delivered" ? "green" : "blue"}
              />
            )}
          </MapContainer>

          {/* 🧭 Trạng thái đơn hàng */}
          <div className="status-box" style={{ background: getStatusColor() }}>
            <p>{getStatusText()}</p>

            {status === "delivering" && (
              <>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>

                {/* 📏 Khoảng cách và thời gian còn lại */}
                {customerPos && (
                  <p style={{ marginTop: "6px", fontWeight: "bold" }}>
                    📏 Còn lại: {calcDistanceKm(dronePos, customerPos).toFixed(2)} km<br />
                    ⏱️ Ước tính giao đến:{" "}
                    {calcETA(calcDistanceKm(dronePos, customerPos))}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 🧾 Thông tin & danh sách món ăn */}
      {result && result.length > 0 && (
        <div className="trackorder-result">
          {result.map((o, i) => {
            const itemsArray = Object.entries(o.items).map(([id, quantity]) => {
              const foodItem = foodItems.find((f) => f._id === id);
              return {
                id,
                name: foodItem ? foodItem.name : "Unknown",
                price: foodItem ? foodItem.price : 0,
                quantity,
              };
            });

            return (
              <div key={i} className="order-item">
                <p>
                  <b>Mã đơn:</b> {o.id} – <b>Trạng thái:</b> {getStatusText()}
                </p>

                {/* ✅ Danh sách sản phẩm */}
                {itemsArray.length > 0 ? (
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Tên món</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tạm tính</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsArray.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatVND(item.price)}</td>
                          <td>{formatVND(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Không có sản phẩm trong đơn này.</p>
                )}

                <p>
                  <b>Tổng tiền:</b>{" "}
                  {itemsArray
                    .reduce((t, item) => t + item.price * item.quantity, 0)
                    .toLocaleString("vi-VN")}{" "}
                  VNĐ
                </p>
                <hr />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
