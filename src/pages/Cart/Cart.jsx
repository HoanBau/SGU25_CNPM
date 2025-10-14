import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

// Phí giao hàng: 20.000 VNĐ
export const deliveryFee = 20000;

// Giảm giá cố định
const DISCOUNT_CODE = "DISCOUNT";
const DISCOUNT_VALUE = 15000;

// Hàm định dạng số tiền
const formatVND = (amount) => amount.toLocaleString("vi-VN");

const Cart = () => {
  const {
    cartItems,
    foodItems,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    getTotalQuantity,
  } = useContext(StoreContext);

  const tongSoLuong = getTotalQuantity();
  const navigate = useNavigate();
  const tongTienHang = getTotalCartAmount();

  // State mã giảm giá
  const [code, setCode] = useState("");
  const [validDiscount, setValidDiscount] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Áp dụng mã giảm giá
  const handleApplyCode = () => {
    if (code.trim().toUpperCase() === DISCOUNT_CODE) {
      setValidDiscount(true);
      setErrorMsg("");
      localStorage.setItem("discount", DISCOUNT_VALUE);
    } else {
      setValidDiscount(false);
      setErrorMsg("❌ Mã khuyến mãi không hợp lệ");
      localStorage.removeItem("discount");
    }
  };

  // Tính tổng cộng sau giảm
  const tongCong =
    tongTienHang === 0
      ? 0
      : tongTienHang + deliveryFee - (validDiscount ? DISCOUNT_VALUE : 0);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title cart-heading">
          <p>Sản phẩm</p>
          <p>Tên món</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tạm tính</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {tongSoLuong === 0 ? (
          <p className="NoItems">Không có sản phẩm trong giỏ hàng</p>
        ) : (
          foodItems?.map((item) => {
            if (!cartItems[item._id] || cartItems[item._id] === 0) return null;

            return (
              <React.Fragment key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{formatVND(item.price)}</p>

                  {/* ✅ Counter đẹp và hiển thị soldOut */}
                  <p>
                    {item.soldOut ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Đã hết hàng
                      </span>
                    ) : (
                      <div className="cart-counter">
  
                        <span className="counter-number">
                          {cartItems[item._id]}
                        </span>
                        <button
                          className="counter-btn"
                          onClick={() => addToCart(item._id)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </p>

                  <p>{formatVND(item.price * cartItems[item._id])}</p>

                  <p className="Remove">
                    <img
                      src={assets.remove_icon_cross}
                      alt="xóa"
                      onClick={() => removeFromCart(item._id)}
                    />
                  </p>
                </div>
                <hr />
              </React.Fragment>
            );
          })
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng thanh toán</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng tiền hàng</p>
              <p>{formatVND(tongTienHang)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{tongTienHang === 0 ? formatVND(0) : formatVND(deliveryFee)}</p>
            </div>
            <hr />
            <div className="cart-discount-box">
              <input
                type="text"
                value={code}
                placeholder="Nhập mã giảm giá..."
                onChange={(e) => setCode(e.target.value)}
                className="discount-input"
              />
              <button onClick={handleApplyCode} className="discount-btn">
                Áp dụng
              </button>
            </div>

            {errorMsg && <p className="discount-error">{errorMsg}</p>}
            {validDiscount && (
              <p className="discount-success">
                ✅ Giảm {formatVND(DISCOUNT_VALUE)} VNĐ
              </p>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{formatVND(tongCong)}</b>
            </div>
          </div>
          <button disabled={tongTienHang === 0} onClick={() => navigate("/order")}>
            TIẾN HÀNH ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
