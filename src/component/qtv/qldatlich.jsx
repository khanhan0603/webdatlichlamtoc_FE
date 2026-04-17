import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const BASE = "https://webdatlichlamtoc.id.vn/api";

const STATUS_CONFIG = {
  BOOKED:    { label: "Đã đặt",     color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  CONFIRMED: { label: "Xác nhận",   color: "#047857", bg: "#ECFDF5", border: "#A7F3D0" },
  DONE:      { label: "Hoàn thành", color: "#374151", bg: "#F3F4F6", border: "#D1D5DB" },
  CANCELLED: { label: "Đã hủy",     color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" },
  PENDING:   { label: "Chờ xử lý",  color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
};

const fmt = (n) =>
  n != null ? new Intl.NumberFormat("vi-VN").format(n) + "đ" : "—";

const fmtDate = (str) => {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const fmtTime = (str) => {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: ".04em",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
};

export default function QLDatLich() {
  const getToken = () => localStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/booking`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đặt lịch!");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return (
    <main className="main-wrapper">
      <div className="main-function">
        <h2>Danh sách đặt lịch</h2>
      </div>

      <div className="student-table-container">
        {loading ? (
          <div>Đang tải danh sách đặt lịch...</div>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Mã đặt lịch</th>
                <th>Khách hàng (ID)</th>
                <th>Chi nhánh (ID)</th>
                <th>Nhân viên (ID)</th>
                <th>Ngày hẹn</th>
                <th>Giờ</th>
                <th>Dịch vụ</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 500 }}>
                      #{(b.id || "").slice(-8).toUpperCase()}
                    </td>
                    <td>{b.id_khachhang || "—"}</td>
                    <td>{b.id_salon || "—"}</td>
                    <td>{b.id_hairstyle || "—"}</td>
                    <td>{fmtDate(b.thoigian_hen)}</td>
                    <td>{fmtTime(b.thoigian_hen)}</td>
                    <td>—</td> {/* API không trả về services trong booking list */}
                    <td>{fmt(b.tongtien)}</td>
                    <td><StatusBadge status={b.trangthaiv} /></td>
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