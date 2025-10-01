import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { deliveryFee } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";

const PlaceOrder = ({ addOrder }) => {        // ✅ nhận addOrder từ App
  const { getTotalCartAmount, setCartItems, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [orderEmail, setOrderEmail] = useState(""); // email user

  const discount = Number(localStorage.getItem("discount")) || 0;

  const formatVND = (amount) => amount.toLocaleString("vi-VN");

  const subtotal = getTotalCartAmount();
  const shipping = subtotal === 0 ? 0 : deliveryFee;
  const total = subtotal === 0 ? 0 : subtotal + shipping - discount;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (subtotal === 0) return;

    // ✅ tạo đơn hàng mới đầy đủ thông tin để Admin dùng
    const newOrder = {
      id: Date.now(),               
      email: orderEmail,
      status: "Đang xử lý",
      items: { ...cartItems },    // giỏ hàng
      totalAmount: total          // tổng tiền
    };

    addOrder && addOrder(newOrder);  // gửi dữ liệu lên App (Admin sẽ nhận)
    setShowPopup(true);
    setCartItems({});                
    localStorage.removeItem("discount");
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");
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
                <p>{formatVND(subtotal)}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Phí giao hàng</p>
                <p>{formatVND(shipping)}</p>
              </div>
              <hr />
              {discount > 0 && (
                <>
                  <div className="cart-total-details">
                    <p>Giảm giá</p>
                    <p>-{formatVND(discount)}</p>
                  </div>
                  <hr />
                </>
              )}
              <div className="cart-total-details">
                <b>Tổng cộng</b>
                <b>{formatVND(total)}</b>
              </div>
            </div>
            <button type="submit" disabled={subtotal === 0}>
              Tiếp tục thanh toán
            </button>
          </div>
        </div>
      </form>

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
