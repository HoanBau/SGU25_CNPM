import React, { useState, useEffect } from "react";
import "./Drones.css";

const DRONES_KEY = "drones_data";

// Hàm lấy dữ liệu drone từ localStorage
const getDronesFromStorage = () => {
  const data = localStorage.getItem(DRONES_KEY);
  return data
    ? JSON.parse(data)
    : [
        { name: "Drone 1", status: "ready" },
        { name: "Drone 2", status: "ready" },
        { name: "Drone 3", status: "ready" },
      ];
};

// Chuyển trạng thái drone sang tiếng Việt
const translateDroneStatus = (status) => {
  switch (status) {
    case "ready": return "Sẵn sàng";
    case "delivering": return "Đang giao";
    case "maintenance": return "Bảo trì";
    default: return status;
  }
};

const Drones = ({ drones, setDrones }) => {
  const [newDroneName, setNewDroneName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingDrone, setEditingDrone] = useState({ name: "", status: "ready" });

  // Lưu drone lên localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(DRONES_KEY, JSON.stringify(drones));
  }, [drones]);

  // Thêm drone mới
  const addDrone = () => {
    if (!newDroneName) return;
    setDrones([...drones, { name: newDroneName, status: "ready" }]);
    setNewDroneName("");
  };

  // Xóa drone
  const deleteDrone = (index) => {
    setDrones(drones.filter((_, i) => i !== index));
  };

  // Bắt đầu sửa drone
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingDrone({ ...drones[index] });
  };

  // Lưu sửa drone
  const saveEdit = (index) => {
    setDrones(drones.map((d, i) => i === index ? editingDrone : d));
    setEditingIndex(null);
  };

  return (
    <div className="drones-container">
      <h1>🚁 Quản lý Drone</h1>

      {/* Thêm drone */}
      <div className="drone-form">
        <input
          type="text"
          placeholder="Tên Drone mới"
          value={newDroneName}
          onChange={(e) => setNewDroneName(e.target.value)}
        />
        <button onClick={addDrone}>Thêm Drone</button>
      </div>

      {/* Bảng drone */}
      <table className="drones-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Drone</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {drones.map((drone, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingDrone.name}
                    onChange={(e) => setEditingDrone({ ...editingDrone, name: e.target.value })}
                  />
                ) : (
                  drone.name
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <select
                    value={editingDrone.status}
                    onChange={(e) => setEditingDrone({ ...editingDrone, status: e.target.value })}
                  >
                    <option value="ready">Sẵn sàng</option>
                    <option value="delivering">Đang giao</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                ) : (
                  translateDroneStatus(drone.status)
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <button onClick={() => saveEdit(index)}>Lưu</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(index)}>Sửa</button>
                    <button onClick={() => deleteDrone(index)}>Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drones;
