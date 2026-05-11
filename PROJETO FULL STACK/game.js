// pega o canvas e o contexto para desenhar
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// posição das 3 pistas (coluna central de cada uma)
var pistas = [150, 300, 450];

// ===============================
// IMAGENS
// ===============================
var imgJogador = new Image();
imgJogador.src = "./content/player main-Photoroom.png";

var imgClt = new Image();
imgClt.src = "./content/da110085deb77491bfc74e0db9e66f2a-Photoroom.png";

var imgInimigo1 = new Image();
imgInimigo1.src = "./content/betano.jpg";

var imgInimigo2 = new Image();
imgInimigo2.src = "./content/7891149200504--1--Photoroom.png";

// ===============================
// JOGADOR
// ===============================
var jogador = {
  pista: 1,       // começa na pista do meio (0, 1 ou 2)
  x: pistas[1],
  y: 650,
  largura: 50,
  altura: 50
};

// ===============================
// VARIÁVEIS DO JOGO
// ===============================
var itens = [];       // lista de itens na tela
var pontos = 0;
var vidas = 3;
var velocidade = 2;
var contador = 0;     // conta os frames

// ===============================
// TECLAS A e D para mover
// ===============================
document.addEventListener("keydown", function(evento) {
  if (evento.key === "a" || evento.key === "A") {
    if (jogador.pista > 0) {
      jogador.pista = jogador.pista - 1;
    }
  }

  if (evento.key === "d" || evento.key === "D") {
    if (jogador.pista < 2) {
      jogador.pista = jogador.pista + 1;
    }
  }
});

// ===============================
// CRIAR NOVO ITEM
// ===============================
function criarItem() {
  var pistaAleatoria = Math.floor(Math.random() * 3);
  var sorteio = Math.random();

  var tipo;
  var imagem;

  if (sorteio < 0.3) {
    tipo = "clt";
    imagem = imgClt;
  } else {
    tipo = "inimigo";
    if (Math.random() < 0.5) {
      imagem = imgInimigo1;
    } else {
      imagem = imgInimigo2;
    }
  }

  var novoItem = {
    x: pistas[pistaAleatoria] - 25,
    y: -50,
    largura: 50,
    altura: 50,
    tipo: tipo,
    imagem: imagem
  };

  itens.push(novoItem);
}

// ===============================
// VERIFICAR COLISÃO
// ===============================
function temColisao(a, b) {
  var margem = 10; // margem para a colisão ser mais justa

  if (a.x + margem > b.x + b.largura - margem) return false;
  if (a.x + a.largura - margem < b.x + margem) return false;
  if (a.y + margem > b.y + b.altura - margem) return false;
  if (a.y + a.altura - margem < b.y + margem) return false;

  return true;
}

// ===============================
// ATUALIZAR O JOGO
// ===============================
function atualizar() {
  // atualiza a posição x do jogador de acordo com a pista
  jogador.x = pistas[jogador.pista] - jogador.largura / 2;

  contador = contador + 1;

  // cria um item a cada 60 frames (aprox. 1 segundo)
  if (contador % 60 === 0) {
    criarItem();
  }

  // aumenta a velocidade a cada 10 segundos
  if (contador % 600 === 0) {
    velocidade = velocidade + 0.3;
  }

  // move os itens para baixo e verifica colisão
  for (var i = itens.length - 1; i >= 0; i--) {
    var item = itens[i];

    item.y = item.y + velocidade;

    if (temColisao(jogador, item)) {
      if (item.tipo === "clt") {
        pontos = pontos + 10;
      } else {
        vidas = vidas - 1;
      }
      itens.splice(i, 1); // remove o item
    } else if (item.y > canvas.height) {
      itens.splice(i, 1); // remove se saiu da tela
    }
  }

  // verifica game over
  if (vidas <= 0) {
    alert("Game Over! Pontuação: " + pontos);
    document.location.reload();
  }
}

// ===============================
// DESENHAR O JOGO
// ===============================
function desenhar() {
  // fundo preto
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

  // desenha o jogador
  ctx.drawImage(imgJogador, jogador.x, jogador.y, jogador.largura, jogador.altura);

  // desenha cada item
  for (var i = 0; i < itens.length; i++) {
    var item = itens[i];
    ctx.drawImage(item.imagem, item.x, item.y, item.largura, item.altura);
  }

  // mostra pontos e vidas na tela
  ctx.fillStyle = "#00f0ff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + pontos, 20, 30);
  ctx.fillText("Vidas: " + vidas, 450, 30);
}

// ===============================
// LOOP DO JOGO
// ===============================
function loopDoJogo() {
  atualizar();
  desenhar();
  requestAnimationFrame(loopDoJogo);
}

// inicia o jogo
requestAnimationFrame(loopDoJogo);