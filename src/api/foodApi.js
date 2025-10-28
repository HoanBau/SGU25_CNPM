// src/api/foodApi.js
// ✅ File API trung gian cho cả User và Admin

const API_URL = "http://localhost:5000/api"; // sau này BE thật sẽ dùng URL này

// ======================
// 📦 API CHO NGƯỜI DÙNG
// ======================

// Lấy danh sách món ăn
export async function getFoods() {
  // 🧠 sau này BE thật sẽ trả về danh sách món ăn
  // Tạm thời ta mô phỏng bằng localStorage
  const stored = localStorage.getItem("foodItems");
  if (stored) return JSON.parse(stored);
  return []; // nếu chưa có dữ liệu
}

// Lấy 1 món cụ thể theo ID
export async function getFoodById(id) {
  const foods = await getFoods();
  return foods.find(f => f._id === id);
}


// ======================
// 🧑‍💼 API CHO ADMIN
// ======================

// Thêm món ăn mới
export async function addFoodApi(newFood) {
  const foods = await getFoods();
  const updated = [...foods, newFood];
  localStorage.setItem("foodItems", JSON.stringify(updated));
  return { success: true, message: "Đã thêm món mới!", data: newFood };
}

// Cập nhật trạng thái hết hàng
export async function toggleSoldOutApi(id) {
  const foods = await getFoods();
  const updated = foods.map(f =>
    f._id === id ? { ...f, soldOut: !f.soldOut } : f
  );
  localStorage.setItem("foodItems", JSON.stringify(updated));
  return { success: true, message: "Đã thay đổi trạng thái!", data: updated };
}

// Xóa món ăn
export async function deleteFoodApi(id) {
  const foods = await getFoods();
  const updated = foods.filter(f => f._id !== id);
  localStorage.setItem("foodItems", JSON.stringify(updated));
  return { success: true, message: "Đã xóa món ăn!", data: updated };
}
