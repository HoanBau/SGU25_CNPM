// src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { deliveryFee } from "../Cart/Cart";
import { useNavigate } from "react-router-dom";
import { Truck, Smartphone, CreditCard } from "lucide-react";

const PlaceOrder = ({ addOrder }) => {
  const { getTotalCartAmount, setCartItems, cartItems, user, setUser, foodItems } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showPopup, setShowPopup] = useState(false);

  // NEW: QR modal / pending order
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [pendingOrder, setPendingOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    district: "",
    phone: "",
    note: "",
  });

  const discount = Number(localStorage.getItem("discount")) || 0;

  const subtotal = getTotalCartAmount();
  const shipping = subtotal === 0 ? 0 : deliveryFee;
  const total = subtotal === 0 ? 0 : subtotal + shipping - discount;

  const formatVND = (amount) => amount.toLocaleString("vi-VN") + "đ";

  // ✅ Lấy thông tin người dùng
  useEffect(() => {
    let storedUser = user;
    if (!storedUser) {
      const saved = localStorage.getItem("user");
      if (saved) {
        storedUser = JSON.parse(saved);
        setUser(storedUser);
      }
    }
    if (storedUser) {
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        address: storedUser.address || "",
        city: storedUser.city || "",
        district: storedUser.district || "",
        phone: storedUser.phone || "",
        note: "",
      });
    }
  }, [user, setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // create simple QR image URL (uses qrserver.com)
  const createQrForPayment = ({ method, amount, orderId, info }) => {
    const payload = JSON.stringify({
      method,
      amount,
      orderId,
      name: info.name,
      phone: info.phone,
      note: info.note,
    });
    const data = encodeURIComponent(payload);
    // size can be adjusted, here 300x300
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}`;
  };

  const finalizeOrder = (order) => {
    addOrder && addOrder(order);
    setCartItems({});
    localStorage.removeItem("discount");

    const updatedUser = { ...(user || {}), ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // show success popup
    setShowQRModal(false);
    setPendingOrder(null);
    setShowPopup(true);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (subtotal === 0) return;

    const newOrder = {
      id: Date.now(),
      email: formData.email,
      status: "order",
      items: { ...cartItems },
      totalAmount: total,
      paymentMethod,
      date: new Date().toISOString(),
      info: formData,
    };

    // If COD -> create order immediately
    if (paymentMethod === "COD") {
      finalizeOrder(newOrder);
      return;
    }

    // For MOMO / VNPAY -> open QR modal with generated qrUrl and keep order pending
    const qr = createQrForPayment({
      method: paymentMethod,
      amount: total,
      orderId: newOrder.id,
      info: formData,
    });
    setQrUrl(qr);
    setPendingOrder(newOrder);
    setShowQRModal(true);
  };

  // Simulate user scanned & completed payment
  const handleSimulatePaymentSuccess = () => {
    if (!pendingOrder) return;
    // mark as paid
    const paidOrder = { ...pendingOrder, status: "paid", paidAt: new Date().toISOString() };
    finalizeOrder(paidOrder);
    // optionally navigate to orders or home
    // navigate("/orders");
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div className="checkout-container">
      <form className="checkout-form" onSubmit={handleCheckout}>
        {/* LEFT */}
        <div className="checkout-left">
          <h3>Thông tin người nhận hàng:</h3>
          <div className="info-box">
            <label>Tên khách hàng:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Thành phố:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="VD: TP. Hồ Chí Minh"
              required
            />

            <label>Quận/Huyện:</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="VD: Quận 1"
              required
            />

            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="VD: 123 Nguyễn Huệ"
              required
            />

            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Ghi chú:</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Nhập ghi chú cho người bán..."
            />
          </div>

          <div className="payment-methods">
            <h3>Phương thức thanh toán:</h3>

            <label className={`method-option ${paymentMethod === "COD" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Truck size={22} />
              <div>
                <b>COD</b>
                <p>Thanh toán khi nhận hàng</p>
              </div>
            </label>

            <label className={`method-option ${paymentMethod === "MOMO" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="MOMO"
                checked={paymentMethod === "MOMO"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <Smartphone size={22} />
              <div>
                <b>MOMO</b>
                <p>Thanh toán qua ví MOMO (hiện mã QR giả lập)</p>
              </div>
            </label>

            <label className={`method-option ${paymentMethod === "VNPAY" ? "active" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <CreditCard size={22} />
              <div>
                <b>VNPAY</b>
                <p>Thanh toán qua VNPAY (hiện mã QR giả lập)</p>
              </div>
            </label>
          </div>
        </div>

        {/* RIGHT */}
        <div className="checkout-right">
          <h3>Tổng giỏ hàng</h3>

          {Object.entries(cartItems).map(([id, qty]) => {
            const item = foodItems.find((f) => f._id === id);
            if (!item) return null;
            return (
              <div key={id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <p>{item.name}</p>
                  <small>
                    {qty} × {formatVND(item.price)}
                  </small>
                </div>
                <p className="item-price">{formatVND(item.price * qty)}</p>
              </div>
            );
          })}

          <hr />
          <div className="cart-summary">
            <p>Tạm tính:</p>
            <span>{formatVND(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="cart-summary">
              <p>Giảm giá:</p>
              <span>-{formatVND(discount)}</span>
            </div>
          )}
          <div className="cart-summary">
            <p>Phí vận chuyển:</p>
            <span>{shipping === 0 ? "Miễn phí" : formatVND(shipping)}</span>
          </div>
          <hr />
          <div className="cart-summary total">
            <b>Tổng tiền phải thanh toán:</b>
            <b>{formatVND(total)}</b>
          </div>

          <button type="submit" className="submit-btn">
            Đặt hàng
          </button>
        </div>
      </form>

      {/* Success popup for COD or after simulated payment */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🎉 Đặt hàng thành công!</h2>
            <p>Cảm ơn bạn đã mua hàng tại FoodFast.</p>
            <button onClick={closePopup}>Đóng</button>
          </div>
        </div>
      )}

      {/* QR Modal for MOMO / VNPAY */}
      {showQRModal && (
        <div className="popup-overlay">
          <div className="popup qr-popup">
            <h2>Thanh toán bằng {paymentMethod}</h2>
            <p>Quét mã QR bên dưới bằng ứng dụng ví để thanh toán (giả lập)</p>
            <div style={{ textAlign: "center", margin: "12px 0" }}>
              <img src={qrUrl} alt="QR Payment" style={{ width: 300, height: 300 }} />
            </div>
            <p>
              Số tiền: <b>{formatVND(total)}</b>
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              <button onClick={handleSimulatePaymentSuccess}>Thanh toán xong (giả lập)</button>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setPendingOrder(null);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
