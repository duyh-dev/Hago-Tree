let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayOrderSummary() {
  const cartItemsContainer = document.getElementById("cart-items-summary");
  const cartTotal = document.getElementById("cart-total-summary");

  let total = 0;
  cartItemsContainer.innerHTML = ""; // Reset the container

  cart.forEach((item) => {
    const itemPrice = item.price;
    const itemTotal = itemPrice * item.quantity;
    total += itemTotal;

    // Create list item for each product, including the image
    const itemDiv = document.createElement("li");
    itemDiv.className = "cart-item-summary";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${
      item.name
    }" class="product-image" style="width: 50px; height: 50px; margin-right: 10px;">
      ${item.name} - ${item.quantity} x ${itemPrice.toLocaleString()}₫
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = `${total.toLocaleString()}₫`;
}

function confirmPayment() {
  const paymentStatus = document.getElementById("payment-status");

  // Here you would typically check with a payment gateway or API
  // For now, let's simulate the confirmation process
  paymentStatus.textContent = "Thanh toán đã được xác nhận!";
  paymentStatus.style.color = "green";

  // Optionally clear the cart after payment is confirmed
  localStorage.removeItem("cart");

  // Reset the QR code or move to a confirmation page
  setTimeout(() => {
    window.location.href = "../HTML/index.html"; // Redirect after confirmation
  }, 2000);
}

// Display the order summary when the page loads
document.addEventListener("DOMContentLoaded", displayOrderSummary);

//QR thanh toán
function generateQRCode(paymentData) {
  // Create a dynamic URL (e.g., payment URL or MoMo/ZaloPay link)
  const paymentURL = `https://pay.example.com/${paymentData.paymentLink}`;

  // Set the QR code image
  const qrCodeImage = document.getElementById("qr-code-image");
  qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    paymentURL
  )}&size=200x200`;
}

// Example of payment data
const paymentData = {
  paymentLink: "example-payment-id-12345",
};

// Generate QR code on page load
document.addEventListener("DOMContentLoaded", () => {
  generateQRCode(paymentData);
});
