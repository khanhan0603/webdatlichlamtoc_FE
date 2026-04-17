import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AppURL from "../../api/AppURL";

export default function QLKhuyenMai() {
  const [khuyenmais, setKM] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchKH = async () => {
    setLoading(true);
    try {
      const res = await fetch(AppURL.khuyenmai,   {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];

      setKM(data);
    } catch (err) {
      console.error("Lỗi tải khách hàng:", err);
      toast.error("Không thể tải danh sách khuyến mãi!");
      setKM([]);
    } finally {
      setLoading(false);
    }
  };

//   /* ===================== XÓA KHÁCH HÀNG ===================== */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

//     try {
//       const res = await fetch(`${AppURL.DeleteKhachHang}/${id}`, {
//         method: "DELETE",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       toast.success("Xóa khách hàng thành công!");
//       fetchKH();
//     } catch (err) {
//       console.error("Lỗi xóa khách hàng:", err);
//       toast.error("Không thể xóa khách hàng!");
//     }
//   };

  useEffect(() => {
    fetchKH();
  }, []);

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Danh sách khuyến mãi</h2>
      </div>

      <div className="student-table-container">
        {loading ? (
          <div>Đang tải danh sách khuyến mãi...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Khuyến mãi </th>
                <th>Thời gian áp dụng </th>
                <th>Thời gian kết thúc</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {khuyenmais.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                khuyenmais.map((kh) => (
                  <tr key={kh.id}>
                    <td>{kh.tenkhuyenmai}</td>
                    <td>{kh.thoigian_apdung}</td>
                    <td>{kh.thoigian_ketthuc}</td>
                    
                    <td className="btn-group-lt">
                      <Link
                        className="btn-update-lt"
                     //   to={`/updatekh/${kh.id}`}
                      >
                        Edit
                      </Link>

                      <button
                        className="btn-delete"
                   
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
    </main>
  );
}