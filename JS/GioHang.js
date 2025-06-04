let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
function updateCartCount() {
  const cartCountEl = document.querySelector(".cart-count");
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
    cartCountEl.style.display = totalCount > 0 ? "inline-block" : "none"; // Hide when count is 0
  }
}

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
    const itemPrice = Number(String(item.price).replace(/[.,₫]/g, ""));
    const itemTotal = itemPrice * item.quantity;
    total += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
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
