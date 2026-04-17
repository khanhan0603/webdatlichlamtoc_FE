import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppURL from "../../../api/AppURL";

const BASE = "https://webdatlichlamtoc.id.vn/api";

export default function UpdateNV() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hoten: "",
    mota: "",
    id_salon: "",
    link_anh: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // ===== LOAD SALONS =====
  const fetchSalons = async () => {
    try {
      const res = await fetch(AppURL.ListChiNhanh);
      const data = await res.json();
      setSalons(data.data || data);
    } catch (err) {
      toast.error("Không thể tải danh sách chi nhánh");
    }
  };

  // ===== LOAD DETAIL =====
  const fetchDetail = async () => {
    try {
      const res = await fetch(`${BASE}/hair-styles`);
      const data = await res.json();

      const staff = (data.data || []).find((x) => x.id === id);
      if (!staff) throw new Error("Không tìm thấy dữ liệu");

      setFormData({
        hoten: staff.hoten,
        mota: staff.mota,
        id_salon: staff.id_salon,
        link_anh: staff.link_anh,
      });

      setImagePreview(staff.link_anh);
    } catch (err) {
      toast.error(err.message);
      navigate("/qlnvtv");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
    fetchDetail();
  }, [id]);

  // ===== CHANGE TEXT =====
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===== CHANGE IMAGE =====
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hoten || !formData.mota || !formData.id_salon) {
      return toast.error("Thiếu thông tin");
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("hoten", formData.hoten);
      form.append("mota", formData.mota);
      form.append("id_salon", formData.id_salon);

      // nếu có ảnh mới thì update
      if (imageFile) {
        form.append("link_anh", imageFile);
      }

      const res = await fetch(`${BASE}/hair-styles/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: form,
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("Cập nhật thành công");
        navigate("/qlnvtv");
      } else {
        toast.error(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Đang tải...</div>;
  }
    const back = () => navigate("/dsgv");

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Cập Nhật Nhân Viên</h2>
      </div>

      <div className="form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>

            {/* ẢNH */}
            <div className="form-group">
              <label>Ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>

            {/* HỌ TÊN */}
            <div className="form-group">
              <label>Họ và tên</label>
              <input
              type="text"
                name="hoten"
                value={formData.hoten}
                onChange={handleChange}
              />
            </div>

            {/* MÔ TẢ */}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="mota"
                value={formData.mota}
                onChange={handleChange}
                rows="5"
              />
            </div>

            {/* CHI NHÁNH */}
            <div className="form-group">
              <label>Chi nhánh</label>
              <select
                name="id_salon"
                value={formData.id_salon}
                onChange={handleChange}
              >
                <option value="">-- Chọn chi nhánh --</option>
                {salons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.diachi || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
            <div className="form-actions">
                <button className="btn-cancel" onClick={back} >Cancel</button>
              <button className="btn-update" type="submit" disabled={submitting}>
                {submitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}