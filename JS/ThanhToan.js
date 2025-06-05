let cart = JSON.parse(localStorage.getItem("cart")) || [];
let TotalPriceToSummary =0;
var username = removeVietnameseTones()
window.addEventListener("DOMContentLoaded", () => {
  
});
function removeVietnameseTones() {


  const user = JSON.parse(localStorage.getItem("user")) || [];
  try{
    if ((user.length > 0) & (sessionStorage.getItem("userPassword").length >0 )) {
        const lastUser = user[user.length - 1];
        console.log(lastUser.email);
        document.getElementById("Accountchecker").innerHTML = lastUser.email;

         var usernamerecheck = lastUser.email;
        return usernamerecheck 
          .normalize("NFD")                         
          .replace(/[\u0300-\u036f]/g, "")        
          .replace(/đ/g, "d")                    
          .replace(/Đ/g, "D")                    
          .replace(/[^a-zA-Z0-9\s]/g, "")         
          .replace(/\s+/g, " ")                 
          .trim();  
        }
         else{
      alert('Vui lòng đăng nhập để tiếp tục thanh toán !!');
        setTimeout(() => {
    window.location.href = "../HTML/DangNhap.html";
      }, 2000);

    }

  }
    catch{
        alert('Vui lòng đăng nhập để tiếp tục thanh toán !!');
        setTimeout(() => {
    window.location.href = "../HTML/DangNhap.html";
      }, 2000);
    }
                                  
}

function displayOrderSummary() {
  const cartItemsContainer = document.getElementById("cart-items-summary");
  const cartTotal = document.getElementById("cart-total-summary");
  let productbuyed = JSON.parse(localStorage.getItem("Productbuyed")) || [];
  let productnowbuying =[]
  let total = 0;
  cartItemsContainer.innerHTML = ""; // Reset the container
  
  // Cập nhật productbuyed vào localStorage
  cart.forEach((item) => {
    const itemPrice = item.price;
    const itemTotal = itemPrice * item.quantity;
    total += itemTotal;
    if (!productbuyed.includes(item.name)) {
      productnowbuying.push(item.name);
    }
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
 console.log(JSON.stringify(productnowbuying));
 localStorage.setItem("Productbuyed", JSON.stringify(productnowbuying));
  cartTotal.textContent = `${total.toLocaleString()}₫`;
  TotalPriceToSummary=total;
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
  qrCodeImage.src = `https://img.vietqr.io/image/MB-0336735887-qr_only.png?amount=${TotalPriceToSummary}&addInfo=Tt%20cay%20canh%20cho%20tk%20${username}&size=200x200`;
   console.log(username)

}

// Example of payment data
const paymentData = {
  paymentLink: "example-payment-id-12345",
};

// Generate QR code on page load
document.addEventListener("DOMContentLoaded", () => {
  generateQRCode(paymentData);
});
