import React, { useState, useEffect } from "react";
import "./Users.css";

const USERS_KEY = "users_data";
const LS_STORES = "app_stores";

// Lấy dữ liệu user từ localStorage
const getUsersFromStorage = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data
    ? JSON.parse(data)
    : [
        {
          id: 1,
          name: "Alice",
          email: "alice@example.com",
          role: "customer",
          status: "active",
          successRate: 100,
          reports: 0,
        },
        {
          id: 2,
          name: "Bob",
          email: "bob@example.com",
          role: "admin",
          status: "approved",
          storeId: 1,
          successRate: 85,
          reports: 1,
        },
      ];
};

const Users = () => {
  const [users, setUsers] = useState(getUsersFromStorage());
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
    storeId: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [editingUser, setEditingUser] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
    storeId: null,
  });

  const [stores, setStores] = useState(() => {
    const stored = localStorage.getItem(LS_STORES);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const status = newUser.role === "admin" ? "pending" : newUser.status;

    setUsers([
      ...users,
      {
        id,
        ...newUser,
        status,
        successRate: 100,
        reports: 0,
      },
    ]);
    setNewUser({
      name: "",
      email: "",
      role: "customer",
      status: "active",
      storeId: null,
    });
  };

  const deleteUser = (id) => setUsers(users.filter((u) => u.id !== id));
  const startEdit = (user) => {
    setEditingId(user.id);
    setEditingUser({ ...user });
  };
  const saveEdit = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...editingUser } : u)));
    setEditingId(null);
  };
  const approveUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "approved" } : u)));
  };
  const rejectUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: "rejected" } : u)));
  };
  const toggleCustomerStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };
  const updateStats = (id, successChange, reportChange) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        let newRate = Math.max(0, Math.min(100, u.successRate + successChange));
        let newReports = Math.max(0, u.reports + reportChange);
        let status = u.status;

        if (newRate < 50 || newReports >= 5) status = "blocked";

        return { ...u, successRate: newRate, reports: newReports, status };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  };

  // Tách users theo role
  const adminUsers = users.filter((u) => u.role === "admin");
  const customerUsers = users.filter((u) => u.role === "customer");

  return (
    <div className="users-container">
      <h1>👤 Quản lý người dùng</h1>

      {/* Form thêm user */}
      <div className="user-form">
        <input
          type="text"
          placeholder="Tên người dùng"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="customer">Khách hàng</option>
          <option value="admin">Nhà hàng</option>
        </select>

        {newUser.role === "customer" ? (
          <select
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        ) : (
          <select
            value={newUser.storeId || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, storeId: Number(e.target.value) })
            }
          >
            <option value="">Chọn cửa hàng</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        )}

        <button onClick={addUser}>Thêm người dùng</button>
      </div>

      {/* Khung Nhà hàng */}
      <div className="section-title">🏢 Nhà hàng</div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Cửa hàng</th>
            <th>Tỷ lệ</th>
            <th>Báo cáo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map((user) => (
            <tr key={user.id} className={user.status === "blocked" ? "blocked-row" : ""}>
              <td>{user.id}</td>
              <td>{editingId === user.id ? <input value={editingUser.name} onChange={e=>setEditingUser({...editingUser,name:e.target.value})}/> : user.name}</td>
              <td>{editingId === user.id ? <input value={editingUser.email} onChange={e=>setEditingUser({...editingUser,email:e.target.value})}/> : user.email}</td>
              <td>
                {user.status === "pending" ? "⏳ Chờ duyệt" : user.status === "rejected" ? "❌ Từ chối" : user.status === "blocked" ? "🔒 Bị khóa" : "✅ Đã duyệt"}
              </td>
              <td>{stores.find(s=>s.id===user.storeId)?.name || "-"}</td>
              <td>{user.successRate}%</td>
              <td>{user.reports}</td>
              <td>
                {editingId===user.id ? <button onClick={()=>saveEdit(user.id)}>Lưu</button> : (
                  <>
                    <button onClick={()=>startEdit(user)}>✏️ Sửa</button>
                    <button onClick={()=>deleteUser(user.id)}>🗑 Xóa</button>
                    {user.status==="pending" && <>
                      <button onClick={()=>approveUser(user.id)}>✅ Duyệt</button>
                      <button onClick={()=>rejectUser(user.id)}>❌ Từ chối</button>
                    </>}
                    <button onClick={()=>updateStats(user.id, +10,0)}>+ Thành công</button>
                    <button onClick={()=>updateStats(user.id,-10,+1)}>+ Báo cáo</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Khung Khách hàng */}
      <div className="section-title">🛒 Khách hàng</div>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Tỷ lệ</th>
            <th>Báo cáo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customerUsers.map((user) => (
            <tr key={user.id} className={user.status === "blocked" ? "blocked-row" : ""}>
              <td>{user.id}</td>
              <td>{editingId === user.id ? <input value={editingUser.name} onChange={e=>setEditingUser({...editingUser,name:e.target.value})}/> : user.name}</td>
              <td>{editingId === user.id ? <input value={editingUser.email} onChange={e=>setEditingUser({...editingUser,email:e.target.value})}/> : user.email}</td>
              <td>{user.status==="active" ? "✅ Đang hoạt động" : user.status==="inactive" ? "⚫ Ngừng hoạt động" : "🔒 Bị khóa"}</td>
              <td>{user.successRate}%</td>
              <td>{user.reports}</td>
              <td>
                {editingId===user.id ? <button onClick={()=>saveEdit(user.id)}>Lưu</button> : (
                  <>
                    <button onClick={()=>startEdit(user)}>✏️ Sửa</button>
                    <button onClick={()=>deleteUser(user.id)}>🗑 Xóa</button>
                    <button onClick={()=>toggleCustomerStatus(user.id)}>
                      {user.status==="active" ? "🔒 Khóa" : "🔓 Mở"}
                    </button>
                    <button onClick={()=>updateStats(user.id, +10,0)}>+ Thành công</button>
                    <button onClick={()=>updateStats(user.id,-10,+1)}>+ Báo cáo</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Card view Admin (mobile) */}
<div className="mobile-view">
  <div className="section-title">🏢 Nhà hàng</div>
  {adminUsers.map((user) => (
    <div key={user.id} className={`user-card ${user.status === "blocked" ? "blocked-row" : ""}`}>
      <div><strong>ID:</strong> {user.id}</div>
      <div><strong>Tên:</strong> {editingId===user.id ? <input value={editingUser.name} onChange={e=>setEditingUser({...editingUser,name:e.target.value})}/> : user.name}</div>
      <div><strong>Email:</strong> {editingId===user.id ? <input value={editingUser.email} onChange={e=>setEditingUser({...editingUser,email:e.target.value})}/> : user.email}</div>
      <div><strong>Trạng thái:</strong> {user.status==="pending" ? "⏳ Chờ duyệt" : user.status==="rejected" ? "❌ Từ chối" : user.status==="blocked" ? "🔒 Bị khóa" : "✅ Đã duyệt"}</div>
      <div><strong>Cửa hàng:</strong> {stores.find(s=>s.id===user.storeId)?.name || "-"}</div>
      <div><strong>Tỷ lệ:</strong> {user.successRate}%</div>
      <div><strong>Báo cáo:</strong> {user.reports}</div>
      <div className="card-actions">
        {editingId===user.id 
          ? <button onClick={()=>saveEdit(user.id)}>Lưu</button>
          : <>
              <button onClick={()=>startEdit(user)}>✏️ Sửa</button>
              <button onClick={()=>deleteUser(user.id)}>🗑 Xóa</button>
              {user.status==="pending" && <>
                <button onClick={()=>approveUser(user.id)}>✅ Duyệt</button>
                <button onClick={()=>rejectUser(user.id)}>❌ Từ chối</button>
              </>}
              <button onClick={()=>updateStats(user.id,+10,0)}>+ Thành công</button>
              <button onClick={()=>updateStats(user.id,-10,+1)}>+ Báo cáo</button>
            </>
        }
      </div>
    </div>
  ))}
</div>

{/* Card view Customer (mobile) */}
<div className="mobile-view">
  <div className="section-title">🛒 Khách hàng</div>
  {customerUsers.map((user) => (
    <div key={user.id} className={`user-card ${user.status === "blocked" ? "blocked-row" : ""}`}>
      <div><strong>ID:</strong> {user.id}</div>
      <div><strong>Tên:</strong> {editingId===user.id ? <input value={editingUser.name} onChange={e=>setEditingUser({...editingUser,name:e.target.value})}/> : user.name}</div>
      <div><strong>Email:</strong> {editingId===user.id ? <input value={editingUser.email} onChange={e=>setEditingUser({...editingUser,email:e.target.value})}/> : user.email}</div>
      <div><strong>Trạng thái:</strong> {user.status==="active" ? "✅ Đang hoạt động" : user.status==="inactive" ? "⚫ Ngừng hoạt động" : "🔒 Bị khóa"}</div>
      <div><strong>Tỷ lệ:</strong> {user.successRate}%</div>
      <div><strong>Báo cáo:</strong> {user.reports}</div>
      <div className="card-actions">
        {editingId===user.id 
          ? <button onClick={()=>saveEdit(user.id)}>Lưu</button>
          : <>
              <button onClick={()=>startEdit(user)}>✏️ Sửa</button>
              <button onClick={()=>deleteUser(user.id)}>🗑 Xóa</button>
              <button onClick={()=>toggleCustomerStatus(user.id)}>
                {user.status==="active" ? "🔒 Khóa" : "🔓 Mở"}
              </button>
              <button onClick={()=>updateStats(user.id,+10,0)}>+ Thành công</button>
              <button onClick={()=>updateStats(user.id,-10,+1)}>+ Báo cáo</button>
            </>
        }
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Users;
