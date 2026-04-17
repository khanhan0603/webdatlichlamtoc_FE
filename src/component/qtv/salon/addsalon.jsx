import { useEffect, useState } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ThemSL() {
  const [diachi, setDiachi] = useState("");
  const [salons, setSalons] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setDiachi(e.target.value);
  };

  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diachi.trim()) {
      return toast.error("Vui lòng nhập địa chỉ");
    }

    setSubmitting(true);

    try {
      const res = await fetch(AppURL.themSalon, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ diachi }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("Thêm chi nhánh thành công!");
        setDiachi("");
        fetchSalons();
        navigate('/qlsalon')
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

  const fetchSalons = async () => {
    try {
      const res = await fetch(AppURL.ListChiNhanh);
      const data = await res.json();
      setSalons(Array.isArray(data.data) ? data.data : data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách chi nhánh");
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  return (
  <main className="main-wrapper">
    <div className="main-function" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <div style={{ width: 5, height: 32, background: '#FBA363', borderRadius: 3 }} />
      <h2 style={{ margin: 0 }}>Thêm Chi Nhánh Mới</h2>
    </div>

    <div className="branch-form-wrapper">
      <div className="branch-card">
        <div className="form-top-bar">
          <div className="form-icon-circle">
            {/* icon location svg */}
          </div>
          <div>
            <div className="form-top-title">Thông tin chi nhánh</div>
            <div className="form-top-sub">Điền địa chỉ để tạo chi nhánh mới</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label>Địa chỉ chi nhánh</label>
            <div className="input-wrapper">
              {/* icon svg */}
              <input
                className="branch-input"
                type="text"
                name="diachi"
                value={diachi}
                onChange={handleChange}
                placeholder="Nhập địa chỉ chi nhánh..."
              />
            </div>
          </div>

          <div className="branch-form-footer">
            <button type="submit" disabled={submitting} className="btn-submit-main">
              {submitting ? "Đang thêm..." : "Thêm Chi Nhánh"}
            </button>
            <button type="button" className="btn-dismiss">Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  </main>

  );
}