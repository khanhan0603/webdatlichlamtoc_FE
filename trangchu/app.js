const API_BASE_URL = "https://webdatlichlamtoc.id.vn/api";

const DEFAULT_SERVICE_IMAGE = "image/b1.jpg";
const DEFAULT_PROMOTION_IMAGE = "image/b3.jpg";


const hamburgerMenu = document.getElementById("hamburgerMenu");
const navMenu = document.getElementById("navMenu");

if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener("click", function () {
        hamburgerMenu.classList.toggle("active");
        navMenu.classList.toggle("show");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function () {
            hamburgerMenu.classList.remove("active");
            navMenu.classList.remove("show");
        });
    });
}


window.addEventListener("scroll", function () {
    const backToTopBtn = document.getElementById("backToTop");
    if (!backToTopBtn) return;

    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}


document.querySelectorAll(".learn-more").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const homeForm = document.querySelector(".home_form");
        if (homeForm) {
            homeForm.scrollIntoView({
                behavior: "smooth",
            });
        }
    });
});

(function () {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        localStorage.setItem("auth_token", token);

        // Xoá token khỏi URL (cho đẹp)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
})();
function initSlider() {
    const slides = document.querySelectorAll(".slider img");
    if (slides.length === 0) return;

    let currentSlide = 0;

    slides.forEach((slide, index) => {
        slide.style.opacity = index === 0 ? "1" : "0";
    });

    setInterval(() => {
        slides.forEach((slide) => {
            slide.style.opacity = "0";
        });
        slides[currentSlide].style.opacity = "1";
        currentSlide = (currentSlide + 1) % slides.length;
    }, 9000);
}


function formatCurrency(value) {
    if (!value && value !== 0) return "Liên hệ";
    return Number(value).toLocaleString("vi-VN") + " VND";
}


function showBookingMessage(message, type = "success") {
    const bookingMessage = document.getElementById("bookingMessage");
    if (!bookingMessage) return;

    bookingMessage.textContent = message;
    bookingMessage.className = "booking-message " + type;
}

async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}


async function fetchServices() {
    try {
        const data = await fetchJSON(`${API_BASE_URL}/services`);
        console.log("Services API:", data);

        const services = Array.isArray(data) ? data : data.data || [];
        renderServices(services);
    } catch (error) {
        console.error("Lỗi lấy dịch vụ:", error);
        renderServicesFallback();
    }
}

async function fetchServiceMedia(serviceId) {
    try {
        const data = await fetchJSON(`${API_BASE_URL}/phuong-tiens/${serviceId}`);
        console.log(`Media dịch vụ ${serviceId}:`, data);

        const mediaList = Array.isArray(data) ? data : data.data || [];

        const firstImage = mediaList.find(
            (item) =>
                item.loai === "IMAGE" ||
                item.loai === "image" ||
                (item.link && item.link.includes("http"))
        );

        return firstImage?.link || DEFAULT_SERVICE_IMAGE;
    } catch (error) {
        console.warn(`Không lấy được ảnh cho dịch vụ ${serviceId}`, error);
        return DEFAULT_SERVICE_IMAGE;
    }
}


function renderServicesFallback() {
    const carouselTrack = document.getElementById("carouselTrack");
    if (!carouselTrack) return;

    carouselTrack.innerHTML = `
        <div class="carousel-item">
            <div class="carousel-card">
                <img src="image/b1.jpg" alt="Cắt tóc phong cách">
                <div class="carousel-card-content">
                    <h4>Cắt tóc phong cách</h4>
                    <p class="carousel-price">89.000 VND</p>
                    <button class="carousel-card-btn">Chi tiết</button>
                </div>
            </div>
        </div>
    `;

    initCarousel();
}


async function fetchPromotions() {
    try {
        const data = await fetchJSON(`${API_BASE_URL}/khuyen-mais`);
        console.log("Khuyến mãi API:", data);

        const promotions = Array.isArray(data) ? data : data.data || [];
        renderPromotions(promotions);
    } catch (error) {
        console.error("Lỗi lấy khuyến mãi:", error);
        renderPromotionsFallback();
    }
}

