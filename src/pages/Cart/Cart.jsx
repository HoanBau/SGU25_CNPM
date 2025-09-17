import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

// Phí giao hàng: 20.000 VNĐ
export const deliveryFee = 20000;

// Hàm định dạng số tiền (chỉ hiển thị số, có dấu chấm phân cách nghìn)
const formatVND = (amount) => {
  return amount.toLocaleString("vi-VN"); // ví dụ: 20.000
};

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
  } = useContext(StoreContext);

  const tongSoLuong = getTotalQuantity();
  const navigate = useNavigate();

  // Giả sử giá sản phẩm đã tính bằng VNĐ
  const tongTienHang = getTotalCartAmount();

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
          food_list.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <React.Fragment key={item._id}>
                  <div
                    className="cart-items-title cart-items-item"
                    key={item._id}
                  >
                    <img src={item.image} alt="ảnh món ăn" />
                    <p>{item.name}</p>
                    <p>{formatVND(item.price)}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>{formatVND(item.price * cartItems[item._id])}</p>
                    <p
                      className="Remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <img
                        src={assets.remove_icon_cross}
                        alt="biểu tượng xóa"
                      />
                    </p>
                  </div>
                  <hr key={`hr-${item._id}-${index}`} />
                </React.Fragment>
              );
            }
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
              <p>
                {tongTienHang === 0 ? formatVND(0) : formatVND(deliveryFee)}
              </p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>
                {tongTienHang === 0
                  ? formatVND(0)
                  : formatVND(tongTienHang + deliveryFee)}
              </b>
            </div>
          </div>
          <button
            disabled={tongTienHang === 0}
            onClick={() => navigate("/order")}
          >
            TIẾN HÀNH ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
