import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { deliveryFee } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";

const PlaceOrder = ({ addOrder }) => {        // ✅ nhận addOrder từ App
  const { getTotalCartAmount, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  // ✅ thêm state lưu email để truyền sang TrackOrder
  const [orderEmail, setOrderEmail] = useState("");

  // Hàm format tiền VNĐ
  const formatVND = (amount) => amount.toLocaleString("vi-VN");

  const handleCheckout = (e) => {
    e.preventDefault();
    if (getTotalCartAmount() === 0) return;

    // ✅ lưu đơn hàng mới
    const newOrder = {
      id: Date.now(),               // mã đơn tạm
      email: orderEmail,
      status: "Đang xử lý"
    };
    addOrder && addOrder(newOrder);  // chỉ gọi nếu prop tồn tại

    setShowPopup(true);              // 👉 Mở popup
    setCartItems({});                // 👉 Xóa giỏ hàng
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");                   // 👉 Về trang chủ
  };

  return (
    <>
      <button className="GoBack" onClick={() => navigate("/cart")}>
        ⬅️ Quay lại giỏ hàng
      </button>

      <form className="place-order" onSubmit={handleCheckout}>
        <div className="place-order-left">
          <h2 className="title">Thông tin giao hàng</h2>
          <div className="multi-fields">
            <input type="text" placeholder="Họ" required />
            <input type="text" placeholder="Tên" required />
          </div>

          {/* ✅ ràng buộc email vào state orderEmail */}
          <input
            type="email"
            placeholder="Địa chỉ email"
            required
            value={orderEmail}
            onChange={(e) => setOrderEmail(e.target.value)}
          />

          <input type="text" placeholder="Địa chỉ" required />
          <div className="multi-fields">
            <input type="text" placeholder="Quận/Huyện" required />
            <input type="text" placeholder="Thành phố" required />
          </div>
          <input
            type="number"
            placeholder="Số điện thoại"
            required
            className="no-spinner"
          />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2 className="title">Tổng giỏ hàng</h2>
            <div>
              <div className="cart-total-details">
                <p>Tạm tính</p>
                <p>{formatVND(getTotalCartAmount())}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Phí giao hàng</p>
                <p>
                  {getTotalCartAmount() === 0 ? "0 " : formatVND(deliveryFee)}
                </p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Tổng cộng</b>
                <b>
                  {getTotalCartAmount() === 0
                    ? "0 "
                    : formatVND(getTotalCartAmount() + deliveryFee)}
                </b>
              </div>
            </div>
            <button type="submit" disabled={getTotalCartAmount() === 0}>
              Tiếp tục thanh toán
            </button>
          </div>
        </div>
      </form>

      {/* ===== POPUP ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🎉 Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng tại FoodFast.</p>
            <button onClick={closePopup}>Đóng</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;