function renderPromotions(promotions) {
    const promotionTrack = document.getElementById("promotionTrack");
    if (!promotionTrack) return;

    promotionTrack.innerHTML = "";

    const topPromotions = promotions.slice(0, 8);

    topPromotions.forEach((promo) => {
        const card = document.createElement("div");
        card.className = "carousel-item";

        let discountText = "Ưu đãi hấp dẫn";

        if (promo.loaigiam === "PERCENT") {
            discountText = `Giảm ${promo.giatri}%`;
        } else if (promo.loaigiam === "FIXED") {
            discountText = `Giảm ${formatCurrency(promo.giatri)}`;
        }

        card.innerHTML = `
            <div class="carousel-card">
                <img src="${DEFAULT_PROMOTION_IMAGE}" alt="${promo.tenkhuyenmai || "Khuyến mãi"}">
                <div class="carousel-card-content">
                    <h4>${promo.tenkhuyenmai || "Khuyến mãi"}</h4>
                    <p class="carousel-price">${discountText}</p>
                    <button class="carousel-card-btn">Chi tiết</button>
                </div>
            </div>
        `;

        const detailBtn = card.querySelector(".carousel-card-btn");
        detailBtn.addEventListener("click", () => viewPromotionDetail(promo.id));

        promotionTrack.appendChild(card);
    });

    initPromotionCarousel();
}

function renderPromotionsFallback() {
    const promotionTrack = document.getElementById("promotionTrack");
    if (!promotionTrack) return;

    promotionTrack.innerHTML = `
        <div class="carousel-item">
            <div class="carousel-card">
                <img src="image/b3.jpg" alt="Khuyến mãi">
                <div class="carousel-card-content">
                    <h4>Giảm 30% cho khách hàng mới</h4>
                    <p class="carousel-price">Ưu đãi hấp dẫn</p>
                    <button class="carousel-card-btn">Chi tiết</button>
                </div>
            </div>
        </div>
    `;

    initPromotionCarousel();
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_INFO_KEY  = 'user_info';

function getStoredToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getStoredUser() {
    try {
        const raw = localStorage.getItem(USER_INFO_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function getUserDisplayName(user) {
    return user.hoten || user.name || user.fullname || user.username || 'Tài khoản';
}

function getInitial(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
}

async function fetchUserInfo(userId, token) {
    try {
        const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        return data.data || data;
    } catch (e) {
        console.warn('Không lấy được thông tin user:', e);
        return null;
    }
}

function buildUserDropdown(user) {
    const name = getUserDisplayName(user);
    const phone = user.sodienthoai || user.phone || '';
    const initial = getInitial(name);

    const loginLink = document.querySelector('.nav-login-btn');
    if (!loginLink) return;

    const parentContainer = loginLink.closest('.form_button');
    if (!parentContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'user-menu-wrapper';

    wrapper.innerHTML = `
        <button class="user-avatar-btn" id="userAvatarBtn">
            <span class="avatar-icon">${initial}</span>
            <span class="user-display-name">${name}</span>
            <span class="chevron">▼</span>
        </button>
        <div class="user-dropdown" id="userDropdown">
            <div class="user-dropdown-header">
                <div class="user-fullname">${name}</div>
                ${phone ? `<div class="user-phone">${phone}</div>` : ''}
            </div>
            <a href="https://datlichlamtoc.id.vn/profile.html" class="user-dropdown-item">
    <span class="item-icon">👤</span> Thông tin cá nhân
</a>
<a href="https://datlichlamtoc.id.vn/orders.html" class="user-dropdown-item">
    <span class="item-icon">📋</span> Đơn đặt lịch
</a>
            <a href="https://giaodiendatlich.vercel.app/index.html" class="user-dropdown-item">
                <span class="item-icon">🎁</span> Khuyến mãi của tôi
            </a>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item logout-item" id="logoutBtn">
                <span class="item-icon">🚪</span> Đăng xuất
            </button>
        </div>
    `;

    parentContainer.replaceWith(wrapper);


    const avatarBtn = document.getElementById('userAvatarBtn');
    const dropdown  = document.getElementById('userDropdown');

    avatarBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        avatarBtn.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove('show');
            avatarBtn.classList.remove('open');
        }
    });


    document.getElementById('logoutBtn').addEventListener('click', async function () {
        const token = getStoredToken();
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } catch (e) {
                console.warn('Logout API lỗi:', e);
            }
        }
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        window.location.reload();
    });
}

