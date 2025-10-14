import React, { useState, useEffect } from "react";
import "./TrackOrder.css";

const TrackOrder = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [result, setResult] = useState(null);

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const storedFoodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
    setOrders(storedOrders);
    setFoodItems(storedFoodItems);
  }, []);

  const handleCheck = () => {
    const foundOrders = orders.filter((order) => order.email === email);
    setResult(foundOrders);
  };

  const formatVND = (amount) => amount.toLocaleString("vi-VN");

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

      {result && (
        <div className="trackorder-result">
          {result.length > 0 ? (
            <>
              <h3>Đơn hàng của bạn:</h3>
              {result.map((o, i) => {
                // Chuyển object items sang array
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
                      <b>Mã đơn:</b> {o.id} – <b>Trạng thái:</b> {o.status}
                    </p>

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
                      {itemsArray.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                    <hr />
                  </div>
                );
              })}
            </>
          ) : (
            <p>Không tìm thấy đơn hàng nào với email này.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
