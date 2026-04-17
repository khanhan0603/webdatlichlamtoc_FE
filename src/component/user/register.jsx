import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterLogin from "../loginFooter";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function RegisterUser() {
  const navigate = useNavigate();

  const API = "https://webdatlichlamtoc.id.vn/api/users";

  const [form, setForm] = useState({
    hoten: "",
    email: "",
    sodienthoai: "",
    matkhau: "",
    confirmMatkhau: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessages([]);
    setLoading(true);

    const errors = [];

    if (!form.hoten.trim()) errors.push("Vui lòng nhập họ tên.");
    if (!form.email.trim()) errors.push("Vui lòng nhập email.");
    if (!form.matkhau) errors.push("Vui lòng nhập mật khẩu.");
    if (form.matkhau && form.matkhau.length < 6)
      errors.push("Mật khẩu phải từ 6 ký tự.");
    if (form.matkhau !== form.confirmMatkhau)
      errors.push("Mật khẩu không khớp.");

    if (errors.length > 0) {
      setErrorMessages(errors);
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API}/register`, {
        hoten: form.hoten,
        email: form.email,
        sodienthoai: form.sodienthoai,
        matkhau: form.matkhau,
      });

      toast.success("Đăng ký thành công!");

      setForm({
        hoten: "",
        email: "",
        sodienthoai: "",
        matkhau: "",
        confirmMatkhau: "",
      });

      navigate("/login");
    } catch (err) {
      console.log(err);

      if (err.response?.data?.errors) {
        const serverErrors = Object.values(
          err.response.data.errors
        ).flat();
        setErrorMessages(serverErrors);
      } else if (err.response?.data?.error) {
        setErrorMessages([err.response.data.error]);
      } else {
        setErrorMessages(["Đăng ký thất bại!"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="landing-all">
      <div id="login-user">
        <div className="login-card">
          <h2>REGISTER</h2>
          <p className="subtitle">Tạo tài khoản mới</p>

          <form onSubmit={handleRegister}>
            {/* HỌ TÊN */}
            <div className="input-group">
              <label>Họ tên</label>
              <input
                name="hoten"
                value={form.hoten}
                onChange={handleChange}
                placeholder="Nhập họ tên"
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </div>

            {/* SỐ ĐIỆN THOẠI */}
            <div className="input-group">
              <label>Số điện thoại</label>
              <input
                name="sodienthoai"
                value={form.sodienthoai}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  name="matkhau"
                  type={showPassword ? "text" : "password"}
                  value={form.matkhau}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label>Xác nhận mật khẩu</label>
              <div className="password-wrapper">
                <input
                  name="confirmMatkhau"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmMatkhau}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                >
                  {showConfirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* ERRORS */}
            {errorMessages.length > 0 && (
              <div className="error-messages">
                <ul>
                  {errorMessages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
            </button>
          </form>

          <div className="register-link">
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </div>
      </div>

      <FooterLogin />
    </div>
  );
}