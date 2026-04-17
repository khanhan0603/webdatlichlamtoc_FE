import { useEffect, useState } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateLDV() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenloai, setTenLoai] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");



  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setTenLoai(e.target.value);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenloai.trim()) {
      return toast.error("Vui lòng nhập địa chỉ");
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${AppURL.updateldv}/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ tenloai }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("Cập nhật loại dịch vụ thành công!");
        navigate("/qlloaidichvu");
      } else {
        toast.error(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Đang tải...</div>;
  }

  return (
    <main className="main-wrapper">
      <div
        className="main-function"
        style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
      >
        <div style={{ width: 5, height: 32, background: "#FBA363", borderRadius: 3 }} />
        <h2 style={{ margin: 0 }}>Cập nhật loại dịch vụ</h2>
      </div>

      <div className="branch-form-wrapper">
        <div className="branch-card">
          <div className="form-top-bar">
            <div className="form-icon-circle"></div>
            <div>
              <div className="form-top-title">Thông tin loại dịch vụ</div>
              <div className="form-top-sub">Chỉnh sửa thông tin loại dịch vụ</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-field-group">
              <label>Tên loại dịch vụ</label>
              <div className="input-wrapper">
                <input
                  className="branch-input"
                  type="text"
                  value={tenloai}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="branch-form-footer">
              <button
                type="submit"
                disabled={submitting}
                className="btn-submit-main"
              >
                {submitting ? "Đang cập nhật..." : "Cập nhật"}
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