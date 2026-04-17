import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterLogin from "../loginFooter";
import { login } from "../../services/authService";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setLoading(true);

    // Lấy giá trị trực tiếp từ state
    const emailValue = email;
    const passwordValue = matkhau;
    
    console.log("=== FORM DATA ===");
    console.log("Email state:", emailValue);
    console.log("Password state:", passwordValue);
    console.log("Type of password:", typeof passwordValue);
    console.log("Length of password:", passwordValue?.length);

    const errors = [];
    if (!emailValue) errors.push("Vui lòng nhập email.");
    if (!passwordValue) errors.push("Vui lòng nhập mật khẩu.");

    if (errors.length > 0) {
      setErrorMessages(errors);
      setLoading(false);
      return;
    }

    try {
      // Gửi trực tiếp với password
      const res = await login({ 
        email: emailValue, 
        matkhau: passwordValue 
      });

      console.log("Login response:", res);

      const user = res?.user || res?.data?.user;
      const token = res?.token || res?.access_token || res?.data?.token;

      if (!user || !token) {
        throw new Error("API trả về dữ liệu không đúng cấu trúc");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role?.toLowerCase?.()?.trim() || "";

      toast.success("Đăng nhập thành công!");

      if (role === "admin") {
        navigate("/qlsalon");
      } else if (role === "staff") {
        navigate("/staff");
      } else {
        toast.error("Bạn không có quyền truy cập!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/loginadmin");
      }
      
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      
      if (err.response?.status === 422) {
        const errorData = err.response.data;
        console.log("Error details 422:", errorData);
        
        if (errorData?.message) {
          setErrorMessages([errorData.message]);
        } else if (errorData?.errors) {
          const errorList = Object.values(errorData.errors).flat();
          setErrorMessages(errorList);
        } else {
          setErrorMessages(["Email hoặc mật khẩu không đúng"]);
        }
      } else if (err.response?.data?.message) {
        setErrorMessages([err.response.data.message]);
      } else {
        setErrorMessages(["Sai email hoặc mật khẩu!"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="landing-all">
        <div id="login-admin">
          <div className="login-card">
            <h2>ADMIN LOGIN</h2>
            <p className="subtitle">Đăng nhập dành cho Admin & Staff</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <label htmlFor="matkhau">Mật khẩu</label>
                <div className="password-wrapper">
                  <input
                    id="matkhau"
                    type={showPassword ? "text" : "password"}
                    value={matkhau}
                    onChange={(e) => {
                      console.log("Password changed:", e.target.value);
                      setMatkhau(e.target.value);
                    }}
                    placeholder="Nhập mật khẩu"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {errorMessages.length > 0 && (
                <div className="error-messages">
                  <ul>
                    {errorMessages.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </button>
            </form>

            <div className="forgot-password">
              <a href="/forgot-password">Quên mật khẩu?</a>
            </div>

            <div className="register-link">
              Quay về trang người dùng?{" "}
              <a href="/loginuser">User Login</a>
            </div>
          </div>
        </div>

        <FooterLogin />
      </div>
    </>
  );
}