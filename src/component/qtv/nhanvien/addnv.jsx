import { useEffect, useState } from "react";
import AppURL from "../../../api/AppURL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ThemNV() {
  const [formData, setFormData] = useState({
    hoten: "",
    mota: "",
    id_salon: "",
  });

  const [imageFile, setImageFile] = useState(null);     // Lưu file ảnh
  const [imagePreview, setImagePreview] = useState(null); // Preview ảnh
  const [salons, setSalons] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      return toast.error("Vui lòng chọn file ảnh (jpg, png, webp...)");
    }

    setImageFile(file);

    // Tạo preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
const navigate=useNavigate();
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hoten.trim()) return toast.error("Vui lòng nhập họ tên");
    if (!imageFile) return toast.error("Vui lòng chọn ảnh đại diện");
    if (!formData.mota.trim()) return toast.error("Vui lòng nhập mô tả");
    if (!formData.id_salon) return toast.error("Vui lòng chọn chi nhánh");

    setSubmitting(true);

    const submitData = new FormData();
    submitData.append("hoten", formData.hoten);
    submitData.append("mota", formData.mota);
    submitData.append("id_salon", formData.id_salon);
    submitData.append("anh", imageFile);   

    try {
   const response = await fetch(AppURL.themhairstyle, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
  body: submitData,
});

const text = await response.text();
console.log("RAW RESPONSE:", text);

let data;
try {
  data = JSON.parse(text);
} catch (e) {
  throw new Error("Server không trả JSON");
}

  

      if (response.ok && data.status) {
        toast.success(" Thêm nhân viên thành công!");

     
        setFormData({ hoten: "", mota: "", id_salon: "" });
        setImageFile(null);
        setImagePreview(null);
        navigate('/qlnv');
      } else {
        toast.error(data.message || "Thêm nhân viên thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error(" Lỗi kết nối với server");
    } finally {
      setSubmitting(false);
    }
  };

  // Load danh sách chi nhánh
  useEffect(() => {
    fetch(AppURL.ListChiNhanh)
      .then((res) => res.json())
      .then((data) => setSalons(data.data || data))
      .catch((err) => {
        console.error("Lỗi tải chi nhánh:", err);
        toast.error("Không thể tải danh sách chi nhánh");
      });
  }, []);

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Thêm Nhân Viên Mới</h2>
      </div>

      <div className="form-container">
        <div className="card">

          <form onSubmit={handleSubmit} encType="multipart/form-data">
           

            {/* Chọn ảnh */}
            <div className="form-group">
              <label>Ảnh đại diện <span className="required">*</span></label>
              <input

                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: "8px 0" }}
                required
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview"style={{ width:"100px",height:"100px",objectFit:"contain"}} />
                </div>
              )}
            </div>
               {/* Họ và tên */}
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="hoten"
                value={formData.hoten}
                onChange={handleChange}
                placeholder="Ví dụ: Trần Thị Bích Ngọc"
                required
              />
            </div>
            {/* Mô tả */}
            <div className="form-group">
              <label>Mô tả / Giới thiệu <span className="required">*</span></label>
              <textarea
                name="mota"
                value={formData.mota}
                onChange={handleChange}
                rows="5"
                placeholder="Kỹ thuật viên chuyên nghiệp với 5 năm kinh nghiệm cắt tóc, uốn, nhuộm..."
                required
              />
            </div>

            {/* Chi nhánh */}
            <div className="form-group">
              <label>Chi nhánh làm việc <span className="required">*</span></label>
              <select
                name="id_salon"
                value={formData.id_salon}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn chi nhánh --</option>
                {salons.map((salon) => (
                  <option key={salon.id} value={salon.id}>
                    {salon.diachi || salon.name || `Chi nhánh ${salon.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút submit */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Đang thêm nhân viên..." : "Thêm Nhân Viên"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}