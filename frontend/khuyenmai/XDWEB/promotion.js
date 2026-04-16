const API_URL = "https://webdatlichlamtoc.id.vn/api/khuyen-mais";

async function loadPromotions() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    const list = result.data;
    const container = document.getElementById("promo-list");

    container.innerHTML = ""; // clear cũ

    list.forEach(item => {
      const div = document.createElement("div");
      div.className = "promo-card";

      div.innerHTML = `
        <h3>${item.tenkhuyenmai}</h3>
        <p>Giảm: ${
          item.loai === "PERCENT"
            ? item.giatri + "%"
            : item.giatri.toLocaleString() + "đ"
        }</p>
        <p>Hết hạn: ${item.thoigian_ketthuc}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Lỗi API:", err);
  }
}

loadPromotions();