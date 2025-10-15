import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <div className="header-contents">
        <h2>Đặt món yêu thích của bạn tại đây</h2>
        <p>
          
Lựa chọn từ thực đơn đa dạng với hàng loạt món ăn hấp dẫn được chế biến từ nguyên liệu hảo hạng và chuyên môn ẩm thực cao cấp. Sứ mệnh của chúng tôi là thỏa mãn cơn thèm ăn và nâng tầm trải nghiệm ẩm thực của bạn, từng bữa ăn ngon miệng.
        </p>
        <a href="#explore-menu">
          <button>View Menu</button>
        </a>
      </div>
    </header>
  );
};

export default Header;
