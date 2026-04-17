import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { toast } from "react-toastify";
import AppURL from "../../api/AppURL";

export default function QLPTDV() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ===================== LOAD DATA ===================== */
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Lấy danh sách dịch vụ
      const resService = await fetch(AppURL.phuongtiendv);
      const jsonService = await resService.json();
      const services = jsonService.data || [];

      // 👉 chỉ lấy 5 dịch vụ đầu
      const first5 = services.slice(0, 5);

      // 2. Gọi media theo từng dịch vụ (ĐÚNG API)
      const requests = first5.map((s) =>
        fetch(`${AppURL.phuongtiendv}/${s.id}`)
          .then((res) => res.json())
          .then((mediaRes) => ({
            ...s,
            media: mediaRes.data || [],
          }))
          .catch(() => ({
            ...s,
            media: [],
          }))
      );

      const finalData = await Promise.all(requests);

      setData(finalData);
    } catch (err) {
      console.error("Lỗi load dữ liệu:", err);
      toast.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ===================== UI ===================== */
  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Quản lý phương tiện dịch vụ</h2>
      </div>

      <div className="student-table-container">
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    {/* HÌNH ẢNH */}
                    <td>
                      {item.media.length > 0 ? (
                        <img
                          src={item.media[0].link}
                          alt=""
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ color: "red" }}>
                          ⚠ Chưa có ảnh
                        </span>
                      )}
                    </td>

                    {/* TÊN DỊCH VỤ */}
                    <td>{item.ten_dichvu}</td>

                    {/* TRẠNG THÁI */}
                    <td>
                      {item.media.length > 0 ? (
                        <span style={{ color: "green" }}>
                          Đã có ảnh
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          Thiếu ảnh
                        </span>
                      )}
                    </td>

                    {/* HÀNH ĐỘNG */}
                    <td>
                      {item.media.length === 0 ? (
                        <button
                          className="btn-add"
                          onClick={() =>
                            navigate(`${AppURL.Themptdv}/${item.id}`)
                          }
                        >
                          <IoIosAdd /> Thêm ảnh
                        </button>
                      ) : (
                        <button
                          className="btn-update-lt"
                          onClick={() =>
                            navigate(`${AppURL.updateptdv}/${item.id}`)
                          }
                        >
                          Sửa ảnh
                        </button>
                      )}
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