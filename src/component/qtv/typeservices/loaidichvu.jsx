import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";
import AppURL from "../../../api/AppURL";

export default function QLLoaiDichVu() {
  const [loaidichvus, setLDV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const getToken = () => localStorage.getItem("token");
  const navigate = useNavigate();
  const fetchLDV = async () => {
    setLoading(true);
    try {
      const res = await fetch(AppURL.loaidichvu,   {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];

      setLDV(data);
    } catch (err) {
      console.error("Lỗi tải dịch vụ:", err);
      toast.error("Không thể tải danh sách loại dịch vụ!");
      setLDV([]);
    } finally {
      setLoading(false);
    }
  };

  
  /* ===================== DELETE ===================== */
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${AppURL.deleteldv}/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Xóa loại dịch vụ thành công!");
      setDeleteId(null);
      fetchLDV();
    } catch (err) {
      console.error("Lỗi xóa loại dịch vụ:", err);
      toast.error("Không thể xóa loại dịch vụ!");
    }
  };

  useEffect(() => {
    fetchLDV();
  }, []);

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Danh sách loại dịch vụ</h2>
      </div>
 <div className="add">
        <button
          className="btn-add"
          onClick={() => navigate("/addldv")}
        >
          <IoIosAdd /> Thêm loại dịch vụ
        </button>
      </div>
      <div className="student-table-container">
        {loading ? (
          <div>Đang tải danh sách loại dịch vụ...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                
                <th>Tên loại dịch vụ</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loaidichvus.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                loaidichvus.map((kh) => (
                  <tr key={kh.id}>
                    <td>{kh.tenloai}</td>                   
                    <td className="btn-group-lt">
                      <Link
                        className="btn-update-lt"
                      to={`/updateldv/${kh.id}`}
                      >
                        Edit
                      </Link>

                      <button
                        className="btn-delete"
                        onClick={() => setDeleteId(kh.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
   {/* ===================== MODAL CONFIRM ===================== */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa loại dịch vụ này không?</p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteId(null)}
              >
                Hủy
              </button>

              <button
                className="btn-delete-confirm"
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}