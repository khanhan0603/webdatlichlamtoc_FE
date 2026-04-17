import { useEffect, useState } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateDV() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    tendichvu: "",
    dongia: "",
    mota: "",
    id_loaidichvu: "",
  });

  const [loaidvs, setLDV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  

  /* ================= LOAD LOẠI DV ================= */
  const fetchLoaiDV = async () => {
    try {
      const res = await fetch(AppURL.loaidichvu);
      const data = await res.json();
      setLDV(data.data || data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được loại dịch vụ");
    }
  };

  useEffect(() => {
    fetchLoaiDV();
  }, [id]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tendichvu.trim())
      return toast.error("Nhập tên dịch vụ");

    if (!form.dongia || isNaN(form.dongia))
      return toast.error("Đơn giá không hợp lệ");

    if (!form.mota.trim())
      return toast.error("Nhập mô tả");

    if (!form.id_loaidichvu)
      return toast.error("Chọn loại dịch vụ");

    setSubmitting(true);

    try {
      const res = await fetch(`${AppURL.updatedichvu}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          tendichvu: form.tendichvu,
          dongia: Number(form.dongia),
          mota: form.mota,
          id_loaidichvu: form.id_loaidichvu,
        }),
      });

      const contentType = res.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error(" Not JSON:", text);
        throw new Error("API lỗi");
      }

      if (res.ok && data.status) {
        toast.success("Cập nhật dịch vụ thành công!");
        navigate("/qldichvu");
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

  if (loading) return <div style={{ padding: 40 }}>Đang tải...</div>;

  return (
    

    <main className="main-wrapper">
      <div className="main-function">
        <h2>Cập nhật Dịch Vụ</h2>
      </div>

      <div className="form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>

            {/* TÊN */}
            <div className="form-group">
              <label>Tên dịch vụ</label>
              <input
                name="tendichvu"
                value={form.tendichvu}
                onChange={handleChange}
              />
            </div>

            {/* GIÁ */}
            <div className="form-group">
              <label>Đơn giá</label>
              <input
                type="number"
                name="dongia"
                value={form.dongia}
                onChange={handleChange}
              />
            </div>

            {/* MÔ TẢ */}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="mota"
                value={form.mota}
                onChange={handleChange}
              />
            </div>

            {/* LOẠI DV */}
            <div className="form-group">
              <label>Loại dịch vụ</label>
              <select
                name="id_loaidichvu"
                value={form.id_loaidichvu}
                onChange={handleChange}
              >
                <option value="">-- Chọn --</option>
                {loaidvs.map((ldv) => (
                  <option key={ldv.id} value={ldv.id}>
                    {ldv.tenloai}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
            <div className="form-actions">
              <button disabled={submitting}>
                {submitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>

              <button type="button" onClick={() => navigate("/qldichvu")}>
                Huỷ
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}