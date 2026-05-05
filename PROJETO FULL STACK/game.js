// ===============================
// CONFIGURAÇÃO
// ===============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const lanes = [150, 300, 450];

let imagesLoaded = 0;
const totalImages = 0;
requestAnimationFrame(gameLoop);
let gameStarted = false;

// só inicia quando todas imagens carregarem
function checkStart() {
  imagesLoaded++;
  if (imagesLoaded === totalImages && !gameStarted) {
    gameStarted = true;
    requestAnimationFrame(gameLoop);
  }
}

// ===============================
// IMAGENS
// ===============================
const playerImg = new Image();
playerImg.src = "./content/player main-Photoroom.png";
playerImg.onload = checkStart;

const cltImg = new Image();
cltImg.src = "./content/da110085deb77491bfc74e0db9e66f2a-Photoroom.png";
cltImg.onload = checkStart;

const obst1Img = new Image();
obst1Img.src = "./content/betano.jpg";
obst1Img.onload = checkStart;

const obst2Img = new Image();
obst2Img.src = "./content/7891149200504--1--Photoroom.png";
obst2Img.onload = checkStart;

playerImg.onerror = () => console.log("Erro playerImg");
cltImg.onerror = () => console.log("Erro cltImg");
obst1Img.onerror = () => console.log("Erro obst1Img");
obst2Img.onerror = () => console.log("Erro obst2Img");

// ===============================
// PLAYER
// ===============================
const player = {
  lane: 1,
  x: lanes[1],
  y: 650,
  width: 50,
  height: 50
};

// ===============================
// VARIÁVEIS DO JOGO
// ===============================
let items = [];
let score = 0;
let lives = 3;
let gameSpeed = 2;
let frame = 0;
let lastDifficultyIncrease = 0;

// ===============================
// CONTROLES (A / D)
// ===============================
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === "a" && player.lane > 0) {
    player.lane--;
  }

  if (key === "d" && player.lane < 2) {
    player.lane++;
  }
});

// ===============================
// SPAWN DE ITENS
// ===============================
function spawnItem() {
  const laneIndex = Math.floor(Math.random() * 3);
  const isCLT = Math.random() < 0.3;

  items.push({
    x: lanes[laneIndex] - 25,
    y: -50,
    width: 50,
    height: 50,
    type: isCLT ? "clt" : "enemy",
    img: isCLT ? cltImg : (Math.random() < 0.5 ? obst1Img : obst2Img)
  });
}

// ===============================
// COLISÃO (COM PADDING)
// ===============================
function checkCollision(a, b) {
  const padding = 10; // deixa mais justo

  return (
    a.x + padding < b.x + b.width - padding &&
    a.x + a.width - padding > b.x + padding &&
    a.y + padding < b.y + b.height - padding &&
    a.y + a.height - padding > b.y + padding
  );
}

// ===============================
// UPDATE
// ===============================
function update() {

  // posiciona player na pista
  player.x = lanes[player.lane] - player.width / 2;

  frame++;

  // spawn a cada 1 segundo (60fps)
  if (frame % 60 === 0) {
    spawnItem();
  }

  // aumenta dificuldade a cada 10 segundos
  if (frame - lastDifficultyIncrease > 600) {
    gameSpeed += 0.3;
    lastDifficultyIncrease = frame;
  }

  // movimenta itens
  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];

    item.y += gameSpeed;

    // colisão
    if (checkCollision(player, item)) {

      if (item.type === "clt") {
        score += 10;
      } else {
        lives--;
      }

      items.splice(i, 1);
      continue;
    }

    // remove fora da tela
    if (item.y > canvas.height) {
      items.splice(i, 1);
    }
  }

  // game over (SEM reload bugado)
  if (lives <= 0) {
    alert("Game Over! Pontuação: " + score);
    document.location.reload();
  }
}

// ===============================
// DRAW
// ===============================
function draw() {

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // linhas das pistas
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(200, 0);
  ctx.lineTo(200, canvas.height);
  ctx.moveTo(400, 0);
  ctx.lineTo(400, canvas.height);
  ctx.stroke();

  // player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // itens
  for (let item of items) {
    ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
  }

  // HUD
  ctx.fillStyle = "#00f0ff";
  ctx.font = "20px Arial";

  ctx.fillText("Pontos: " + score, 20, 30);
  ctx.fillText("Vidas: " + lives, 450, 30);
}

// ===============================
// LOOP PRINCIPAL
// ===============================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}