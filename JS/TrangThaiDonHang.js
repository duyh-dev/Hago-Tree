setTimeout(() => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "[]");

    if (
      user.length > 0 &&
      localStorage.getItem("userPassword") &&
      localStorage.getItem("userPassword").length > 0
    ) {
      const lastUser = user[user.length - 1];
      const ordersList = document.getElementById("orders-list");

      fetch("https://dssc.hagotree.site/get-don-hang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: lastUser.email })
      })
        .then(res => res.json())
        .then(donhang => {
          if (!donhang || !Array.isArray(donhang)) {
            alert('Không tìm thấy đơn hàng');
            return;
          }

          const orders = donhang; 

          let html = `
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#e8f5e9;">
                  <th style="padding:8px;border:1px solid #d0e6d0;">STT</th>
                  <th style="padding:8px;border:1px solid #d0e6d0;">Sản phẩm đặt hàng</th>
                  <th style="padding:8px;border:1px solid #d0e6d0;">Trạng thái đơn hàng</th>
                  <th style="padding:8px;border:1px solid #d0e6d0;">Mã giao dịch</th>
                  <th style="padding:8px;border:1px solid #d0e6d0;">Thời gian mua hàng</th>
                  <th style="padding:8px;border:1px solid #d0e6d0;">Thời gian nhận hàng dự kiến</th>
                </tr>
              </thead>
              <tbody>
          `;

          orders.reverse().forEach((order, idx) => {
            let products = "";
            try {
              const productList = JSON.parse(order.DonHang || "[]");
              products = productList
                .map(p => `${p.name} (SL: ${p.quantity}, Giá: ${p.price.toLocaleString()}đ)`)
                .join("<br>");
            } catch {
              products = "---";
            }

            html += `
              <tr>
                <td style="padding:8px;border:1px solid #d0e6d0;text-align:center;">${idx + 1}</td>
                <td style="padding:8px;border:1px solid #d0e6d0;">${products}</td>
                <td style="padding:8px;border:1px solid #d0e6d0;color:#27ae60;">${order.Ttdon || ""}</td>
                <td style="padding:8px;border:1px solid #d0e6d0;">${order.MaGiaoDich || ""}</td>
                <td style="padding:8px;border:1px solid #d0e6d0;">${order.TimeDatHang || ""}</td>
                <td style="padding:8px;border:1px solid #d0e6d0;">${order.TimeNhanHang || ""}</td>
              </tr>
            `;
          });

          html += `</tbody></table></div>`;
          ordersList.innerHTML = html;
        });

    } else {
      alert("Vui lòng đăng nhập để tiếp tục xem !!");
      setTimeout(() => {
        window.location.href = "../HTML/dangnhap.html";
      }, 2000);
    }
  } catch (e) {
    alert("Vui lòng đăng nhập để tiếp tục xem !! -ER1");
    setTimeout(() => {
      window.location.href = "../HTML/dangnhap.html";
    }, 2000);
  }
}, 100);   





