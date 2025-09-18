import React, { useState } from "react";
import "./TrackOrder.css";

const TrackOrder = ({ orders }) => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const foundOrders = orders.filter((order) => order.email === email);
    setResult(foundOrders);
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

      {result && (
        <div className="trackorder-result">
          {result.length > 0 ? (
            <>
              <h3>Đơn hàng của bạn:</h3>
              <ul>
                {result.map((o, i) => (
                  <li key={i}>
                    <b>Mã đơn:</b> {o.id} – <b>Trạng thái:</b> {o.status}
                  </li>
                ))}
              </ul>
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
