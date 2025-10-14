// Users.jsx
import React, { useState, useEffect } from "react";
import "./Users.css";

const USERS_KEY = "users_data";
const LS_STORES = "app_stores"; // để lấy tên cửa hàng

// Hàm lấy dữ liệu user từ localStorage
const getUsersFromStorage = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data
    ? JSON.parse(data)
    : [
        { id: 1, name: "Alice", email: "alice@example.com", role: "customer", status: "active" },
        { id: 2, name: "Bob", email: "bob@example.com", role: "admin", storeId: 1 },
      ];
};

const Users = () => {
  const [users, setUsers] = useState(getUsersFromStorage());
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "customer", status: "active", storeId: null });
  const [editingId, setEditingId] = useState(null);
  const [editingUser, setEditingUser] = useState({ name: "", email: "", role: "customer", status: "active", storeId: null });

  const [stores, setStores] = useState(() => {
    const stored = localStorage.getItem(LS_STORES);
    return stored ? JSON.parse(stored) : [];
  });

  // Lưu dữ liệu user vào localStorage
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  // Thêm user mới
  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: "", email: "", role: "customer", status: "active", storeId: null });
  };

  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditingUser({ ...user });
  };

  const saveEdit = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...editingUser } : u));
    setEditingId(null);
  };

  return (
    <div className="users-container">
      <h1>👤 Quản lý người dùng</h1>

      {/* Form thêm user */}
      <div className="user-form">
        <input
          type="text"
          placeholder="Tên người dùng"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="customer">Khách hàng</option>
          <option value="admin">Quản trị</option>
        </select>

        {newUser.role === "customer" ? (
          <select
            value={newUser.status}
            onChange={e => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        ) : (
          <select
            value={newUser.storeId || ""}
            onChange={e => setNewUser({ ...newUser, storeId: Number(e.target.value) })}
          >
            <option value="">Chọn cửa hàng</option>
            {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
          </select>
        )}
        <button onClick={addUser}>Thêm người dùng</button>
      </div>

      {/* Bảng user */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái / Cửa hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                ) : user.name}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                ) : user.email}
              </td>
              <td>
                {editingId === user.id ? (
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Quản trị</option>
                  </select>
                ) : (user.role === "admin" ? "Quản trị" : "Khách hàng")}
              </td>
              <td>
                {editingId === user.id ? (
                  user.role === "admin" ? (
                    <select
                      value={editingUser.storeId || ""}
                      onChange={e => setEditingUser({ ...editingUser, storeId: Number(e.target.value) })}
                    >
                      <option value="">Chọn cửa hàng</option>
                      {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                    </select>
                  ) : (
                    <select
                      value={editingUser.status}
                      onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Ngừng hoạt động</option>
                    </select>
                  )
                ) : (
                  user.role === "admin"
                    ? stores.find(s => s.id === user.storeId)?.name || "-"
                    : user.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <button onClick={() => saveEdit(user.id)}>Lưu</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(user)}>Sửa</button>
                    <button onClick={() => deleteUser(user.id)}>Xóa</button>
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

export default Users;
