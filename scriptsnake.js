/* ========== INTRO ========== */

const intro = document.getElementById("intro");
const introText = document.getElementById("introText");
const gameUI = document.getElementById("gameUI");

const introTexts = [
  "NOKIA SNAKE : REIMAGINED",
  "MADE BY Ihsan Said<br>with help of ChatGPT"
];

let introIndex = 0;

function showIntro() {
  if (introIndex >= introTexts.length) {
    intro.style.display = "none";
    gameUI.classList.remove("hidden");
    return;
  }

  introText.innerHTML = introTexts[introIndex];
  introText.style.opacity = 1;

  setTimeout(() => {
    introText.style.opacity = 0;
    setTimeout(() => {
      introIndex++;
      showIntro();
    }, 1200);
  }, 2000);
}

showIntro();

/* ========== GAME CORE ========== */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

let snake, direction, foods;
let score = 0, level = 1;
let speed = 150;
let game = null;
let paused = false;

let bodyColor = "#00ff99";
let headEmoji = "😀";
let foodEmoji = "🍎";
let emojiTarget = "head";

let rgbMode = false;
let rgbHue = 0;

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const highScoreEl = document.getElementById("highScore");
const rgbBtn = document.getElementById("rgbBtn");

let highScore = parseInt(localStorage.getItem("snakeHighScore") || "0");
highScoreEl.textContent = highScore;

document.getElementById("bodyColor").oninput = e => bodyColor = e.target.value;

/* ========== PARTICLES ========== */

let particles = [];

function addParticle(x, y, color) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 20,
    color
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 20;
    ctx.fillRect(p.x, p.y, 4, 4);
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  });

  ctx.globalAlpha = 1;
  particles = particles.filter(p => p.life > 0);
}

/* ========== EMOJI LISTS ========== */

const headEmojiList = ["😀","😎","🤖","👻","🤡","😈","👽","🥳","😴","💀"];
const foodEmojiList = ["🍎","🍕","🍔","🍟","🍣","🍩","🍪","🍰","🍇","🍓","🥝","🍉","🍌","🍒","🥭"];
const popup = document.getElementById("emojiPopup");

function openEmoji(target) {
  emojiTarget = target;
  popup.innerHTML = "";
  const list = target === "head" ? headEmojiList : foodEmojiList;

  list.forEach(e => {
    const s = document.createElement("span");
    s.textContent = e;
    s.onclick = () => {
      if (emojiTarget === "head") headEmoji = e;
      else foodEmoji = e;
      popup.style.display = "none";
    };
    popup.appendChild(s);
  });

  popup.style.display = "block";
}

/* ========== RGB ========== */

function toggleRGB() {
  rgbMode = !rgbMode;
  rgbBtn.classList.toggle("rgb-on", rgbMode);
  rgbBtn.textContent = rgbMode ? "🌈 RGB ON" : "🌈 RGB MODE";
}

/* ========== FULLSCREEN ========== */

function toggleFullscreen() {
  const el = document.getElementById("gameContainer");
  if (!document.fullscreenElement) el.requestFullscreen();
  else document.exitFullscreen();
}

/* ========== GAME FUNCTIONS ========== */

function resetGame() {
  snake = [{ x: 260, y: 260 }];
  direction = "RIGHT";
  score = 0;
  level = 1;
  paused = false;
  foods = createFoods(3);
  updateUI();
}

function updateUI() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
}

function randomPos() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function createFoods(n) {
  const arr = [];
  while (arr.length < n) {
    const p = randomPos();
    arr.push(p);
  }
  return arr;
}

/* ========== INPUT ========== */

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") setDir("UP");
  if (e.key === "ArrowDown") setDir("DOWN");
  if (e.key === "ArrowLeft") setDir("LEFT");
  if (e.key === "ArrowRight") setDir("RIGHT");
  if (e.key === " ") togglePause();
});

/* === TOUCH SWIPE === */

let touchStartX = 0, touchStartY = 0;

canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

canvas.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) setDir("RIGHT");
    else setDir("LEFT");
  } else {
    if (dy > 0) setDir("DOWN");
    else setDir("UP");
  }
});

/* ========== DIRECTION ========== */

function setDir(d) {
  if (paused) return;
  if (d === "UP" && direction !== "DOWN") direction = d;
  if (d === "DOWN" && direction !== "UP") direction = d;
  if (d === "LEFT" && direction !== "RIGHT") direction = d;
  if (d === "RIGHT" && direction !== "LEFT") direction = d;
}

/* ========== DRAW LOOP ========== */

function draw() {
  if (paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawParticles();

  snake.slice(1).forEach((s, i) => {
    let color = rgbMode ? `hsl(${(rgbHue + i * 12) % 360},100%,50%)` : bodyColor;
    ctx.fillStyle = color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillRect(s.x, s.y, box, box);

    addParticle(s.x + box/2, s.y + box/2, color);
  });

  ctx.shadowBlur = 0;

  if (rgbMode) rgbHue = (rgbHue + 4) % 360;

  ctx.font = box + "px 'Segoe UI Emoji'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(headEmoji, snake[0].x + box/2, snake[0].y + box/2);
  foods.forEach(f => ctx.fillText(foodEmoji, f.x + box/2, f.y + box/2));

  let hx = snake[0].x;
  let hy = snake[0].y;

  if (direction === "UP") hy -= box;
  if (direction === "DOWN") hy += box;
  if (direction === "LEFT") hx -= box;
  if (direction === "RIGHT") hx += box;

  const hitFood = foods.findIndex(f => f.x === hx && f.y === hy);

  if (hitFood !== -1) {
    score++;
    if (score % 5 === 0) level++;
    foods.splice(hitFood, 1);
    foods.push(...createFoods(1));
    updateUI();
  } else {
    snake.pop();
  }

  const newHead = { x: hx, y: hy };

  if (
    hx < 0 || hy < 0 ||
    hx >= canvas.width || hy >= canvas.height ||
    snake.some(s => s.x === hx && s.y === hy)
  ) {
    clearInterval(game);
    game = null;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
      highScoreEl.textContent = highScore;
    }

    alert("GAME OVER\nScore: " + score);
    return;
  }

  snake.unshift(newHead);
}

/* ========== BUTTONS ========== */

function startGame() {
  clearInterval(game);
  resetGame();
  game = setInterval(draw, speed);
}

function togglePause() {
  paused = !paused;
}

function setSpeed(v) {
  speed = v;
  if (game) {
    clearInterval(game);
    game = setInterval(draw, speed);
  }
}
