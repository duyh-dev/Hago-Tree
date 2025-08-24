let userid="";
const params = new URLSearchParams(window.location.search);
const gameid = params.get("id_game")?.toLowerCase() || "";
const respone = document.getElementById("display-v1");
let id_now="../EVENT/game/";
let idgame="skqk2thg9.html"
if(gameid=="sukienquockhanh"){
	id_now=id_now+idgame

}
else{
	id_now=id_now+idgame
}
respone.innerHTML =`

  <div class="container">
    <div class="game-screen">
      <iframe id="gameFrame" src="${id_now}" width="100%" height="100%" frameborder="0"></iframe>
    </div>
    <div class="missions">
      <h2>Nhiệm vụ</h2>
      <ul>
        <li>[ĐANG TẢI]</li>
      </ul>
    </div>
  </div>

  <div class="bottom">
    <div class="games-list">
      <div>Game 1</div>

    </div>
    <div class="points">
      Điểm hiện có: <span id="points">120</span>
      <a href="shop.html" class="shop-link">Đến Shop</a>
    </div>
  </div>

    `

async function getPoint() {
  const gameId = idgame
  const email = userid
  if (!email) {
    document.getElementById("points").textContent = "0";
    return;
  }

  try {
    const res = await fetch(`https://dssc.hagotree.site/points/${email}`);
    const data = await res.json();
    const point = data.points || 0; 
    document.getElementById("points").textContent = point;
  } catch (err) {
    console.error("Lỗi lấy điểm:", err);
    document.getElementById("points").textContent = "0";
  }
}
window.addEventListener("message", (event) => {
      if (event.data.type === "updatePoint") {
        console.log("Nhận điểm từ game:", event.data.earned);
        getPoint();
      }
    });

document.addEventListener('DOMContentLoaded', () => {
	const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
	    const lastUser = user[user.length - 1];
	    console.log(lastUser.email);
	    userid = lastUser.email;
    }
	getPoint();
});
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  if ((user.length > 0) & (localStorage.getItem("userPassword").length >0 )) {
    const lastUser = user[user.length - 1];
    console.log(lastUser.email);
    document.getElementById("Accountchecker").innerHTML = lastUser.email;
    }
});
