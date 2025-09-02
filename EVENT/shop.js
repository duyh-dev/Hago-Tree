const respone = document.getElementById("display-v1");
let userid ="";
respone.innerHTML = `
 <div class="shop-container">
    <div class="points">Điểm hiện có: <span id="points">0</span></div>

    <div class="items" id="shopList">
      <p>Đang tải voucher...</p>
    </div>

    <a href="index.html" class="back-link">⬅ Quay lại trang chính</a>
  </div>
`;
let vouchersCache = [];
let redeemedVouchers = [];
const email = "contact@palat.io.vn";
let totalPoints = 0;
let gameId = 11;
function loadRedeemed() {
  redeemedVouchers =
    JSON.parse(localStorage.getItem("redeemed_" + userid)) || [];
}
function getRedeemedVouchers() {
  if (!userid) return [];
  return JSON.parse(localStorage.getItem("redeemed_" + userid)) || [];
}

function saveRedeemed() {
  localStorage.setItem("redeemed_" + userid, JSON.stringify(redeemedVouchers));
}
async function loadPoints() {
  try {
    const res = await fetch(`https://dssc.hagotree.site/points/${email}`);
    const data = await res.json();
    const pointsObj = data.points
    if (!pointsObj || (typeof pointsObj === "object" && Object.keys(pointsObj).length === 0)) {
      pointsObj = 0;
    }
    totalPoints =pointsObj
    document.getElementById("points").textContent = totalPoints;
  } catch (err) {
    console.error("Lỗi lấy điểm:", err);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
      const lastUser = user[user.length - 1];
      console.log(lastUser.email);
      userid = lastUser.email;
    }
});
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
    const lastUser = user[user.length - 1];
    console.log(lastUser.email);
    document.getElementById("Accountchecker").innerHTML = lastUser.email;
    }
});


async function loadVouchers() {
  try {
    const res = await fetch("https://dssc.hagotree.site/voucher-gameevent");
    const vouchers = await res.json();
    vouchersCache = vouchers;

    const shopList = document.getElementById("shopList");
    shopList.innerHTML = "";

    const gameVouchers = vouchers.filter(v => v.voucherName === "GAMEEVENT");

    if (gameVouchers.length === 0) {
      shopList.innerHTML = "<p>Hiện chưa có voucher GAMEEVENT nào.</p>";
      return;
    }

    const redeemedList = getRedeemedVouchers();

    gameVouchers.forEach(v => {
      const cost = Math.floor(Number(v.minCost || 0) / 1000);
      const div = document.createElement("div");
      div.className = "item";

      // Kiểm tra user đã đổi voucher này chưa
      const already = redeemedList.find(r => r.voucherId === v.id);

      div.innerHTML = `
        <h3>${v.Title || "Voucher"}</h3>
        <p><b>Giá:</b> ${cost} điểm</p>
        <div id="voucher-${v.id}" style="margin-top:10px;">
          ${already ? `<b>Mã voucher của bạn:</b> ${already.voucherCode}` : ""}
        </div>
        ${
          already
            ? `<button disabled>Đã đổi</button>`
            : `<button onclick="redeem(${v.id}, ${cost})" ${
                cost > totalPoints ? "disabled" : ""
              }>Đổi ngay</button>`
        }
      `;

      shopList.appendChild(div);
    });
  } catch (err) {
    console.error("Lỗi load voucher:", err);
  }
}



async function redeem(id, cost) {
  if (totalPoints < cost) {
    alert("Bạn không đủ điểm để đổi voucher này!");
    return;
  }

  if (!confirm(`Bạn có chắc muốn đổi voucher này với ${cost} điểm?`)) return;

  totalPoints -= cost;

  document.getElementById("points").textContent = totalPoints;
  const voucher = vouchersCache.find(v => v.id === id);
  updatepoint();
  if (voucher) {
    document.getElementById(`voucher-${id}`).innerHTML =
      `<b>Mã voucher của bạn:</b> ${voucher.voucherCode}`;
      redeemedVouchers.push({
      voucherId: voucher.id,
      voucherCode: voucher.voucherCode
    });
    saveRedeemed();
  } else {
    document.getElementById(`voucher-${id}`).innerHTML =
      `<b>Không tìm thấy voucher!</b>`;
  }
}
async function updatepoint() {
      const email = userid;
      const newPoint = totalPoints

      try {
        const res = await fetch("https://dssc.hagotree.site/update-point", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            gameId: gameId,
            newPoint: newPoint
          })
        });
        const data = await res.json();
        console.log("Điểm đã cập nhật:", data);
      } catch (err) {
        console.error("Lỗi:", err);
      }
    }

(async () => {
  loadRedeemed();
  await loadPoints();
  await loadVouchers();
  
})();
