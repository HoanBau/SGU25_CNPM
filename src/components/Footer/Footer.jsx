import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          {/* Thay logo hình ảnh bằng chữ FoodFast */}
          <h1 className="footer-logo-text">FoodFast</h1>

          <p>
            FoodFast tự hào mang đến cho bạn những món ăn nhanh nóng hổi,
            hương vị thơm ngon và đa dạng. Chúng tôi cam kết phục vụ nhanh
            chóng, tiện lợi, giúp bạn tiết kiệm thời gian mà vẫn thưởng thức
            được bữa ăn chất lượng, phù hợp cho nhịp sống năng động và bận rộn
            mỗi ngày.
          </p>
          <div className="footer-social-icons">
            <a href="https://www.facebook.com">
              <img src={assets.facebook_icon} alt="facebook" />
            </a>
            <a href="https://www.twitter.com">
              <img src={assets.twitter_icon} alt="twitter" />
            </a>
            <a href="https://www.linkedin.com">
              <img src={assets.linkedin_icon} alt="linkedin" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>CÔNG TY</h2>
          <ul>
            <li onClick={() => navigate("/")}>Trang chủ</li>
            <li>Giới thiệu</li>
            <li>Giao hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>LIÊN HỆ</h2>
          <ul>
            <li>(028) 38489828</li>
            <li>contact@foodfast.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © foodfast.com
      </p>
    </footer>
  );
};

export default Footer;
