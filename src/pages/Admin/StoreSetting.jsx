import React, { useState } from "react";
import "./StoreSetting.css";

const StoreSetting = () => {
  const [store, setStore] = useState({
    name: "Nhà hàng Món Việt",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    phone: "0909123456",
    description: "Chuyên phục vụ món Việt truyền thống",
    openTime: "08:00",
    closeTime: "22:00",
    isOpen: true,
    avatar: "https://via.placeholder.com/120x120.png?text=Store+Avatar",
  });

  const [toast, setToast] = useState("");
  const [closeRequest, setCloseRequest] = useState(null); // thông tin yêu cầu đóng quán
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("active"); // active | pending | closed

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prev) => ({ ...prev, [name]: value }));
  };

  const toggleOpen = () => {
    setStore((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleSave = () => {
    setToast("✅ Thông tin quán đã được lưu (mock)");
    setTimeout(() => setToast(""), 3000);
  };

  // 🧩 Mở modal nhập lý do đóng quán
  const handleCloseRequest = () => {
    setShowReasonModal(true);
  };

  // 🧩 Gửi yêu cầu đóng quán (giống POST /close-request)
  const submitCloseRequest = () => {
    if (!reason.trim()) {
      setToast("⚠️ Vui lòng nhập lý do đóng quán!");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    const request = {
      reason,
      requestedBy: "owner",
      requestedAt: new Date().toISOString(),
    };

    setCloseRequest(request);
    setStatus("pending"); // đang chờ admin duyệt
    setShowReasonModal(false);
    setReason("");

    setToast("📨 Yêu cầu đóng quán đã được gửi. Đang chờ admin duyệt...");
    setTimeout(() => setToast(""), 4000);
  };

  // 🧩 Mô phỏng admin duyệt (PATCH /status = closed)
  const simulateAdminApprove = () => {
    if (status === "pending") {
      setStatus("closed");
      setToast("💀 Admin đã duyệt. Quán chính thức bị đóng vĩnh viễn!");
      setTimeout(() => setToast(""), 4000);
    }
  };

  // 🔒 Nếu quán đã bị đóng vĩnh viễn
  if (status === "closed") {
    return (
      <div className="store-setting">
        <h2>⚙️ Cài đặt quán</h2>
        <div className="deactivated-box">
          <p>Quán này đã bị đóng vĩnh viễn và không còn hiển thị trên hệ thống.</p>
          <p>Lý do: {closeRequest?.reason}</p>
          <p>
            Ngày đóng:{" "}
            {new Date(closeRequest?.requestedAt).toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="store-setting">
      <h2>⚙️ Cài đặt quán</h2>
      <p className="hint">
        Cho phép chủ quán cập nhật thông tin hiển thị và hoạt động của quán.
      </p>

      {toast && <div className="toast">{toast}</div>}

      {/* Nếu quán đang chờ duyệt */}
      {status === "pending" && (
        <div className="pending-box">
          ⏳ Yêu cầu đóng quán đang chờ admin phê duyệt...
          <button className="approve-btn" onClick={simulateAdminApprove}>
            (Giả lập admin duyệt)
          </button>
        </div>
      )}

      {/* Form cũ */}
      <div className="form-group">
        <label>Tên quán:</label>
        <input
          type="text"
          name="name"
          value={store.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Địa chỉ:</label>
        <input
          type="text"
          name="address"
          value={store.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={store.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Mô tả:</label>
        <textarea
          name="description"
          value={store.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="time-row">
        <div>
          <label>Giờ mở cửa:</label>
          <input
            type="time"
            name="openTime"
            value={store.openTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Giờ đóng cửa:</label>
          <input
            type="time"
            name="closeTime"
            value={store.closeTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="status-row">
        <label>Trạng thái quán:</label>
        <button
          className={store.isOpen ? "btn-open" : "btn-close"}
          onClick={toggleOpen}
        >
          {store.isOpen ? "🟢 Đang mở cửa" : "🔴 Đang đóng cửa"}
        </button>
      </div>

      <div className="form-group">
        <label>Ảnh đại diện quán:</label>
        <div className="avatar-box">
          <img src={store.avatar} alt="avatar" />
          <input
            type="text"
            name="avatar"
            value={store.avatar}
            onChange={handleChange}
            placeholder="Dán link ảnh mới..."
          />
        </div>
      </div>

      <button className="save-btn" onClick={handleSave}>
        💾 Lưu thay đổi
      </button>

      {/* ✅ Nút gửi yêu cầu đóng quán */}
      <button className="deactivate-btn" onClick={handleCloseRequest}>
         Gửi yêu cầu đóng quán
      </button>

      {/* ✅ Modal nhập lý do */}
      {showReasonModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>💬 Nhập lý do đóng quán</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Doanh thu thấp, tạm ngừng hoạt động..."
            ></textarea>
            <div className="modal-buttons">
              <button onClick={submitCloseRequest}>Gửi yêu cầu</button>
              <button onClick={() => setShowReasonModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSetting;
