const COLS = 10, ROWS = 20, CELL = 30;
const COLORS = {
  I: "cyan", J: "blue", L: "orange", O: "yellow",
  S: "green", T: "purple", Z: "red"
};
const SHAPES = {
  I: [[0,1],[1,1],[2,1],[3,1]],
  J: [[0,0],[0,1],[1,1],[2,1]],
  L: [[2,0],[0,1],[1,1],[2,1]],
  O: [[1,0],[2,0],[1,1],[2,1]],
  S: [[1,0],[2,0],[0,1],[1,1]],
  T: [[1,0],[0,1],[1,1],[2,1]],
  Z: [[0,0],[1,0],[1,1],[2,1]],
};
const TYPES = Object.keys(SHAPES);
let userid="";
let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");
let nextCanvas = document.getElementById("next");
let nctx = nextCanvas.getContext("2d");
let currentPoint = 0; 
let grid, cur, nextType;
let score=0, lines=0, level=0;
let dropInterval=1000, last=0, acc=0, over=false;
let gameId = 3;
async function getPoint() {  
    const email = userid
    if (!email) {
      return;
    }

    try {
      const res = await fetch(`https://dssc.hagotree.site/points/${email}`);
      const data = await res.json();
      const point = data.points || 0; 
      currentPoint= point;
    } catch (err) {
      console.error("Lỗi lấy điểm:", err);
    }
  }
async function updatepoint() {
      const email = userid;
      
      const newPoint = currentPoint+score

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
        await getPoint();
        await finishGame();
      } catch (err) {
        console.error("Lỗi:", err);
      }
    }
function checkPlayPermission() {
  let today = new Date().toISOString().slice(0,10);
  let lastPlayDate = localStorage.getItem("lastPlayDate");
  if (lastPlayDate === today) {
    over = true;
    ctx.fillStyle="rgba(0,0,0,0.7)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.textAlign="center";
    ctx.fillText("Bạn đã chơi hôm nay rồi!", canvas.width/2, canvas.height/2);
    return false;
  }
  return true;
}
function finishGame() {
      const earned = 0;
      window.parent.postMessage({ type: "updatePoint", earned }, "*");
    }
function markPlayedToday() {
  let today = new Date().toISOString().slice(0,10);
  localStorage.setItem("lastPlayDate", today);
}
// ===============================================

function newGrid() {
  return Array.from({length:ROWS}, ()=>Array(COLS).fill(null));
}

function spawn() {
  const type = nextType || randomType();
  nextType = randomType();
  cur = {type, x:3, y:0, cells: SHAPES[type].map(([x,y])=>({x,y}))};
  drawNext();
  if (collide(0,0,cur.cells)) gameOver();
}

function randomType() {
  return TYPES[Math.floor(Math.random()*TYPES.length)];
}

function collide(dx,dy,cells) {
  for (let c of cells) {
    let x = cur.x+dx+c.x, y = cur.y+dy+c.y;
    if (x<0||x>=COLS||y>=ROWS) return true;
    if (y>=0 && grid[y][x]) return true;
  }
  return false;
}

function rotate() {
  if(cur.type==="O") return;
  let rot = cur.cells.map(({x,y})=>({x:-y+1,y:x}));
  if (!collide(0,0,rot)) cur.cells=rot;
}

function move(dx) { if(!collide(dx,0,cur.cells)) cur.x+=dx; }
function softDrop() {
  if(!collide(0,1,cur.cells)) cur.y++;
  else lock();
}
function hardDrop() { while(!collide(0,1,cur.cells)) cur.y++; lock(); }

function lock() {
  for (let c of cur.cells) {
    let x=cur.x+c.x, y=cur.y+c.y;
    if (y>=0) grid[y][x]=cur.type;
  }
  clearLines();
  spawn();
}

function clearLines() {
  let cleared=0;
  for(let y=ROWS-1;y>=0;y--) {
    if(grid[y].every(v=>v)) {
      grid.splice(y,1);
      grid.unshift(Array(COLS).fill(null));
      cleared++;
    }
  }
  if(cleared>0){
    
    if(cleared>4){
      score += cleared*20;
    }else {score += cleared*10;}
    lines += cleared;
    level = Math.floor(lines/5);
    dropInterval = Math.max(100, 1000 - level*100);
    updateHUD();
  }
}

function drawCell(x,y,color) {
  ctx.fillStyle=color;
  ctx.fillRect(x*CELL,y*CELL,CELL,CELL);
  ctx.strokeStyle="#111";
  ctx.strokeRect(x*CELL,y*CELL,CELL,CELL);
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(grid[y][x]) drawCell(x,y,COLORS[grid[y][x]]);
  }
  if(cur) for(let c of cur.cells){
    drawCell(cur.x+c.x, cur.y+c.y, COLORS[cur.type]);
  }
}

function drawNext() {
  nctx.clearRect(0,0,nextCanvas.width,nextCanvas.height);
  let cells = SHAPES[nextType];
  for(let c of cells){
    nctx.fillStyle = COLORS[nextType];
    nctx.fillRect(c.x*20+20,c.y*20+20,20,20);
    nctx.strokeStyle="#000";
    nctx.strokeRect(c.x*20+20,c.y*20+20,20,20);
  }
}

function updateHUD() {
  document.getElementById("score").textContent=score;
  document.getElementById("lines").textContent=lines;
}

function gameOver() {
  over=true;
  ctx.fillStyle="rgba(0,0,0,0.7)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="white";
  ctx.font="24px Arial";
  ctx.textAlign="center";
  console.log(score)
  ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2);updatepoint();
  markPlayedToday(); // lưu lượt chơi hôm nay
}

function loop(t){
  if(!last) last=t;
  let dt=t-last; last=t;
  if(!over){
    acc+=dt;
    if(acc>dropInterval){ softDrop(); acc=0; }
    draw();
  }
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e=>{
  if(over && e.code==="KeyR") start();
  else if(!over){
    if(e.code==="ArrowLeft") move(-1);
    else if(e.code==="ArrowRight") move(1);
    else if(e.code==="ArrowUp") rotate();
    else if(e.code==="ArrowDown") softDrop();
    else if(e.code==="Space") hardDrop();
    else if(e.code==="KeyR") start();
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
function start(){
  if(!checkPlayPermission()) return; // kiểm tra quyền chơi
  grid=newGrid(); score=0;lines=0;level=0;over=false;
  updateHUD(); nextType=randomType(); spawn();
}
start();
requestAnimationFrame(loop);
