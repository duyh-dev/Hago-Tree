const productsArray = Object.entries(products).map(([id, product]) => ({
  id,
  ...product,
}));
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

  if (product) {
    container.innerHTML = `
      <div class="single-product">
        <img src="${product.img}" alt="${product.name}" />
        <div class="product-info">
          <h2>${product.name}</h2>
          <div class="product-price">${product.price}</div>
          <p class="product-description">${product.description}</p>
          <button onclick="addToCart('${product.name}', '${product.price}', '${product.img}')">
            Thêm vào giỏ hàng
          </button>
          <form id="feedbackForm">
            <h2>Gửi đánh giá</h2>
            <label for="feedbackContent">Nhận xét của bạn</label>
            <input
              type="text"
              id="feedbackContent"
              required
              placeholder="Nhập nhận xét của bạn"
            /><br>
            <label for="image">Ảnh minh họa (chọn từ máy):</label>
            <input type="file" id="image" name="image" accept="image/*" />
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>
    `;

    // Gắn sự kiện sau khi form render
    setTimeout(() => {
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
