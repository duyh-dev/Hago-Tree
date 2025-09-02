
const container = document.querySelector(".slider-container");
const slides = document.querySelectorAll(".slide");
const prev = document.querySelector(".prev-btn");
const next = document.querySelector(".next-btn");

let index = 0;
const totalSlides = slides.length;

// Hàm hiển thị 1 ảnh theo index
function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[i].classList.add("active");
}

// Nút next
next.addEventListener("click", () => {
  index = (index + 1) % totalSlides;
  showSlide(index);
});

// Nút prev
prev.addEventListener("click", () => {
  index = (index - 1 + totalSlides) % totalSlides;
  showSlide(index);
});

// Auto chạy sau 3s
setInterval(() => {
  index = (index + 1) % totalSlides;
  showSlide(index);
}, 3000);

// Khởi động hiển thị slide đầu tiên
showSlide(index);


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

window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
    const lastUser = user[user.length - 1];
    console.log(lastUser.email);
    document.getElementById("Accountchecker").innerHTML = lastUser.email;
    }
});
