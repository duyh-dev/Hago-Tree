// Lấy tên tài khoản từ localStorage (nếu có)
document.getElementById("username").textContent =
  localStorage.getItem("username") || "bạn";

// Generate mã đơn hàng nếu chưa có
let orderId = localStorage.getItem("orderId");
if (!orderId) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const timeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  orderId = `ORD${timeStr}${randomStr}`;
  localStorage.setItem("orderId", orderId);
}
document.getElementById("order-id").textContent = orderId;

// Hiển thị thời gian đặt hàng
let orderTime = localStorage.getItem("orderTime");
if (!orderTime) {
  orderTime = new Date().toLocaleString();
  localStorage.setItem("orderTime", orderTime);
}
document.getElementById("order-time").textContent = orderTime;

//Hiển thị đơn hàng
function renderOrdersTable() {
  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const ordersList = document.getElementById("orders-list");
  if (orders.length === 0) {
    ordersList.innerHTML =
      '<div style="margin:20px 0;">Bạn chưa có đơn hàng nào.</div>';
    return;
  }
  let html = `
    <div style="overflow-x:auto;">
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#e8f5e9;">
          <th style="padding:8px;border:1px solid #d0e6d0;">STT</th>
          <th style="padding:8px;border:1px solid #d0e6d0;">Sản phẩm đặt hàng</th>
          <th style="padding:8px;border:1px solid #d0e6d0;">Thời gian đặt hàng</th>
          <th style="padding:8px;border:1px solid #d0e6d0;">Thời gian thanh toán</th>
          <th style="padding:8px;border:1px solid #d0e6d0;">Trạng thái đơn hàng</th>
          <th style="padding:8px;border:1px solid #d0e6d0;">Ngày dự kiến nhận</th>
        </tr>
      </thead>
      <tbody>
  `;
  orders.reverse().forEach((order, idx) => {
    html += `
      <tr>
        <td style="padding:8px;border:1px solid #d0e6d0;text-align:center;">${
          idx + 1
        }</td>
        <td style="padding:8px;border:1px solid #d0e6d0;">${
          order.products || "---"
        }</td>
        <td style="padding:8px;border:1px solid #d0e6d0;">${
          order.orderTime || ""
        }</td>
        <td style="padding:8px;border:1px solid #d0e6d0;">${
          order.paymentTime || ""
        }</td>
        <td style="padding:8px;border:1px solid #d0e6d0;color:#27ae60;">${
          order.status || "Đã thanh toán"
        }</td>
        <td style="padding:8px;border:1px solid #d0e6d0;">${
          order.estimatedDelivery || ""
        }</td>
      </tr>
    `;
  });
  html += `
      </tbody>
    </table>
    </div>
  `;
  ordersList.innerHTML = html;
}
renderOrdersTable();
