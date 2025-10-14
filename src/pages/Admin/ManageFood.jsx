import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { food_list } from "../../assets/assets";
import "./ManageFood.css";

const ManageFood = () => {
  const { foodItems, setFoodItems, toggleSoldOut, addFood, deleteFood } = useContext(StoreContext);

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const [showPopup, setShowPopup] = useState(false); // state popup

  const categories = [...new Set(foodItems.map(f => f.category))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price || !newFood.category) {
      alert("Vui lòng nhập đầy đủ tên, giá và danh mục!");
      return;
    }

    addFood({
      ...newFood,
      _id: Date.now().toString(),
      soldOut: false,
      price: parseInt(newFood.price),
    });

    setNewFood({ name: "", price: "", image: "", category: "" });

    // hiện popup
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000); // ẩn popup sau 2s
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn reset tất cả món ăn về danh sách gốc?")) {
      setFoodItems(food_list.map(f => ({ ...f, soldOut: false })));
      localStorage.setItem(
        "foodItems",
        JSON.stringify(food_list.map(f => ({ ...f, soldOut: false })))
      );
    }
  };

  return (
    <div className="manage-food-container">
      <h1>🍜 Quản lý món ăn</h1>

      {/* Popup thông báo */}
      {showPopup && <div className="popup-success">✅ Thêm món thành công!</div>}

      {/* Form thêm món mới */}
      <div className="add-food-form">
        <h2>Thêm món mới</h2>
        <form onSubmit={handleAddFood}>
          <input
            type="text"
            name="name"
            placeholder="Tên món"
            value={newFood.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={newFood.price}
            onChange={handleChange}
          />
          <select
            name="category"
            value={newFood.category}
            onChange={handleChange}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            name="image"
            placeholder="URL ảnh"
            value={newFood.image}
            onChange={handleChange}
          />
          <button type="submit">Thêm món</button>
        </form>
      </div>

      {/* Nút reset món ăn gốc */}
      <button
        className="reset-btn"
        onClick={handleReset}
        style={{ margin: "20px 0", backgroundColor: "#ff9900", color: "#fff" }}
      >
        Reset món ăn gốc
      </button>

      {/* Bảng danh sách món ăn */}
      <table className="food-table">
        <thead>
          <tr>
            <th>Tên món</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((food) => (
            <tr key={food._id}>
              <td>{food.name}</td>
              <td>{food.price.toLocaleString("vi-VN")} ₫</td>
              <td>{food.category}</td>
              <td>{food.soldOut ? "Hết hàng" : "Còn hàng"}</td>
              <td>
                <button
                  className={`toggle-btn ${food.soldOut ? "soldout" : ""}`}
                  onClick={() => toggleSoldOut(food._id)}
                >
                  {food.soldOut ? "Mở bán lại" : "Đánh dấu hết hàng"}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteFood(food._id)}
                  style={{ marginLeft: "10px", backgroundColor: "#ff4d4d", color: "#fff" }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageFood;
