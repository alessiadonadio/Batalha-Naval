const playerBoard = document.getElementById('player-board');
const computerBoard = document.getElementById('computer-board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');

const boardSize = 10;
let playerShips = [];
let computerShips = [];

// Inicializa tabuleiros
function createBoard(board, isPlayer) {
  board.innerHTML = ''; // limpa o tabuleiro
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    if (!isPlayer) {
      cell.addEventListener('click', () => playerAttack(cell));
    }
    board.appendChild(cell);
  }
}

// Posiciona navios aleatoriamente
function placeShipsRandomly(boardArray) {
  while (boardArray.length < 5) {
    const index = Math.floor(Math.random() * boardSize * boardSize);
    if (!boardArray.includes(index)) {
      boardArray.push(index);
    }
  }
}

// Mostrar navios do jogador
function showPlayerShips() {
  playerShips.forEach(index => {
    const cell = playerBoard.children[index];
    cell.classList.add('ship');
  });
}

function playerAttack(cell) {
  const index = parseInt(cell.dataset.index);
  if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

  if (computerShips.includes(index)) {
    cell.classList.add('hit');
    status.textContent = '🎯 Acertou!';
    computerShips.splice(computerShips.indexOf(index), 1);
  } else {
    cell.classList.add('miss');
    status.textContent = '💦 Água!';
  }
  cell.classList.add('disabled');

  if (computerShips.length === 0) {
    status.textContent = '🏆 Você venceu a batalha! Parabéns!';
    showConfetti();
    endGame();
    return;
  }

  setTimeout(computerAttack, 800);
}

function computerAttack() {
  let index;
  do {
    index = Math.floor(Math.random() * boardSize * boardSize);
  } while (
    playerBoard.children[index].classList.contains('hit') ||
    playerBoard.children[index].classList.contains('miss')
  );

  const cell = playerBoard.children[index];
  if (playerShips.includes(index)) {
    cell.classList.add('hit');
    status.textContent = '😨 Inimigo acertou!';
    playerShips.splice(playerShips.indexOf(index), 1);
  } else {
    cell.classList.add('miss');
    status.textContent = '✌️ Inimigo errou!';
  }

  if (playerShips.length === 0) {
    status.textContent = '💥 Você perdeu! O inimigo venceu.';
    endGame();
  }
}

function endGame() {
  const cells = computerBoard.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.add('disabled');
  });

  // Mostrar botão de reinício
  restartBtn.style.display = 'inline-block';
}

// 🎉 Confete de vitória
function showConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// Reiniciar jogo
function restartGame() {
  playerShips = [];
  computerShips = [];
  status.textContent = 'Clique no tabuleiro inimigo para atacar.';
  restartBtn.style.display = 'none';

  createBoard(playerBoard, true);
  createBoard(computerBoard, false);
  placeShipsRandomly(playerShips);
  placeShipsRandomly(computerShips);
  showPlayerShips();
}

// Clique no botão de reinício
restartBtn.addEventListener('click', restartGame);

// Início do jogo
restartGame();

