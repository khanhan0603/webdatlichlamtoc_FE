import { useState, useEffect, useCallback } from "react";
import AppURL from "../../api/AppURL";
import { useParams, useNavigate } from "react-router-dom";

const BASE = "https://webdatlichlamtoc.id.vn/api";
const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const Spinner = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "32px 0" }}>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      border: "2px solid rgba(201,169,110,0.2)",
      borderTopColor: "#C9A96E",
      animation: "spin 0.7s linear infinite",
    }} />
    <span style={{ fontSize: 13, color: "#9E8E7E" }}>Đang tải…</span>
  </div>
);

// ----- Form đăng nhập nhúng (dùng endpoint /login đã hoạt động) -----
function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Gọi đúng endpoint auth/login
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, matkhau: password }), // dùng matkhau như LoginUser
      });

      const data = await res.json();

      // Cấu trúc trả về giống LoginUser: { user: {...}, token: '...' }
      const user = data.user;
      const token = data.token || data.access_token;

      if (user && token) {
        // Đảm bảo có hoten
        if (!user.hoten && user.name) user.hoten = user.name;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        onLoginSuccess(user);
      } else {
        setError(data.message || "Sai email hoặc mật khẩu");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "var(--white)", borderRadius: 20, padding: "32px 28px",
      maxWidth: 420, width: "100%", margin: "0 auto",
      boxShadow: "0 20px 40px rgba(0,0,0,0.05)", border: "1px solid var(--border)",
    }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, marginBottom: 6 }}>
          Đăng nhập
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-s)" }}>
          Vui lòng đăng nhập để tiếp tục đặt lịch
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              border: "1.5px solid var(--border-s)", fontSize: 14,
              outline: "none", fontFamily: "'Outfit',sans-serif",
            }}
          />
        </div>
        <div style={{ marginBottom: 22 }}>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              border: "1.5px solid var(--border-s)", fontSize: 14,
              outline: "none", fontFamily: "'Outfit',sans-serif",
            }}
          />
        </div>
        {error && (
          <div style={{ background: "#FEF0F0", border: "1px solid rgba(220,80,80,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B33", marginBottom: 18 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", background: "var(--gold)", border: "none",
            borderRadius: 10, padding: "12px", fontFamily: "'Outfit',sans-serif",
            fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
            color: "var(--ink)", transition: "all .2s",
          }}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default function SalonBooking() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ── Auth ──────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch {}
    setAuthChecked(true);
  }, []);

  // ── Booking state ─────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    salon: null, staff: null, date: "", time: null, services: [],
  });
  const [salons, setSalons] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [slots, setSlots] = useState({ available: [], booked: [] });
  const [serviceList, setServiceList] = useState([]);
  const [promoList, setPromoList] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [loading, setLoading] = useState({
    salons: false, staff: false, slots: false,
    services: false, promos: false, booking: false,
  });
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const setLoad = (key, v) => setLoading((p) => ({ ...p, [key]: v }));
  const setErr = (key, v) => setError((p) => ({ ...p, [key]: v }));

  const isPromoValid = useCallback((promo) => {
    if (!promo) return false;
    const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
    const start = promo.ngaybatdau ? new Date(promo.ngaybatdau) : null;
    const end = promo.ngayketthuc ? new Date(promo.ngayketthuc) : null;
    if (!start || !end) return false;
    start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
    return todayDate >= start && todayDate <= end;
  }, []);

  // Step 1
  const fetchSalon = async () => {
    try {
      const res = await fetch(AppURL.ListChiNhanh);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSalons(data.data || []);
    } catch {}
  };
  useEffect(() => {
    setLoad("salons", true);
    fetchSalon().finally(() => setLoad("salons", false));
  }, []);

  // Step 2
  const loadStaff = useCallback((salonId) => {
    setLoad("staff", true);
    setStaffList([]);
    setState((p) => ({ ...p, staff: null, date: today }));
    fetch(`${BASE}/salon/hair-style/${salonId}`)
      .then((r) => r.json())
      .then((d) => { setStaffList(d.data || d); setLoad("staff", false); })
      .catch(() => setLoad("staff", false));
  }, [today]);

  // Step 3
  const loadSlots = useCallback(() => {
    if (!state.salon?.id || !state.staff?.id || !state.date) return;
    setLoad("slots", true);
    setState((p) => ({ ...p, time: null }));
    fetch(`${BASE}/booking/slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salon_id: state.salon.id, staff_id: state.staff.id, date: state.date }),
    })
      .then((r) => r.json())
      .then((d) => {
        setSlots({ available: d.available_slots || [], booked: d.booked_slots || [] });
        setLoad("slots", false);
      })
      .catch(() => {
        setSlots({ available: ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","16:00","17:00"], booked: ["15:00"] });
        setLoad("slots", false);
      });
  }, [state.salon, state.staff, state.date]);

  // Step 4
  const loadServices = useCallback(() => {
    setLoad("services", true);
    setServiceList([]);
    fetch(AppURL.dichvu)
      .then((r) => r.json())
      .then((d) => { setServiceList(d.data || d); setLoad("services", false); })
      .catch(() => setLoad("services", false));
  }, []);

  // Step 5
  const loadPromos = useCallback(() => {
    setLoad("promos", true);
    setPromoList([]);
    fetch(`${BASE}/khuyen-mais`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || d;
        setPromoList(list);
        if (selectedPromo && !isPromoValid(selectedPromo)) setSelectedPromo(null);
        setLoad("promos", false);
      })
      .catch(() => setLoad("promos", false));
  }, [selectedPromo, isPromoValid]);

  const subtotal = state.services.reduce((a, s) => a + s.dongia, 0);
  const discount = selectedPromo
    ? selectedPromo.loai === "phan_tram"
      ? Math.round(subtotal * selectedPromo.giatri / 100)
      : selectedPromo.giatri
    : 0;
  const total = Math.max(0, subtotal - discount);

  // ── Booking ───────────────────────────────────────────────
  const performBooking = async () => {
  if (!currentUser?.id) return;
  setLoad("booking", true);
  setErr("booking", "");

  const payload = {
    salon_id: state.salon.id,
    staff_id: state.staff.id,
    date: state.date,
    time: state.time,
    services: state.services.map((s) => s.id),
    id_khachhang: currentUser.id,  // giữ nguyên
  };
  if (selectedPromo) payload.khuyen_mai_id = selectedPromo.id;

  const token = localStorage.getItem("token"); // 👈 lấy token

  try {
    const res = await fetch(`${BASE}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}), // 👈 thêm header
      },
      body: JSON.stringify(payload),
    });
   
      const text = await res.text();
      console.log("Error response:", text);
      let data;
      try { data = JSON.parse(text); }
      catch { throw new Error(`Lỗi server: ${text.substring(0, 200)}`); }
      setLoad("booking", false);
      if (data.status === true || data.message === "Đặt lịch thành công!") {
        setSuccess(data.data || {});
      } else {
        setErr("booking", data.message || "Đặt lịch thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setLoad("booking", false);
      setErr("booking", err.message);
    }
  };

  const resetAll = () => {
    setStep(1);
    setState({ salon: null, staff: null, date: today, time: null, services: [] });
    setSlots({ available: [], booked: [] });
    setServiceList([]); setPromoList([]);
    setSelectedPromo(null); setSuccess(null); setError({});
  };

  const toggleService = (svc) => {
    setState((p) => {
      const has = p.services.find((x) => x.id === svc.id);
      return { ...p, services: has ? p.services.filter((x) => x.id !== svc.id) : [...p.services, svc] };
    });
  };

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  const goNext = () => {
    if (step === 2) { loadSlots(); setStep(3); }
    else if (step === 3) { loadServices(); setStep(4); }
    else if (step === 4) { loadPromos(); setStep(5); }
    else setStep((s) => s + 1);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes scalePop { from { transform:scale(0.92); opacity:0; } to { transform:scale(1); opacity:1; } }
    * { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --gold:#C9A96E; --gold-lt:#F5ECD7; --gold-dk:#8B6F3E;
      --ink:#1A1614; --ink-s:#5A4E47; --cream:#FAF7F2;
      --white:#FFFFFF; --border:rgba(201,169,110,0.22); --border-s:rgba(201,169,110,0.45);
    }
    body { font-family:'Outfit',sans-serif; background:var(--cream); color:var(--ink); min-height:100vh; }
    input[type=date] { appearance:none; -webkit-appearance:none; font-family:'Outfit',sans-serif; }
    ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:var(--border-s); border-radius:4px; }
  `;

  // ── Guards: nếu chưa đăng nhập → hiển thị form login (giữ nguyên state booking) ──
  if (!authChecked) {
    return <><style>{css}</style><div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div></>;
  }

  if (!currentUser) {
    return (
      <>
        <style>{css}</style>
        <div style={{ background: "var(--cream)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header user={null} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <LoginForm onLoginSuccess={(user) => setCurrentUser(user)} />
          </div>
        </div>
      </>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────────
  if (success) {
    const dStr = state.date
      ? new Date(state.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "";
    return (
      <>
        <style>{css}</style>
        <div style={{ background: "var(--ink)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header user={currentUser} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <div style={{
              background: "var(--white)", borderRadius: 20, padding: "44px 36px",
              maxWidth: 420, width: "100%", textAlign: "center",
              animation: "scalePop .4s ease", boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: "#EAF7EE",
                margin: "0 auto 22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
              }}>✓</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>
                Đặt lịch thành công!
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-s)", lineHeight: 1.7, marginBottom: 24 }}>
                Hẹn gặp bạn tại <strong>{state.salon?.name}</strong>.<br />Vui lòng đến đúng giờ đã chọn.
              </p>
              <div style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", marginBottom: 24, textAlign: "left" }}>
                {[
                  ["Mã đặt lịch", (success.id || "").slice(-8).toUpperCase()],
                  ["Khách hàng", currentUser.hoten],
                  ["Chi nhánh", state.salon?.name],
                  ["Nhân viên", state.staff?.name],
                  ["Thời gian", `${dStr} — ${state.time}`],
                  ["Dịch vụ", state.services.map((s) => s.tendichvu).join(", ")],
                  ...(selectedPromo ? [["Khuyến mãi", selectedPromo.tenkm || selectedPromo.ten]] : []),
                  ...(discount > 0 ? [["Giảm giá", `− ${fmt(discount)}`]] : []),
                  ["Tổng tiền", fmt(success.tongtien ?? total)],
                  ["Trạng thái", success.trangthai || "BOOKED"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)", gap: 10, fontSize: 13 }}>
                    <span style={{ color: "var(--ink-s)", flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: "right", color: k === "Trạng thái" ? "#2E7D32" : k === "Giảm giá" ? "#16A34A" : undefined }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={resetAll} style={{ background: "var(--gold)", border: "none", borderRadius: 10, padding: "12px 28px", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer", width: "100%" }}>
                Đặt lịch mới
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN FLOW (đã đăng nhập) ─────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div style={{ background: "var(--cream)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header user={currentUser} />
        <StepsBar current={step} />
        <div style={{ flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: "28px 18px 60px" }}>

          {/* STEP 1 */}
          {step === 1 && (
            <Card title="Chọn chi nhánh" num={1}>
              {loading.salons ? <Spinner /> : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                  {salons.map((s) => {
                    const name = "Chi nhánh " + s.id.slice(-4);
                    const addr = s.diachi || "";
                    const sel = state.salon?.id === s.id;
                    return (
                      <div key={s.id} onClick={() => { setState((p) => ({ ...p, salon: { id: s.id, name } })); loadStaff(s.id); }} style={{
                        border: `1.5px solid ${sel ? "var(--gold)" : "var(--border)"}`,
                        borderRadius: 12, padding: "15px 14px", cursor: "pointer",
                        background: sel ? "var(--gold-lt)" : "var(--white)", position: "relative", transition: "all .18s",
                      }}>
                        {sel && <TickBadge />}
                        <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 5 }}>{name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-s)", lineHeight: 1.5 }}>{addr}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <NavRow onNext={() => setStep(2)} nextDisabled={!state.salon} />
            </Card>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <Card title="Chọn nhân viên & ngày" num={2}>
              {loading.staff ? <Spinner /> : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12, marginBottom: 24 }}>
                    {staffList.map((s) => {
                      const sel = state.staff?.id === s.id;
                      return (
                        <div key={s.id} onClick={() => setState((p) => ({ ...p, staff: { id: s.id, name: s.hoten, mota: s.mota } }))} style={{
                          border: `1.5px solid ${sel ? "var(--gold)" : "var(--border)"}`,
                          borderRadius: 12, padding: "18px 12px", cursor: "pointer",
                          textAlign: "center", background: sel ? "var(--gold-lt)" : "var(--white)", position: "relative", transition: "all .18s",
                        }}>
                          {sel && <TickBadge />}
                          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold-lt)", border: "2px solid var(--border-s)", margin: "0 auto 10px", overflow: "hidden" }}>
                            <img src={s.link_anh} alt={s.hoten} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{s.hoten}</div>
                          <div style={{ fontSize: 11, color: "var(--ink-s)" }}>{s.mota}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--ink-s)", marginBottom: 8 }}>Ngày hẹn</label>
                    <input type="date" min={today} value={state.date} onChange={(e) => setState((p) => ({ ...p, date: e.target.value }))} style={{
                      border: "1.5px solid var(--border-s)", borderRadius: 9, padding: "10px 14px",
                      fontSize: 14, color: "var(--ink)", background: "var(--white)", outline: "none", width: "100%", maxWidth: 260,
                    }} />
                  </div>
                </>
              )}
              <NavRow onBack={() => setStep(1)} onNext={goNext} nextDisabled={!state.staff || !state.date} />
            </Card>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Card title="Chọn khung giờ" num={3}>
              {loading.slots ? <Spinner /> : (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--ink-s)", marginBottom: 10 }}>Giờ trống</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {slots.available.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-s)" }}>Không còn khung giờ trống.</span>}
                      {slots.available.map((t) => {
                        const sel = state.time === t;
                        return (
                          <button key={t} onClick={() => setState((p) => ({ ...p, time: t }))} style={{
                            padding: "9px 16px", borderRadius: 9,
                            border: `1.5px solid ${sel ? "var(--gold)" : "var(--border-s)"}`,
                            background: sel ? "var(--gold)" : "var(--white)",
                            fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer",
                            fontWeight: sel ? 600 : 400, color: "var(--ink)", transition: "all .15s",
                          }}>{t}</button>
                        );
                      })}
                    </div>
                  </div>
                  {slots.booked.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "#C0A89A", marginBottom: 10 }}>Đã đặt</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {slots.booked.map((t) => (
                          <button key={t} disabled style={{ padding: "9px 16px", borderRadius: 9, border: "1.5px solid #E0D8D2", background: "#F5F0EB", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#BFB5AD", textDecoration: "line-through", cursor: "not-allowed" }}>{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <NavRow onBack={() => setStep(2)} onNext={goNext} nextDisabled={!state.time} />
            </Card>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <Card title="Chọn dịch vụ" num={4}>
              {loading.services ? <Spinner /> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {serviceList.map((s) => {
                    const sel = !!state.services.find((x) => x.id === s.id);
                    return (
                      <div key={s.id} onClick={() => toggleService(s)} style={{
                        display: "flex", alignItems: "center", gap: 14,
                        border: `1.5px solid ${sel ? "var(--gold)" : "var(--border)"}`,
                        borderRadius: 12, padding: "13px 16px", cursor: "pointer",
                        background: sel ? "var(--gold-lt)" : "var(--white)", transition: "all .18s",
                      }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: `2px solid ${sel ? "var(--gold)" : "var(--border-s)"}`, background: sel ? "var(--gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--white)", transition: "all .18s" }}>
                          {sel && <CheckIcon />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{s.tendichvu}</div>
                          {s.mota && <div style={{ fontSize: 12, color: "var(--ink-s)", marginTop: 2 }}>{s.mota}</div>}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gold-dk)", whiteSpace: "nowrap" }}>{fmt(s.dongia)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {state.services.length === 0 && !loading.services && (
                <div style={{ marginTop: 14, background: "#FFF8EC", border: "1px solid rgba(201,169,110,0.35)", borderRadius: 9, padding: "11px 14px", fontSize: 13, color: "var(--gold-dk)" }}>
                  Vui lòng chọn ít nhất 1 dịch vụ để tiếp tục.
                </div>
              )}
              <NavRow onBack={() => setStep(3)} onNext={goNext} nextDisabled={state.services.length === 0} />
            </Card>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <Card title="Khuyến mãi & Xác nhận" num={5}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--ink-s)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <TagIcon /> Chọn khuyến mãi <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(không bắt buộc)</span>
                </div>
                {loading.promos ? <Spinner /> : promoList.length === 0 ? (
                  <div style={{ background: "var(--cream)", border: "1px dashed var(--border-s)", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "var(--ink-s)", textAlign: "center" }}>
                    Hiện không có khuyến mãi nào.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div onClick={() => setSelectedPromo(null)} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      border: `1.5px solid ${!selectedPromo ? "var(--gold)" : "var(--border)"}`,
                      borderRadius: 12, padding: "11px 14px", cursor: "pointer",
                      background: !selectedPromo ? "var(--gold-lt)" : "var(--white)",
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `2px solid ${!selectedPromo ? "var(--gold)" : "var(--border-s)"}`, background: !selectedPromo ? "var(--gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                        {!selectedPromo && <CheckIcon />}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--ink-s)" }}>Không dùng khuyến mãi</span>
                    </div>
                    {promoList.map((p) => {
                      const sel = selectedPromo?.id === p.id;
                      const isValid = isPromoValid(p);
                      const isPct = p.loai === "phan_tram";
                      const label = isPct ? `Giảm ${p.giatri}%` : `Giảm ${fmt(p.giatri)}`;
                      const savingAmt = isPct ? Math.round(subtotal * p.giatri / 100) : p.giatri;
                      const formatDate = (dateStr) => { if (!dateStr) return ''; const d = new Date(dateStr); return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`; };
                      const dateRange = p.ngaybatdau && p.ngayketthuc ? `${formatDate(p.ngaybatdau)} - ${formatDate(p.ngayketthuc)}` : '';
                      const disabled = !isValid;
                      return (
                        <div key={p.id} onClick={() => { if (!disabled) setSelectedPromo(sel ? null : p); }} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          border: `1.5px solid ${sel && !disabled ? "var(--gold)" : "var(--border)"}`,
                          borderRadius: 12, padding: "13px 14px", cursor: disabled ? "not-allowed" : "pointer",
                          background: sel && !disabled ? "var(--gold-lt)" : "var(--white)",
                          opacity: disabled ? 0.6 : 1, position: "relative", transition: "all .18s",
                        }}>
                          {sel && !disabled && <TickBadge />}
                          <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `2px solid ${sel && !disabled ? "var(--gold)" : "var(--border-s)"}`, background: sel && !disabled ? "var(--gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                            {sel && !disabled && <CheckIcon />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.tenkm || p.ten}</div>
                            {p.mota && <div style={{ fontSize: 12, color: "var(--ink-s)", marginTop: 2 }}>{p.mota}</div>}
                            {dateRange && <div style={{ fontSize: 11, color: "#8b6f3e", marginTop: 4 }}>📅 {dateRange}</div>}
                            {p.makm && <div style={{ display: "inline-block", marginTop: 5, background: "rgba(201,169,110,0.12)", border: "1px dashed var(--gold)", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 600, color: "var(--gold-dk)", letterSpacing: ".06em" }}>{p.makm}</div>}
                            {disabled && <div style={{ marginTop: 6, fontSize: 11, color: "#B33", fontWeight: 500 }}>{new Date() < new Date(p.ngaybatdau) ? "🔜 Sắp diễn ra" : "⛔ Hết hạn"}</div>}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ background: "#FEF9EC", border: "1px solid rgba(201,169,110,0.4)", borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 600, color: "var(--gold-dk)" }}>{label}</div>
                            {subtotal > 0 && isValid && <div style={{ fontSize: 11, color: "#16A34A", marginTop: 4 }}>Tiết kiệm {fmt(savingAmt)}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tóm tắt */}
              <div style={{ background: "var(--ink)", borderRadius: 14, padding: "22px", marginBottom: 4 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: "var(--gold-lt)", marginBottom: 16, paddingBottom: 13, borderBottom: "1px solid rgba(201,169,110,0.2)" }}>Tóm tắt đặt lịch</div>
                {[
                  ["Khách hàng", currentUser.hoten],
                  ["Chi nhánh", state.salon?.name],
                  ["Nhân viên", state.staff?.name],
                  ["Ngày & giờ", `${fmtDate(state.date)} — ${state.time}`],
                  ["Dịch vụ", state.services.map((s) => s.tendichvu).join(", ")],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(201,169,110,0.2)", marginTop: 14, paddingTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>Tạm tính</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{fmt(subtotal)}</span>
                  </div>
                  {selectedPromo && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>Khuyến mãi ({selectedPromo.tenkm || selectedPromo.ten})</span>
                      <span style={{ fontSize: 13, color: "#4ADE80", fontWeight: 500 }}>− {fmt(discount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Tổng thanh toán</span>
                    <div style={{ textAlign: "right" }}>
                      {selectedPromo && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "line-through", marginBottom: 2 }}>{fmt(subtotal)}</div>}
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: "var(--gold)" }}>{fmt(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {error.booking && (
                <div style={{ background: "#FEF0F0", border: "1px solid rgba(220,80,80,0.3)", borderRadius: 9, padding: "11px 14px", fontSize: 13, color: "#B33", marginTop: 12 }}>
                  {error.booking}
                </div>
              )}
              <NavRow onBack={() => setStep(4)} onNext={performBooking} nextLabel={loading.booking ? "Đang xử lý…" : "Xác nhận đặt lịch"} nextDisabled={loading.booking} />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

// ── Sub-components (giữ nguyên) ────────────────────────────
function Header({ user }) {
  return (
    <div style={{ background: "var(--ink)", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(201,169,110,0.25)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, background: "var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
            <line x1="20" y1="4" x2="8.12" y2="15.88"/>
            <line x1="14.47" y1="14.48" x2="20" y2="20"/>
            <line x1="8.12" y1="8.12" x2="12" y2="12"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "var(--gold-lt)", fontWeight: 500 }}>Đặt Lịch Cắt Tóc</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Chọn chi nhánh · Nhân viên · Dịch vụ</div>
        </div>
      </div>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
            {user.hoten?.charAt(0).toUpperCase()}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "var(--gold-lt)", fontWeight: 500 }}>{user.hoten}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepsBar({ current }) {
  const STEPS = [
    { n: 1, label: "Chi nhánh" },
    { n: 2, label: "Nhân viên & Ngày" },
    { n: 3, label: "Khung giờ" },
    { n: 4, label: "Dịch vụ" },
    { n: 5, label: "Khuyến mãi & Xác nhận" },
  ];
  const CheckIcon = () => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
      <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "16px 24px", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", minWidth: 520 }}>
        {STEPS.map((s, i) => {
          const done = current > s.n;
          const active = current === s.n;
          return (
            <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, border: `2px solid ${active || done ? "var(--gold)" : "#D4C9BC"}`, background: active ? "var(--gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: active ? "var(--ink)" : done ? "var(--gold)" : "#D4C9BC", transition: "all .3s" }}>
                  {done ? <CheckIcon /> : s.n}
                </div>
                <span style={{ fontSize: 12, color: active ? "var(--ink)" : done ? "var(--gold-dk)" : "#C4B8AD", fontWeight: active ? 500 : 400, whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: "var(--border-s)", margin: "0 8px", maxWidth: 36 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({ title, num, children }) {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 22px", marginBottom: 20, animation: "fadeUp .3s ease" }}>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 24, height: 24, background: "var(--gold-lt)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--gold-dk)", flexShrink: 0 }}>{num}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function NavRow({ onBack, onNext, nextLabel = "Tiếp theo", nextDisabled }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
      {onBack && (
        <button onClick={onBack} style={{ padding: "10px 22px", borderRadius: 9, border: "1.5px solid var(--border-s)", background: "transparent", fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer", color: "var(--ink-s)", fontWeight: 400 }}>
          ← Quay lại
        </button>
      )}
      <button onClick={onNext} disabled={nextDisabled} style={{ padding: "10px 24px", borderRadius: 9, border: "none", background: nextDisabled ? "rgba(201,169,110,0.3)" : "var(--gold)", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: nextDisabled ? "not-allowed" : "pointer", color: nextDisabled ? "rgba(0,0,0,0.35)" : "var(--ink)", transition: "all .2s" }}>
        {nextLabel} →
      </button>
    </div>
  );
}

function TickBadge() {
  return (
    <div style={{ position: "absolute", top: 9, right: 10, width: 20, height: 20, background: "var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}