let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Hiển thị sản phẩm trong giỏ hàng
function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
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

    // Gắn sự kiện trực tiếp cho nút
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

  cartTotal.textContent = `${total.toLocaleString()}₫`;
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Xóa sản phẩm nếu số lượng <= 0
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Khởi tạo giỏ hàng khi trang được tải
document.addEventListener("DOMContentLoaded", displayCart);
