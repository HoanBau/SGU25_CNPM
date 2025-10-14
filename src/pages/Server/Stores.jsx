import React, { useState } from "react";
import "./Stores.css";

const Stores = ({ stores, setStores }) => {
  const [newStore, setNewStore] = useState({ name: "", address: "", phone: "", status: "active", revenue: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editingStore, setEditingStore] = useState({ name: "", address: "", phone: "", status: "active", revenue: 0 });

  // Thêm cửa hàng mới
  const addStore = () => {
    if (!newStore.name || !newStore.address || !newStore.phone) return;
    const id = stores.length > 0 ? stores[stores.length - 1].id + 1 : 1;
    setStores([...stores, { id, ...newStore }]);
    setNewStore({ name: "", address: "", phone: "", status: "active", revenue: 0 });
  };

  // Xóa cửa hàng
  const deleteStore = (id) => {
    setStores(stores.filter((store) => store.id !== id));
  };

  // Bắt đầu sửa cửa hàng
  const startEdit = (store) => {
    setEditingId(store.id);
    setEditingStore({ ...store });
  };

  // Lưu sửa cửa hàng
  const saveEdit = (id) => {
    setStores(
      stores.map((store) =>
        store.id === id ? { ...store, ...editingStore } : store
      )
    );
    setEditingId(null);
  };

  return (
    <div className="stores">
      <h1>🏪 Quản lý cửa hàng</h1>

      {/* Thêm cửa hàng */}
      <div className="store-form">
        <input
          type="text"
          placeholder="Tên cửa hàng"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={newStore.address}
          onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={newStore.phone}
          onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
        />
        <select
          value={newStore.status}
          onChange={(e) => setNewStore({ ...newStore, status: e.target.value })}
        >
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
        <button onClick={addStore}>Thêm cửa hàng</button>
      </div>

      {/* Danh sách cửa hàng */}
      <table className="stores-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên cửa hàng</th>
            <th>Địa chỉ</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.id}</td>
              <td>
                {editingId === store.id ? (
                  <input
                    type="text"
                    value={editingStore.name}
                    onChange={(e) =>
                      setEditingStore({ ...editingStore, name: e.target.value })
                    }
                  />
                ) : (
                  store.name
                )}
              </td>
              <td>
                {editingId === store.id ? (
                  <input
                    type="text"
                    value={editingStore.address}
                    onChange={(e) =>
                      setEditingStore({ ...editingStore, address: e.target.value })
                    }
                  />
                ) : (
                  store.address
                )}
              </td>
              <td>
                {editingId === store.id ? (
                  <input
                    type="text"
                    value={editingStore.phone}
                    onChange={(e) =>
                      setEditingStore({ ...editingStore, phone: e.target.value })
                    }
                  />
                ) : (
                  store.phone
                )}
              </td>
              <td>
                {editingId === store.id ? (
                  <select
                    value={editingStore.status}
                    onChange={(e) =>
                      setEditingStore({ ...editingStore, status: e.target.value })
                    }
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                ) : (
                  store.status === "active" ? "Hoạt động" : "Ngừng hoạt động"
                )}
              </td>
              <td>
                {editingId === store.id ? (
                  <button onClick={() => saveEdit(store.id)}>Lưu</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(store)}>Sửa</button>
                    <button onClick={() => deleteStore(store.id)}>Xóa</button>
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

export default Stores;
