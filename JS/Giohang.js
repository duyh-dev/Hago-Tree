let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
function updateCartCount() {
  const cartCountEl = document.querySelector(".cart-count");

  if (!Array.isArray(cart)) {
    console.warn("Giỏ hàng (cart) chưa tồn tại hoặc không phải mảng");
    return;
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
    cartCountEl.style.display = totalCount > 0 ? "inline-block" : "none";
  }
}

const searchInput = document.querySelector(".searchbox");

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const keyword = encodeURIComponent(searchInput.value.trim());
      if (keyword) {
        window.location.href = `search.html?s=${keyword}`;
      }
    }
  });
// Hiển thị sản phẩm trong giỏ hàng
function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotal) {
    console.error("Cart elements not found!");
    return; // Prevent further execution if elements don't exist
  }

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemPrice = Number(String(item.cost).replace(/[.,₫]/g, ""));
    const itemTotal = itemPrice * item.quantity;
    total += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="https://dssc.hagotree.site${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <p>Giá: ${itemPrice.toLocaleString()}₫</p>
        <div class="quantity-controls">
          <button class="decrease-btn">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase-btn">+</button>
        </div>
        <button class="remove-btn">Xóa</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);

    // Add event listeners for quantity controls and remove button
    itemDiv.querySelector(".increase-btn").addEventListener("click", () => {
      changeQuantity(index, 1);
    });

    itemDiv.querySelector(".decrease-btn").addEventListener("click", () => {
      changeQuantity(index, -1);
    });

    itemDiv.querySelector(".remove-btn").addEventListener("click", () => {
      removeItem(index);
    });
  });

  // Update cart total
  cartTotal.textContent = `${total.toLocaleString()}₫`;

  // Update the cart count in the header
  updateCartCount();
}

// Change product quantity and update cart
function changeQuantity(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Xóa sản phẩm nếu số lượng <= 0
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Remove product from cart
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Initialize cart when page is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page Loaded");
  displayCart(); // Show cart items
  updateCartCount(); // Update the cart count in the header
});
