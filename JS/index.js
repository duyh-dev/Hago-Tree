// Lấy các phần tử DOM cần thiết
const container = document.querySelector(".slider-container");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prev = document.querySelector(".prev-btn");
const next = document.querySelector(".next-btn");
document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chuyển trang
    
    const sanPhamDiv = this.closest(".SanPham");
    const name = sanPhamDiv.querySelector("h3").innerText;
    const priceText = sanPhamDiv.querySelector("p").innerText;
    const image = sanPhamDiv.querySelector("img").getAttribute("src");

    const price = Number(priceText.replace(/[^\d]/g, ""));

    addToCart(name, price, image);
  });
});

async function loadTatCaSanPhamTheoTag() {
  try {
    const res = await fetch("https://dssc.hagotree.site/sp/12");
    const data = await res.json();

    const template = document.getElementById("sanpham-template");
    if (!template) {
      console.error("Không tìm thấy template sản phẩm!"); 
      return;
    }

    const reversed = [...data].reverse(); // Sản phẩm mới nhất lên trước

    reversed.forEach((sp, index) => {
      const container = document.getElementById(sp.tag_product);
      if (!container) return;

      const clone = template.cloneNode(true);
      clone.style.display = "block";

      // Gán dữ liệu    <a id="addcart" href="#" class="btnx add-cart">Giỏ hàng</a>

      clone.querySelector("#image").src = "https://dssc.hagotree.site" + sp.image;
      clone.querySelector("#title").textContent = sp.title;
      clone.querySelector("#cost").textContent = `Giá: ${parseInt(sp.cost).toLocaleString("vi-VN")}₫`;
      const title = encodeURIComponent(sp.title);
      const cost = encodeURIComponent(sp.cost);
      const image = encodeURIComponent(sp.image);
      clone.querySelector("#add-cart").innerHTML = `<button class="btnx" onclick="addToCart(decodeURIComponent('${title}'), decodeURIComponent('${cost}'), decodeURIComponent('${image}'))">Giỏ hàng</button>`;
      const n = index + 1; 
      clone.querySelector(".detail-link").href = `../HTML/SanPham.html?id=${sp.id}`;
      let innerContainer = container.querySelector("#sanpham-container");
      if (!innerContainer) {
        innerContainer = document.createElement("div");
        innerContainer.id = "sanpham-container";
        container.appendChild(innerContainer);
      }

      innerContainer.appendChild(clone);
    });

  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
  }
}

// Gọi khi load file JS
window.addEventListener("DOMContentLoaded", loadTatCaSanPhamTheoTag);



// Khai báo biến chỉ số và tốc độ chuyển slide
let index = 0;
let interval;
const speed = 3000; // canh thời gian chạy slide
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
    const lastUser = user[user.length - 1];
    console.log(lastUser.email);
    document.getElementById("Accountchecker").innerHTML = lastUser.email;
    }
});
// Hiển thị slide theo chỉ số
const show = (i) => {
  slides.forEach((s) => s.classList.remove("active")); // Ẩn tất cả slide
  slides[i].classList.add("active"); // Hiện slide được chọn
};

// Chuyển đến slide kế tiếp
const nextSlide = () => {
  index = (index + 1) % slides.length;
  show(index);
};

// Quay lại slide trước
const prevSlide = () => {
  index = (index - 1 + slides.length) % slides.length;
  show(index);
};

// Bắt đầu tự động chạy slider
const start = () => (interval = setInterval(nextSlide, speed));

// Dừng chạy tự động
const stop = () => clearInterval(interval);

// Khởi động ban đầu
show(index);
start();


// Dừng khi rê chuột vào slider, chạy lại khi rời chuột
container.addEventListener("mouseenter", stop);
container.addEventListener("mouseleave", start);

// Xử lý khi bấm nút điều hướng
next.addEventListener("click", () => {
  stop();
  nextSlide();
  start();
});
prev.addEventListener("click", () => {
  stop();
  prevSlide();
  start();
});
