import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";
import AppURL from "../../../api/AppURL";

export default function QLNV() {
  const [nhanviens, setNV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const [chiNhanhId, setChiNhanhId] = useState("");
  const [chiNhanhs, setChiNhanhs] = useState([]);

  const navigate = useNavigate();
  const getToken = () => localStorage.getItem("token");

  /* ===================== LOAD CHI NHÁNH ===================== */
  const fetchChiNhanh = async () => {
    try {
      const res = await fetch(AppURL.ListChiNhanh);
      const json = await res.json();

      setChiNhanhs(json.data || []);
    } catch (err) {
      console.error("Lỗi load chi nhánh:", err);
    }
  };

  /* ===================== LOAD NHÂN VIÊN ===================== */
  const fetchNV = async () => {
    setLoading(true);
    try {
      let url = AppURL.NVTV;

      // nếu có chọn chi nhánh thì filter
      if (chiNhanhId) {
        url = `${AppURL.NVTV}?chi_nhanh_id=${chiNhanhId}`;
      }

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];

      console.log("NV:", data);
      setNV(data);
    } catch (err) {
      console.error("Lỗi tải nhân viên:", err);
      toast.error("Không thể tải danh sách nhân viên!");
      setNV([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${AppURL.deletehairstyle}/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Xóa nhân viên thành công!");
      setDeleteId(null);
      fetchNV();
    } catch (err) {
      console.error("Lỗi xóa:", err);
      toast.error("Không thể xóa!");
    }
  };

  /* ===================== USE EFFECT ===================== */
  useEffect(() => {
    fetchChiNhanh();
  }, []);

  useEffect(() => {
    fetchNV();
  }, [chiNhanhId]); // 

  /* ===================== UI ===================== */
  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Danh sách nhân viên</h2>
      </div>

      {/* ===================== FILTER ===================== */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={chiNhanhId}
          onChange={(e) => setChiNhanhId(e.target.value)}
        >
          <option value="">-- Tất cả chi nhánh --</option>
          {chiNhanhs.map((cn) => (
            <option key={cn.id} value={cn.id}>
              {cn.diachi || cn.diachi}
            </option>
          ))}
        </select>
      </div>

      <div className="add">
        <button
          className="btn-add"
          onClick={() => navigate("/addnv")}
        >
          <IoIosAdd /> Thêm nhân viên
        </button>
      </div>

      {/* ===================== TABLE ===================== */}
      <div className="student-table-container">
        {loading ? (
          <div>Đang tải danh sách nhân viên...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Họ và tên</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {nhanviens.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                nhanviens.map((nv) => (
                  <tr key={nv.id}>
                    <td>
                      <img
                        src={nv.link_anh}
                        alt=""
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>

                    <td>{nv.hoten}</td>
                    <td>{nv.mota}</td>

                    <td>
                      <Link
                        className="btn-update-lt"
                        to={`/updatenv/${nv.id}`}
                      >
                        Edit
                      </Link>

                      <button
                        className="btn-delete"
                        onClick={() => setDeleteId(nv.id)}
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

      {/* ===================== MODAL ===================== */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc muốn xóa nhân viên này không?</p>

            <div className="modal-actions">
              <button onClick={() => setDeleteId(null)}>Hủy</button>
              <button onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}