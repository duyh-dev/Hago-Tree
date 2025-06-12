const productsArray = Object.entries(products).map(([id, product]) => ({
  id,
  ...product,
}));
let stars;
const user = JSON.parse(localStorage.getItem("user")) || [];
const feedbackData = document.getElementById("feedbackData");
let productbuyed = JSON.parse(localStorage.getItem("Productbuyed")) || [];
const FeedBackForm = `<form id="feedbackForm">
        <h2>Đăng nhập</h2>
        <label for="loginEmail">Email</label>
        <input
          type="text"
          id=""
          placeholder="Nhập nhận xét của bạn"
        />
        <button type="submit">Gửi</button>
      </form>`


// Hàm lấy tham số từ URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Hiển thị chi tiết một sản phẩm theo id
function displayProduct(id) {
  const container = document.getElementById("product-detail");
  const product = products[id];
  
  loadFeedbackAndAvg(id)
  if (product) {
    container.innerHTML = `
      <div class="single-product">
        <img src="${product.img}" alt="${product.name}" />
        <div class="product-info">
          <h2>${product.name}</h2>
          <div class="product-price">${product.price}</div>
          <p class="product-description">${product.description}</p>
          <div class="feedback-stars"><strong>Đánh giá trung bình:</strong> ${stars}</div>
          <button onclick="addToCart('${product.name}', '${product.price}', '${product.img}')">
            Thêm vào giỏ hàng
          </button>
          <form id="feedbackForm"  class="form-container">
            <h2>Gửi đánh giá</h2>

            <label for="starRating">Đánh giá sao:</label>
            <div id="starRating" class="starsx1">
              <span data-star="1">★</span>
              <span data-star="2">★</span>
              <span data-star="3">★</span>
              <span data-star="4">★</span>
              <span data-star="5">★</span>
            </div>

            <label for="feedbackContent">Nhận xét của bạn</label>
            <input type="text" id="feedbackContent" required placeholder="Nhập nhận xét của bạn" /><br>

            <label for="image">Ảnh minh họa:</label>
            <input type="file" id="image" name="image" accept="image/*" /><br>



            <button type="submit">Gửi</button>
          </form>

          <div id="feedbackList"></div>
        </div>
      </div>
    `;

    // Gắn sự kiện sau khi form render
    setTimeout(() => {
       let selectedRating = 0;
        document.querySelectorAll("#starRating span").forEach(star => {
          star.addEventListener("click", function () {
            selectedRating = parseInt(this.dataset.star);
            document.querySelectorAll("#starRating span").forEach(s => {
              s.classList.toggle("selected", parseInt(s.dataset.star) <= selectedRating);
            });
          });
        });

      const form = document.getElementById("feedbackForm");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const content = document.getElementById("feedbackContent").value;
        const imageInput = document.getElementById("image");
        const imageFile = imageInput.files[0];

        try {
          const userData = JSON.parse(localStorage.getItem("user")) || [];
          const userPassword = localStorage.getItem("userPassword") || "";

          if (userData.length > 0 && userPassword.length > 0) {
            const lastUser = userData[userData.length - 1];
            const email = lastUser.email;

            let base64Image = "";
            if (imageFile) {
              try {
                base64Image = await convertToBase64(imageFile);
              } catch (err) {
                console.error("Lỗi chuyển ảnh:", err);
                alert("Không thể xử lý ảnh!");
                return;
              }
            }
            const data = {
              star:selectedRating,
              idsp: id,
              product: product.name,
              feedback: content,
              email: email,
              image: base64Image
            };

            fetch("https://server-web-hagotree.glitch.me/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })
              .then((response) => {
                if (response.ok || response.status === 201) {
                  alert("Gửi đánh giá thành công!");
                  form.reset();
                } else {
                  alert("Có lỗi xảy ra khi gửi đánh giá.");
                }
              })
              .catch(() => alert("Lỗi kết nối server."));
          } else {
            alert("Vui lòng đăng nhập để tiếp tục bình luận !!");
            setTimeout(() => {
              window.location.href = "../HTML/dangnhap.html";
            }, 2000);
          }
        } catch (error) {
          console.error("Lỗi xử lý đánh giá:", error);
          alert("Vui lòng đăng nhập để tiếp tục bình luận !! -ER1");
          setTimeout(() => {
            window.location.href = "../HTML/dangnhap.html";
          }, 2000);
        }
      });
    }, 0);
  }
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadFeedbackAndAvg(productName) {
  try {
    const res = await fetch("https://server-web-hagotree.glitch.me/fb");
    if (!res.ok) throw new Error("Không tải được feedback");

    const allFb = await res.json();
    const fbs = allFb.filter(fb => fb.idsp === productName);
    const sum = fbs.reduce((a, b) => a + (b.star || 0), 0);
    const avg = fbs.length ? (sum / fbs.length) : 0;
    const starCount = Math.round(avg);
    document.querySelector(".feedback-stars").innerHTML = `
      <strong>Đánh giá trung bình:</strong> ${avg.toFixed(1)} / 5 
      <span style="color:orange">${"★".repeat(starCount)}${"☆".repeat(5 - starCount)}</span>
    `;
    const list = document.getElementById("feedbackList");
    list.innerHTML = ""; 

    fbs.forEach(data => {
      const item = document.createElement("div");
      item.className = "feedback-itemx1";
      let imagefiledata="";
      const starStr = "★".repeat(data.star || 0) + "☆".repeat(5 - (data.star || 0));
      if(data.image){imagefiledata=` src="https://server-web-hagotree.glitch.me${data.image}"`}
      item.innerHTML = `
        <div class="feedback-stars-small"><strong>Đánh giá:</strong> ${starStr}</div>
        <div class="feedback-content"><strong>${data.email}:</strong> ${data.feedback} <div style"border: 2px solid red ;border-style: solid;"><img ${imagefiledata} style="width:25%;height:25%"></div></div>
      `;
      list.appendChild(item);
      
    });

  } catch (err) {
    console.error("Lỗi load feedback:", err);
    document.querySelector(".feedback-stars").innerHTML = `
      <strong>Đánh giá trung bình:</strong> chưa có
    `;
  }
}

