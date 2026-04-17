import { useState,useEffect } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ThemDichVu() {
  const [form, setForm] = useState({
    tendichvu: "",
    dongia: "",
    mota: "",
    id_loaidichvu:"",
  });

  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loaidvs,setLDV]=useState([]);

  /* ================= INPUT ================= */
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
      return toast.error("Vui lòng nhập tên dịch vụ");

    if (!form.dongia || isNaN(form.dongia))
      return toast.error("Đơn giá không hợp lệ");

    if (!form.mota.trim())
      return toast.error("Vui lòng nhập mô tả");
if (!form.id_loaidichvu) 
    return toast.error("Vui lòng chọn loại dịch vụ");
    setSubmitting(true);

    try {
      const res = await fetch(AppURL.themdichvu, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          tendichvu: form.tendichvu,
          dongia: Number(form.dongia),
          mota: form.mota,
          id_loaidichvu:form.id_loaidichvu
        }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast.success("Thêm dịch vụ thành công!");

        setForm({
          tendichvu: "",
          dongia: "",
          mota: "",
          id_loaidichvu:"",
        });

        navigate("/qldichvu");
      } else {
        toast.error(data.message || "Thêm thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi server");
    } finally {
      setSubmitting(false);
    }
  };

   useEffect(() => {
    fetch(AppURL.loaidichvu)
      .then((res) => res.json())
      .then((data) => setLDV(data.data || data))
      .catch((err) => {
        console.error("Lỗi tải loại dịch vụ:", err);
        toast.error("Không thể tải danh sách loại dịch vụ");
      });
  }, []);

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Thêm Dịch Vụ</h2>
      </div>

      <div className="form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            
            {/* TÊN DỊCH VỤ */}
            <div className="form-group">
              <label>Tên dịch vụ</label>
              <input
                type="text"
                name="tendichvu"
                value={form.tendichvu}
                onChange={handleChange}
                placeholder="VD: Cắt tóc nam"
              />
            </div>

            {/* ĐƠN GIÁ */}
            <div className="form-group">
              <label>Đơn giá</label>
              <input
                type="number"
                name="dongia"
                value={form.dongia}
                onChange={handleChange}
                placeholder="VD: 100000"
              />
            </div>

            {/* MÔ TẢ */}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="mota"
                value={form.mota}
                onChange={handleChange}
                rows="4"
                placeholder="Mô tả dịch vụ..."
              />
            </div>

      <div className="form-group">
  <label>Loại dịch vụ <span className="required">*</span></label>
  <select
    name="id_loaidichvu"
    value={form.id_loaidichvu}
    onChange={handleChange}
    required
  >
    <option value="">-- Chọn loại dịch vụ --</option>
    {loaidvs.map((ldv) => (
      <option key={ldv.id} value={ldv.id}>
        {ldv.tenloai || `Loại ${ldv.id}`}
      </option>
    ))}
  </select>
</div>

            {/* BUTTON */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Đang thêm..." : "Thêm Dịch Vụ"}
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/qldichvu")}
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