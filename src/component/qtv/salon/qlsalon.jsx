import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppURL from "../../../api/AppURL";
import { IoIosAdd } from "react-icons/io";

export default function Salon() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const getToken = () => localStorage.getItem("token");

  /* ================= LOAD ================= */
  const fetchSalons = async () => {
    setLoading(true);
    try {
      const res = await fetch(AppURL.ListChiNhanh, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];

      setSalons(data);
    } catch (err) {
      console.error("Lỗi tải salon:", err);
      toast.error("Không thể tải danh sách salon!");
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${AppURL.deletesalon}/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Xóa chi nhánh thành công!");
      setDeleteId(null);
      fetchSalons();
    } catch (err) {
      console.error("Lỗi xóa salon:", err);
      toast.error("Không thể xóa chi nhánh!");
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  return (
    <main className="salon-wrapper">

      {/* HEADER */}
      <div className="salon-header">
        <h2>Danh sách salon</h2>
      </div>

      {/* ADD */}
      <div className="add">
        <button
          className="btn-add"
          onClick={() => navigate("/addsalon")}
        >
          <IoIosAdd /> Thêm chi nhánh
        </button>
      </div>

      {/* TABLE */}
      <div className="salon-table-box">
        {loading ? (
          <div>Đang tải danh sách salon...</div>
        ) : (
          <table className="salon-table">
            <thead>
              <tr>
                <th>Tên chi nhánh</th>
                <th>Địa chỉ</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {salons.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                salons.map((item, index) => (
                  <tr key={item.id}>
                    {/*  TÊN TỰ SINH */}
                    <td>Chi nhánh {index + 1}</td>

                    <td>{item.diachi}</td>

                    <td>
                      <Link
                        className="btn-update-lt"
                        to={`/updatesalon/${item.id}`}
                        
                      >
                        Edit
                      </Link>

                      <button
                        className="btn-delete"
                        onClick={() => setDeleteId(item.id)}
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

      {/* MODAL DELETE */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa chi nhánh này không?</p>

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