// Hiển thị danh sách tất cả sản phẩm
function displayProducts(items) {
  const container = document.getElementById("product-detail");

  if (items.length === 0) {
    container.innerHTML = "<p class='not-found'>Không có sản phẩm phù hợp.</p>";
    return;
  }

  // Create a title for the products page
  const title = document.createElement("h1");
  title.textContent = "Sản phẩm của chúng tôi";
  title.style.marginBottom = "20px";
  title.style.color = "#333";

  // Create grid container
  const grid = document.createElement("div");
  grid.className = "products-grid";

  items.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.className = "product-image";
    img.src = product.img;
    img.alt = product.name;

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const desc = document.createElement("p");
    desc.className = "product-description";
    desc.textContent = product.description;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = product.price;

    info.appendChild(name);
    info.appendChild(desc);
    info.appendChild(price);

    card.appendChild(img);
    card.appendChild(info);

    // Clicking product to go to detail page
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = window.location.pathname + "?id=" + product.id;
    });

    grid.appendChild(card);
  });

  // Clear container and add new elements
  container.innerHTML = "";
  container.appendChild(title);
  container.appendChild(grid);
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ép kiểu price về dạng số an toàn
  price = Number(String(price).replace(/[.,₫]/g, ""));

  const existingItemIndex = cart.findIndex((item) => item.name === name);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Đã thêm vào giỏ hàng!");
  location.reload();
}

// Hàm cho nút quay lại
function goBack() {
  const id = getQueryParam("id");
  if (id) {
    // If we're on a product detail page, go back to product listing
    window.location.href = window.location.pathname;
  } else {
    // Otherwise use browser back
    window.history.back();
  }
}

// Khi trang tải xong
window.onload = () => {
  const id = getQueryParam("id");
  if (id && products[id]) {
    displayProduct(id);
  } else {
    displayProducts(productsArray);
  }

  // Thiết lập chức năng tìm kiếm
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = productsArray.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
      displayProducts(filtered);
    });
  }
};
