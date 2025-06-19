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

function displayProduct(product) {
  const container = document.getElementById("product-detail");
  
  loadFeedbackAndAvg(product.id)
  if (product) {
    container.innerHTML = `
      <div class="single-product">
        <img src="https://dssc.hagotree.site${product.image}" alt="${product.title}" />
        <div class="product-info">
          <h2>${product.title}</h2>
          <div class="product-price">${Number(product.cost).toLocaleString()}₫</div>
          <div class="product-description">${product.content}</div>
          <div class="feedback-stars"><strong>Đánh giá trung bình:</strong> ${stars}</div>
          <button onclick="addToCart('${product.name}', '${product.price}', '${product.img}')">
            Thêm vào giỏ hàng
          </button>
          <form id="feedbackForm"  style=" border: 1px solid #ddd;border-radius: 10px;" class="form-container">
            <h2>Gửi đánh giá</h2>

            <label for="starRating" style="footer-container">Đánh giá sao:</label>
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



            <button type="submit" class="btn SanPham">Gửi</button>
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
              idsp: product.id,
              product: product.title,
              feedback: content,
              email: email,
              image: base64Image
            };

            fetch("https://dssc.hagotree.site/feedback", {
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
    const res = await fetch("https://dssc.hagotree.site/fb");
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

    fbs.reverse().forEach(data => {
      const item = document.createElement("div");
      item.className = "feedback-itemx1 product-card product-info ";
      let imagefiledata="";
      const starStr = "★".repeat(data.star || 0) + "☆".repeat(5 - (data.star || 0));
      if(data.image){imagefiledata=` src="https://dssc.hagotree.site${data.image}"`}
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


async function displayProducts() {
  const container = document.getElementById("product-detail");

  try {
    const res = await fetch("https://dssc.hagotree.site/sp/12");
    const items = await res.json();

    if (items.length === 0) {
      container.innerHTML = "<p class='not-found'>Không có sản phẩm phù hợp.</p>";
      return;
    }

    const reversedItems = [...items].reverse();

    const grid = document.createElement("div");
    grid.className = "products-grid"; 

    reversedItems.forEach((product, index) => {
      const stt = items.length - index; 

      const card = document.createElement("div");
      card.className = "product-card";
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `../HTML/SanPham.html?id=sp${stt}`;
      });

      const img = document.createElement("img");
      img.className = "product-image";
      img.src = "https://dssc.hagotree.site" + product.image;
      img.alt = product.title;

      const info = document.createElement("div");
      info.className = "product-info";

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.title;

      const desc = document.createElement("p");
      desc.className = "product-description";
      desc.textContent = product.content;

      const price = document.createElement("div");
      price.className = "product-price";
      price.textContent = `${parseInt(product.cost).toLocaleString("vi-VN")}₫`;

      info.appendChild(name);
      info.appendChild(desc);
      info.appendChild(price);

      card.appendChild(img);
      card.appendChild(info);

      grid.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(grid);
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    container.innerHTML = "<p class='error'>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
  }
}



// Thêm sản phẩm vào giỏ hàng
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ép kiểu price về dạng số an toàn
  cost = Number(String(price).replace(/[.,₫]/g, ""));
  const title = name;
  const existingItemIndex = cart.findIndex((item) => item.title === name);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({title, cost, image, quantity: 1 });
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


window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id"); 

  try {
    const res = await fetch("https://dssc.hagotree.site/sp/12");
    const allProducts = await res.json();
    
    if (id) {
      const matched = allProducts.find(p => p.id === id);
      console.log(matched)
      if (matched) {
        displayProduct(matched);
        return;
      } else {
        console.warn("Không tìm thấy sản phẩm:", id);
      }
    }

    displayProducts(allProducts);

  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    const container = document.getElementById("product-detail");
    container.innerHTML = "<p>Lỗi khi tải sản phẩm.</p>";
  }
};
