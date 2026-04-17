// import { useState } from "react";
// import FooterLogin from "../loginFooter";
// import { login } from "../../services/authService";
// import { toast } from "react-toastify";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginUser() {
//   const [email, setEmail] = useState("");
//   const [matkhau, setMatkhau] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessages, setErrorMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMessages([]);
//     setLoading(true);

//     const errors = [];
//     if (!email) errors.push("Vui lòng nhập email.");
//     if (!matkhau) errors.push("Vui lòng nhập mật khẩu.");

//     if (errors.length > 0) {
//       setErrorMessages(errors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await login({ email, matkhau });

//       console.log("LOGIN RESPONSE:", res);

//       const user = res?.user;
//       const token = res?.token || res?.access_token;

//       if (!user || !token) {
//         throw new Error("API không trả token hoặc user");
//       }

//       // lưu localStorage (domain hiện tại)
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("token", token);

//       console.log("TOKEN SAVED:", token);

//       toast.success("Đăng nhập thành công!");

      
//       setTimeout(() => {
//         window.location.href = `https://datlichlamtoc.id.vn/index.html?token=${token}`;
//       }, 500);

//     } catch (err) {
//       console.error("Lỗi đăng nhập:", err);

//       if (err.response?.data?.errors) {
//         const serverErrors = Object.values(err.response.data.errors).flat();
//         setErrorMessages(serverErrors);
//       } else if (err.response?.data?.error) {
//         setErrorMessages([err.response.data.error]);
//       } else if (err.message) {
//         setErrorMessages([err.message]);
//       } else {
//         setErrorMessages(["Sai email hoặc mật khẩu!"]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div id="landing-all">
//       <div id="login-user">
//         <div className="login-card">
//           <h2>USER LOGIN</h2>
//           <p className="subtitle">Chào mừng bạn quay trở lại</p>

//           <form onSubmit={handleLogin}>
//             <div className="input-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Nhập email"
//               />
//             </div>

//             <div className="input-group">
//               <label>Mật khẩu</label>
//               <div className="password-wrapper">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={matkhau}
//                   onChange={(e) => setMatkhau(e.target.value)}
//                   placeholder="Nhập mật khẩu"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             {errorMessages.length > 0 && (
//               <div className="error-messages">
//                 <ul>
//                   {errorMessages.map((msg, idx) => (
//                     <li key={idx}>{msg}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <button type="submit" disabled={loading}>
//               {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
//             </button>
//           </form>

//           <div className="forgot-password">
//             <a href="/forgot-password">Quên mật khẩu?</a>
//           </div>

//           <div className="register-link">
//             Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
//           </div>
//         </div>
//       </div>

//       <FooterLogin />
//     </div>
//   );
// }

import { useState } from "react";
import FooterLogin from "../loginFooter";
import { login } from "../../services/authService";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function LoginUser() {
  const [email, setEmail] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setLoading(true);

    const errors = [];
    if (!email) errors.push("Vui lòng nhập email.");
    if (!matkhau) errors.push("Vui lòng nhập mật khẩu.");

    if (errors.length > 0) {
      setErrorMessages(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await login({ email, matkhau });

      console.log("LOGIN RESPONSE:", res);

      const user = res?.user;
      const token = res?.token || res?.access_token;

      if (!user || !token) {
        throw new Error("API không trả token hoặc user");
      }

      // Lưu localStorage (domain hiện tại - trang login)
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      console.log("TOKEN SAVED:", token);
      console.log("USER SAVED:", user);

      toast.success("Đăng nhập thành công!");

      // Mã hóa dữ liệu trước khi gửi lên URL
      const encodedToken = encodeURIComponent(token);
      const encodedUser = encodeURIComponent(JSON.stringify(user));

      // Chuyển hướng sang trang home kèm token và user
      // DOMAIN ĐÍCH: https://datlichlamtoc.id.vn
      setTimeout(() => {
        window.location.href = `https://datlichlamtoc.id.vn/index.html?token=${encodedToken}&user=${encodedUser}`;
      }, 500);

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);

      if (err.response?.data?.errors) {
        const serverErrors = Object.values(err.response.data.errors).flat();
        setErrorMessages(serverErrors);
      } else if (err.response?.data?.error) {
        setErrorMessages([err.response.data.error]);
      } else if (err.message) {
        setErrorMessages([err.message]);
      } else {
        setErrorMessages(["Sai email hoặc mật khẩu!"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="landing-all">
      <div id="login-user">
        <div className="login-card">
          <h2>USER LOGIN</h2>
          <p className="subtitle">Chào mừng bạn quay trở lại</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={matkhau}
                  onChange={(e) => setMatkhau(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="password-toggle"
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

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          <div className="forgot-password">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>

          <div className="register-link">
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>
        </div>
      </div>

      <FooterLogin />
    </div>
  );
}