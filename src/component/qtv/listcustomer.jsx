import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AppURL from "../../api/AppURL";

export default function ListKhachHang() {
  const [khachhangs, setKH] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");
  /* ===================== LOAD DANH SÁCH KH ===================== */
  const fetchKH = async () => {
    setLoading(true);
    try {
      const res = await fetch(AppURL.ListCustomer, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data_users) ? json.data_users : [];
setKH(data);
      console.log("RAW RESPONSE:", json);
      setKH(data);
    } catch (err) {
      console.error("Lỗi tải khách hàng:", err);
      toast.error("Không thể tải danh sách khách hàng!");
      setKH([]);
    } finally {
      setLoading(false);
    }
  };

   

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Danh sách khách hàng</h2>
      </div>

      <div className="student-table-container">
        {loading ? (
          <div>Đang tải danh sách khách hàng...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Ngày sinh</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {khachhangs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                khachhangs.map((kh) => (
                  <tr key={kh.id}>
                    <td>{kh.id}</td>
                    <td>{kh.hoten}</td>
                    <td>{kh.email}</td>
                    <td>{kh.sodienthoai}</td>
                    <td>
                      {kh.ngaysinh
                        ? new Date(kh.ngaysinh).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td className="btn-group-lt">
                      <Link
                        className="btn-update-lt"
                        to={`/updatekh/${kh.id}`}
                      >
                        Edit
                      </Link>

                     
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