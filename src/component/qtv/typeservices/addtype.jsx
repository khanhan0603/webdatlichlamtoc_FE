import { useEffect, useState } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ThemType() {
  const [tenloai, setTenLoai] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setTenLoai(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenloai.trim()) {
      return toast.error("Vui lòng nhập tên loại dịch vụ");
    }

    setSubmitting(true);

    try {
      const res = await fetch(AppURL.themldv, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ tenloai }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("Thêm loại dịch vụ thành công!");
        setTenLoai(""); 
        navigate("/qlloaidichvu");
      } else {
        toast.error(data.message || "Thêm thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="main-wrapper">
      <div
        className="main-function"
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
      >
        <div style={{ width: 5, height: 32, background: "#FBA363", borderRadius: 3 }} />
        <h2 style={{ margin: 0 }}>Thêm Loại Dịch Vụ Mới</h2>
      </div>

      <div className="branch-form-wrapper">
        <div className="branch-card">
          <div className="form-top-bar">
            <div className="form-icon-circle"></div>
            <div>
              <div className="form-top-title">Thông tin loại dịch vụ</div>
              <div className="form-top-sub">Nhập tên để tạo loại dịch vụ mới</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-field-group">
              <label>Tên loại dịch vụ</label>
              <div className="input-wrapper">
                <input
                  className="branch-input"
                  type="text"
                  name="tenloai"
                  value={tenloai}
                  onChange={handleChange}
                  placeholder="VD: Cắt tóc, Nhuộm..."
                />
              </div>
            </div>

            <div className="branch-form-footer">
              <button
                type="submit"
                disabled={submitting}
                className="btn-submit-main"
              >
                {submitting ? "Đang thêm..." : "Thêm Loại Dịch Vụ"}
              </button>

              <button
                type="button"
                className="btn-dismiss"
                onClick={() => navigate("/qlloaidichvu")}
              >
                Huỷ
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}