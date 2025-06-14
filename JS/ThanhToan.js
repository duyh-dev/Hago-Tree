let cart = JSON.parse(localStorage.getItem("cart")) || [];
let TotalPriceToSummary = 0;
var ProductWillBuy = ""
var username = removeVietnameseTones();
window.addEventListener("DOMContentLoaded", () => {});
var getidsummary = idsummaryCreator(username)
const checkoutForm=document.getElementById("CheckoutForm")
function idsummaryCreator(useridx) {
  const d = new Date();
  let time = d.getTime();
  return time+useridx
}

function removeVietnameseTones() {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  try {
    if (
      (user.length > 0) &
      (localStorage.getItem("userPassword").length > 0)
    ) {
      const lastUser = user[user.length - 1];
      console.log(lastUser.email);

      document.getElementById("Accountchecker").innerHTML = lastUser.email;
      loadDataofUser(lastUser.email);
      var usernamerecheck = lastUser.email;
      return usernamerecheck
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    } else {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán !!");
      setTimeout(() => {
        window.location.href = "../HTML/dangnhap.html";
      }, 2000);
    }
  } catch {
    alert("Vui lòng đăng nhập để tiếp tục thanh toán !! -ER1");
    setTimeout(() => {
      window.location.href = "../HTML/dangnhap.html";
    }, 2000);
  }
}
function loadDataofUser(userid) {
  fetch('https://server-web-hagotree.glitch.me/get-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: userid })
  })
    .then(res => res.json())
    .then(user => {
      if (!user || user.message) {
        alert('Không tìm thấy người dùng');
        return;
      }

      // Gán vào input
      document.getElementById("Name").value = user.registerName || "";
      document.getElementById("email").value = user.registerEmail || "";
      document.getElementById("phone").value = user.sdt || "";
      document.getElementById("address").value = user.address || "";
    })
    .catch(err => {
      console.error("Lỗi khi tải dữ liệu:", err);
    });
}
function displayOrderSummary() {
  const cartItemsContainer = document.getElementById("cart-items-summary");
  const cartTotal = document.getElementById("cart-total-summary");
  let productbuyed = JSON.parse(localStorage.getItem("Productbuyed")) || [];
  let productnowbuying = [];
  ProductWillBuy = JSON.stringify(cart); 
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
  TotalPriceToSummary = total;
}

// Kiểm tra thông tin trước khi summit thanh toán
function validateCheckoutForm(event) {

  const form =
    event.target || document.querySelector(".checkout-container form");
  let valid = true;

  form
    .querySelectorAll("input, select")
    .forEach((el) => el.classList.remove("error"));

  // Kiểm tra các trường required
  ["firstName", "lastName", "address", "city", "phone", "email"].forEach(
    (id) => {
      const input = form.querySelector("#" + id);
      if (input && input.hasAttribute("required") && !input.value.trim()) {
        input.classList.add("error");
        valid = false;
      }
    }
  );

  // Kiểm tra email hợp lệ
  const email = form.querySelector("#email");
  if (
    email &&
    email.value &&
    !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)
  ) {
    email.classList.add("error");
    valid = false;
  }

  if (!valid) {
    alert("Vui lòng nhập đầy đủ và đúng các trường bắt buộc!");
    event.preventDefault();
    return false;
  }
  return true;
}

// Gán sự kiện cho form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".checkout-container form");
  if (form) {
    form.onsubmit = validateCheckoutForm;
  }
});

function confirmPayment() {

  localStorage.removeItem("cart");

}

// Display the order summary when the page loads
document.addEventListener("DOMContentLoaded", displayOrderSummary);

//QR thanh toán
function generateQRCode(paymentData) {
  // Create a dynamic URL (e.g., payment URL or MoMo/ZaloPay link)
  const paymentURL = `https://pay.example.com/${paymentData.paymentLink}`;

  // Set the QR code image
  const qrCodeImage = document.getElementById("qr-code-image");
  qrCodeImage.src = `https://img.vietqr.io/image/MB-0336735887-qr_only.png?amount=${TotalPriceToSummary}&addInfo=${getidsummary}&size=200x200`;
  console.log(username);
  document.getElementById("id_summary").innerText = getidsummary;
  console.log(ProductWillBuy);
}

// Example of payment data
const paymentData = {
  paymentLink: "example-payment-id-12345",
};

// Generate QR code on page load
document.addEventListener("DOMContentLoaded", () => {
  generateQRCode(paymentData);
});
checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const d = new Date();
  const daynow =d.getHours()+":"+d.getMinutes()+" "+d.getDate()+"/"+(d.getMonth() + 1)+"/"+d.getFullYear();
  console.log(daynow);
  const checkoutFormdata = Object.fromEntries(new FormData(checkoutForm).entries()); 
  checkoutFormdata.DonHang = ProductWillBuy;
  const city = document.getElementById("city").value;
  const district = document.getElementById("district").value;
  const ward = document.getElementById("ward").value;
  checkoutFormdata.MaGiaoDich = getidsummary;
  checkoutFormdata.Ttdon = "Chờ xác nhận";
  checkoutFormdata.TimeDatHang = daynow;
  checkoutFormdata.TimeNhanHang ="Sẽ có sau khi xác nhận"
  checkoutFormdata.DiaChiTinhThanh= ward +","+district+","+city;  
  fetch('https://server-web-hagotree.glitch.me/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkoutFormdata)  // xử lý các phần riêng biệt thành những phần tử trong json
  })

  .then(response => {
    if (response.status === 201) {
      alert('Đã thanh toán, sẽ có email xác nhận đơn!');
      showPaymentSuccessModal();
      checkoutForm.reset();
      confirmPayment();
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
  })
});


// function cho modal (gọi function này sau khi xác nhận thanh toán từ ngân hàng)
function showPaymentSuccessModal() {
  var modal = document.getElementById("payment-success-modal");
  var username = localStorage.getItem("username") || "Khách hàng";
  document.getElementById("modal-username").textContent = username;
  modal.style.display = "flex";

}
function closeSuccessModal() {
  document.getElementById("payment-success-modal").style.display = "none";
}
