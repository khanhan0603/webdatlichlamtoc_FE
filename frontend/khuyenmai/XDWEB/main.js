// ================= CONFIG =================
const API_BASE_URL = "https://webdatlichlamtoc.id.vn/api";

// ================= FORMAT =================
function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + "đ";
}

// ================= SEARCH =================
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");

function createSearchDropdown() {
    if (document.getElementById("searchDropdown")) return;

    const dropdown = document.createElement("div");
    dropdown.id = "searchDropdown";
    dropdown.className = "search-dropdown";

    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.appendChild(dropdown);
    }
}

function renderSearchResults(results) {
    const dropdown = document.getElementById("searchDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";

    if (results.length === 0) {
        dropdown.innerHTML = `<div class="search-no-result">Không tìm thấy</div>`;
        dropdown.classList.add("show");
        return;
    }

    results.forEach((item) => {
        const div = document.createElement("div");
        div.className = "search-result-item";

        div.innerHTML = `
            <span class="search-result-name">${item.tendichvu}</span>
            <span class="search-result-price">${formatCurrency(item.dongia)}</span>
        `;

        div.addEventListener("click", () => {
            searchInput.value = item.tendichvu;
            closeSearchDropdown();
        });

        dropdown.appendChild(div);
    });

    dropdown.classList.add("show");
}

function closeSearchDropdown() {
    const dropdown = document.getElementById("searchDropdown");
    if (dropdown) dropdown.classList.remove("show");
}

// ================= CALL API =================
let searchTimer = null;

async function searchServices(keyword) {
    const dropdown = document.getElementById("searchDropdown");

    if (!keyword.trim()) {
        closeSearchDropdown();
        return;
    }

    if (dropdown) {
        dropdown.innerHTML = `<div class="search-loading">Đang tìm kiếm...</div>`;
        dropdown.classList.add("show");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/khuyen-mais`);
        const data = await response.json();

        const list = data.data || [];

        // lọc theo keyword
        const results = list.filter(item =>
            item.tenkhuyenmai.toLowerCase().includes(keyword.toLowerCase())
        );

        // map lại cho UI
        const mapped = results.map(item => ({
            tendichvu: item.tenkhuyenmai,
            dongia: item.giatri
        }));

        renderSearchResults(mapped);

    } catch (error) {
        console.error("Lỗi:", error);
        if (dropdown) {
            dropdown.innerHTML = `<div class="search-no-result">Lỗi kết nối</div>`;
        }
    }
}

// ================= INIT =================
function initSearch() {
    if (!searchInput || !searchBtn) return;

    createSearchDropdown();

    searchInput.addEventListener("input", function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            searchServices(this.value);
        }, 400);
    });

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchServices(this.value);
        }
    });

    searchBtn.addEventListener("click", function () {
        searchServices(searchInput.value);
    });

    // click ra ngoài thì đóng dropdown
    document.addEventListener("click", function (e) {
        const searchBar = document.querySelector(".search-bar");
        if (searchBar && !searchBar.contains(e.target)) {
            closeSearchDropdown();
        }
    });
}

// ================= RUN =================
document.addEventListener("DOMContentLoaded", function () {
    initSearch();
});