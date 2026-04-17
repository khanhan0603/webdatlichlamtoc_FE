import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";
import AppURL from "../../../api/AppURL";

export default function QLDichVu() {
  const [dichvus, setDV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // ✅ FIX

  const getToken = () => localStorage.getItem("token");
  const navigate = useNavigate();

  /* ================= LOAD ================= */
  const fetchDV = async () => {
    setLoading(true);
    try {
      const res = await fetch(AppURL.dichvu, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];

      setDV(data);
    } catch (err) {
      console.error("Lỗi tải dịch vụ:", err);
      toast.error("Không thể tải danh sách dịch vụ!");
      setDV([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${AppURL.deletedv}/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Xóa dịch vụ thành công!");
      setDeleteId(null);
      fetchDV();
    } catch (err) {
      console.error("Lỗi xóa dịch vụ:", err);
      toast.error("Không thể xóa dịch vụ!");
    }
  };

  useEffect(() => {
    fetchDV();
  }, []);

  /* ================= FORMAT TIỀN ================= */
  const formatPrice = (n) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Danh sách dịch vụ</h2>
      </div>

      <div className="add">
        <button
          className="btn-add"
          onClick={() => navigate("/adddichvu")}
        >
          <IoIosAdd /> Thêm dịch vụ
        </button>
      </div>

      <div className="student-table-container">
        {loading ? (
          <div>Đang tải danh sách dịch vụ...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Đơn giá</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {dichvus.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                dichvus.map((kh) => (
                  <tr key={kh.id}>
                    <td>{kh.tendichvu}</td>
                    <td>{formatPrice(kh.dongia)}</td> {/* ✅ đẹp hơn */}
                    <td>{kh.mota}</td>

                    <td className="btn-group-lt">
                      <Link
                        className="btn-update-lt"
                        to={`/updatedv/${kh.id}`}
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

      {/* ================= MODAL ================= */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa dịch vụ này không?</p>

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