async function initAuthUI() {
    const token = getStoredToken();
    if (!token) return;

    let user = getStoredUser();

    
    if (!user) {
        const decoded = parseJwt(token);
        if (!decoded) return;

        const userId = decoded.id || decoded.user_id;
        if (!userId) return;

        const freshUser = await fetchUserInfo(userId, token);
        if (!freshUser) return;

        localStorage.setItem(USER_INFO_KEY, JSON.stringify(freshUser));
        user = freshUser;
    }

    buildUserDropdown(user);
}


document.addEventListener('DOMContentLoaded', function () {
    initAuthUI();
});

async function handleBookingByPhone() {
    const phoneInput = document.getElementById("phoneInput");
    const phone = phoneInput.value.trim();

    if (!phone) {
        showBookingMessage("Vui lòng nhập số điện thoại.", "error");
        return;
    }

    if (!/^(0|\+84)\d{9,10}$/.test(phone)) {
        showBookingMessage("Số điện thoại không hợp lệ.", "error");
        return;
    }

    
    localStorage.setItem("userPhone", phone);

   
    const bookingUrl = new URL("https://tranthitrucly.io.vn/datlich");
    bookingUrl.searchParams.append("phone", phone);
    
    window.location.href = bookingUrl.toString();
}



function viewServiceDetail(id) {
    const url = `https://forman-detail-services.vercel.app/?id=${id}`;
    console.log("Redirect tới Service Detail:", url);
    window.location.href = url;
}


async function renderServices(services) {
    const carouselTrack = document.getElementById("carouselTrack");
    if (!carouselTrack) return;

    carouselTrack.innerHTML = "";
    const topServices = services.slice(0, 8);

    for (const service of topServices) {
        const imageUrl = await fetchServiceMedia(service.id);

        const card = document.createElement("div");
        card.className = "carousel-item";

        card.innerHTML = `
            <div class="carousel-card">
                <img src="${imageUrl}" alt="${service.tendichvu || "Dịch vụ"}">
                <div class="carousel-card-content">
                    <h4>${service.tendichvu || "Dịch vụ"}</h4>
                    <p class="carousel-price">${formatCurrency(service.dongia)}</p>
                    <button class="carousel-card-btn">Chi tiết</button>
                </div>
            </div>
        `;
        
        const detailBtn = card.querySelector(".carousel-card-btn");
        detailBtn.addEventListener("click", () => viewServiceDetail(service.id));
        
        carouselTrack.appendChild(card);
    }
    initCarousel();
}

function viewPromotionDetail(id) {
    const url = `promotion-detail.html?id=${id}`;
    console.log("Redirect tới:", url);
    window.location.href = url;
}


