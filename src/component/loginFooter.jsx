import { useNavigate } from "react-router-dom";

export default function FooterLogin() {
  const navigate = useNavigate();

  const goToUserLogin = () => {
    navigate("/loginuser");
  };

  const goToAdminLogin = () => {
    navigate("/login");
  };

  return (
    <div id="landing-footer">
      <div className="footer-container">
        
        <div className="login-type-buttons">
          <button 
            id="user-login-btn"
            className="login-type-btn user-btn active"
            onClick={goToUserLogin}
          >
            👤 KHÁCH HÀNG
          </button>

          <button 
            id="admin-login-btn"
            className="login-type-btn admin-btn"
            onClick={goToAdminLogin}
          >
            ⚙️ QUẢN TRỊ VIÊN
          </button>
        </div>
      </div>
    </div>
  );
}