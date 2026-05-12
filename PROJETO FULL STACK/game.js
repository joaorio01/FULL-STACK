// pega o canvas do HTML e cria o contexto 2D,
// que é o que permite desenhar no jogo
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// aqui ficam as posições das 3 pistas do jogo
// cada número representa o centro de uma pista
var pistas = [150, 300, 450];


// carregando a imagem do jogador
var imgJogador = new Image();
imgJogador.src = "./content/player main-Photoroom.png";

// carregando a imagem do item bom (CLT)
var imgClt = new Image();
imgClt.src = "./content/da110085deb77491bfc74e0db9e66f2a-Photoroom.png";

// carregando a primeira imagem de inimigo
var imgInimigo1 = new Image();
imgInimigo1.src = "./content/betano.jpg";

// carregando a segunda imagem de inimigo
var imgInimigo2 = new Image();
imgInimigo2.src = "./content/7891149200504--1--Photoroom.png";


// objeto que guarda todas as informações do jogador
var jogador = {

  // pista atual do jogador
  // 0 = esquerda
  // 1 = meio
  // 2 = direita
  pista: 1,

  // posição inicial do jogador
  x: pistas[1],
  y: 650,

  // tamanho do personagem
  largura: 50,
  altura: 50
};


// array que guarda todos os itens que aparecem na tela
var itens = [];

// quantidade de pontos do jogador
var pontos = 0;

// quantidade de vidas
var vidas = 3;

// velocidade que os objetos descem
var velocidade = 2;

// contador usado para controlar tempo e criação de itens
var contador = 0;


// evento que detecta quando alguma tecla é apertada
document.addEventListener("keydown", function(evento) {

  // se apertar A vai para a esquerda
  if (evento.key === "a" || evento.key === "A") {

    // impede o jogador de sair da pista
    if (jogador.pista > 0) {

      // diminui 1 na pista
      jogador.pista = jogador.pista - 1;
    }
  }

  // se apertar D vai para a direita
  if (evento.key === "d" || evento.key === "D") {

    // impede o jogador de sair da última pista
    if (jogador.pista < 2) {

      // aumenta 1 na pista
      jogador.pista = jogador.pista + 1;
    }
  }
});


// função responsável por criar itens novos
function criarItem() {

  // escolhe aleatoriamente uma das 3 pistas
  var pistaAleatoria = Math.floor(Math.random() * 3);

  // gera um número aleatório para decidir o tipo do item
  var sorteio = Math.random();

  var tipo;
  var imagem;

  // 30% de chance de criar item bom
  if (sorteio < 0.3) {

    tipo = "clt";
    imagem = imgClt;

  } else {

    // caso contrário cria inimigo
    tipo = "inimigo";

    // escolhe aleatoriamente uma das imagens de inimigo
    if (Math.random() < 0.5) {
      imagem = imgInimigo1;
    } else {
      imagem = imgInimigo2;
    }
  }

  // cria o objeto do novo item
  var novoItem = {

    // posição x baseada na pista escolhida
    // o -25 serve para centralizar melhor o item
    x: pistas[pistaAleatoria] - 25,

    // começa acima da tela
    y: -50,

    // tamanho do item
    largura: 50,
    altura: 50,

    // tipo do item
    tipo: tipo,

    // imagem do item
    imagem: imagem
  };

  // adiciona o item no array
  itens.push(novoItem);
}


// função que verifica se houve colisão
function temColisao(a, b) {

  // margem usada para deixar a colisão mais justa
  // sem isso às vezes parece que bateu sem encostar
  var margem = 10;

  // verifica se os objetos NÃO estão se encostando

  if (a.x + margem > b.x + b.largura - margem) return false;

  if (a.x + a.largura - margem < b.x + margem) return false;

  if (a.y + margem > b.y + b.altura - margem) return false;

  if (a.y + a.altura - margem < b.y + margem) return false;

  // se passou por todas as verificações então houve colisão
  return true;
}


// função principal que atualiza o jogo
function atualizar() {

  // atualiza a posição do jogador dependendo da pista
  jogador.x = pistas[jogador.pista] - jogador.largura / 2;

  // aumenta o contador a cada frame
  contador = contador + 1;

  // cria um novo item a cada 60 frames
  // normalmente 60 frames equivalem a 1 segundo
  if (contador % 60 === 0) {
    criarItem();
  }

  // aumenta a velocidade do jogo a cada 10 segundos
  if (contador % 600 === 0) {
    velocidade = velocidade + 0.3;
  }

  // percorre todos os itens da tela
  // começa do final para facilitar remover itens
  for (var i = itens.length - 1; i >= 0; i--) {

    var item = itens[i];

    // faz o item descer
    item.y = item.y + velocidade;

    // verifica colisão com o jogador
    if (temColisao(jogador, item)) {

      // se for item bom ganha pontos
      if (item.tipo === "clt") {

        pontos = pontos + 10;

      } else {

        // se for inimigo perde vida
        vidas = vidas - 1;
      }

      // remove o item após a colisão
      itens.splice(i, 1);

    } else if (item.y > canvas.height) {

      // remove o item caso saia da tela
      itens.splice(i, 1);
    }
  }

  // verifica se acabou as vidas
  if (vidas <= 0) {

    // mostra mensagem de game over
    alert("Game Over! Pontuação: " + pontos);

    // reinicia o jogo
    document.location.reload();
  }
}


// função responsável por desenhar tudo na tela
function desenhar() {

  // desenha o fundo preto
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // configura a cor das linhas das pistas
  ctx.strokeStyle = "#00f0ff";

  // espessura das linhas
  ctx.lineWidth = 2;

  // inicia o desenho das linhas
  ctx.beginPath();

  // primeira linha divisória
  ctx.moveTo(200, 0);
  ctx.lineTo(200, canvas.height);

  // segunda linha divisória
  ctx.moveTo(400, 0);
  ctx.lineTo(400, canvas.height);

  // desenha as linhas
  ctx.stroke();

  // desenha o jogador
  ctx.drawImage(
    imgJogador,
    jogador.x,
    jogador.y,
    jogador.largura,
    jogador.altura
  );

  // percorre todos os itens para desenhar na tela
  for (var i = 0; i < itens.length; i++) {

    var item = itens[i];

    ctx.drawImage(
      item.imagem,
      item.x,
      item.y,
      item.largura,
      item.altura
    );
  }

  // configura o texto
  ctx.fillStyle = "#00f0ff";
  ctx.font = "20px Arial";

  // mostra os pontos
  ctx.fillText("Pontos: " + pontos, 20, 30);

  // mostra as vidas
  ctx.fillText("Vidas: " + vidas, 450, 30);
}


// função que faz o jogo funcionar em loop
function loopDoJogo() {

  // atualiza toda a lógica do jogo
  atualizar();

  // redesenha tudo na tela
  desenhar();

  // chama o próximo frame do jogo
  requestAnimationFrame(loopDoJogo);
}


// inicia o loop do jogo
requestAnimationFrame(loopDoJogo);4