function initCarousel() {
    const carouselTrack = document.getElementById("carouselTrack");
    const carouselPrev = document.getElementById("carouselPrev");
    const carouselNext = document.getElementById("carouselNext");

    if (!carouselTrack || !carouselPrev || !carouselNext) return;

    let currentPosition = 0;
    let itemWidth = 0;
    let gapSize = 20;

    function updateItemWidth() {
        const item = carouselTrack.querySelector(".carousel-item");
        if (item) {
            itemWidth = item.offsetWidth;
        }
    }

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentPosition}px)`;
    }

    function scroll(direction) {
        updateItemWidth();
        const scrollAmount = itemWidth + gapSize;
        const maxScroll = Math.max(0, carouselTrack.scrollWidth - carouselTrack.parentElement.offsetWidth);

        if (direction === "next") {
            currentPosition = Math.min(currentPosition + scrollAmount, maxScroll);
        } else {
            currentPosition = Math.max(currentPosition - scrollAmount, 0);
        }

        updateCarousel();
    }

    carouselPrev.onclick = () => scroll("prev");
    carouselNext.onclick = () => scroll("next");

    window.addEventListener("resize", updateItemWidth);
    updateItemWidth();
}


function initPromotionCarousel() {
    const promotionTrack = document.getElementById("promotionTrack");
    const promotionPrev = document.getElementById("promotionPrev");
    const promotionNext = document.getElementById("promotionNext");

    if (!promotionTrack || !promotionPrev || !promotionNext) return;

    let currentPosition = 0;
    let itemWidth = 0;
    let gapSize = 20;

    function updateItemWidth() {
        const item = promotionTrack.querySelector(".carousel-item");
        if (item) {
            itemWidth = item.offsetWidth;
        }
    }

    function updateCarousel() {
        promotionTrack.style.transform = `translateX(-${currentPosition}px)`;
    }

    function scroll(direction) {
        updateItemWidth();
        const scrollAmount = itemWidth + gapSize;
        const maxScroll = Math.max(0, promotionTrack.scrollWidth - promotionTrack.parentElement.offsetWidth);

        if (direction === "next") {
            currentPosition = Math.min(currentPosition + scrollAmount, maxScroll);
        } else {
            currentPosition = Math.max(currentPosition - scrollAmount, 0);
        }

        updateCarousel();
    }

    promotionPrev.onclick = () => scroll("prev");
    promotionNext.onclick = () => scroll("next");

    window.addEventListener("resize", updateItemWidth);
    updateItemWidth();
}

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
        dropdown.innerHTML = `<div class="search-no-result">Không tìm thấy dịch vụ nào</div>`;
        dropdown.classList.add("show");
        return;
    }

    results.forEach((service) => {
        const item = document.createElement("div");
        item.className = "search-result-item";

        item.innerHTML = `
            <span class="search-result-name">${service.tendichvu || "Dịch vụ"}</span>
            <span class="search-result-price">${formatCurrency(service.dongia)}</span>
        `;

        
        item.addEventListener("click", () => {
            searchInput.value = service.tendichvu || "";
            closeSearchDropdown();
            
            
            const newUrl = `https://forman-detail-services.vercel.app/?id=${service.id}`;
            console.log("Chuyển đến:", newUrl);
            window.location.href = newUrl;
        });

        dropdown.appendChild(item);
    });

    dropdown.classList.add("show");
}

function closeSearchDropdown() {
    const dropdown = document.getElementById("searchDropdown");
    if (dropdown) dropdown.classList.remove("show");
}

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
        const response = await fetch(`${API_BASE_URL}/services/search`, {
            method: "POST",                         
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                tendichvu: keyword,                
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Kết quả tìm kiếm:", data);
        const results = Array.isArray(data) ? data : data.data || [];
        renderSearchResults(results);

    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        if (dropdown) {
            dropdown.innerHTML = `<div class="search-no-result">Lỗi kết nối, thử lại sau</div>`;
        }
    }
}


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
            clearTimeout(searchTimer);
            searchServices(this.value);
        }
    });

    searchBtn.addEventListener("click", function () {
        clearTimeout(searchTimer);
        searchServices(searchInput.value);
    });

    
    document.addEventListener("click", function (e) {
        const searchBar = document.querySelector(".search-bar");
        if (searchBar && !searchBar.contains(e.target)) {
            closeSearchDropdown();
        }
    });
}



document.addEventListener("DOMContentLoaded", function () {
    initSlider();
    fetchServices();
    fetchPromotions();
    initSearch(); 

    const bookingBtn = document.getElementById("bookingBtn");
    if (bookingBtn) {
        bookingBtn.addEventListener("click", handleBookingByPhone);
    }
});
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}