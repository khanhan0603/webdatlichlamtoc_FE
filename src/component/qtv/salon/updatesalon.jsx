import { useEffect, useState } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateSL() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diachi, setDiachi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= LOAD DETAIL ================= */
  const fetchDetail = async () => {
    try {
      const res = await fetch(`${AppURL.ListChiNhanh}/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Không tìm thấy chi nhánh");

      const data = await res.json();
      const salon = data.data || data;

      setDiachi(salon.diachi || "");
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu");
      navigate("/qlsalon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setDiachi(e.target.value);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diachi.trim()) {
      return toast.error("Vui lòng nhập địa chỉ");
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${AppURL.updatesalon}/${id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ diachi }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("Cập nhật chi nhánh thành công!");
        navigate("/qlsalon");
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
        <h2 style={{ margin: 0 }}>Cập nhật Chi Nhánh</h2>
      </div>

      <div className="branch-form-wrapper">
        <div className="branch-card">
          <div className="form-top-bar">
            <div className="form-icon-circle"></div>
            <div>
              <div className="form-top-title">Thông tin chi nhánh</div>
              <div className="form-top-sub">Chỉnh sửa địa chỉ chi nhánh</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-field-group">
              <label>Địa chỉ chi nhánh</label>
              <div className="input-wrapper">
                <input
                  className="branch-input"
                  type="text"
                  value={diachi}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi nhánh..."
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
                onClick={() => navigate("/qlsalon")}
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