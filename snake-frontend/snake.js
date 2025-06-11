const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const pauseMenu = document.getElementById("pauseMenu");
const settingsMenu = document.getElementById("settingsMenu");
const countdownEl = document.getElementById("countdown");
const soundToggle = document.getElementById("soundToggle");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameInfo = document.getElementById("gameInfo");
const pauseButton = document.getElementById("pauseButton");

const box = 20;
const canvasSize = 400;

let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let gameOver = false;
let isPaused = false;
let intervalId = null;
let soundEnabled = true;

const moveSound = new Audio("sounds/move.wav");
const eatSound = new Audio("sounds/eat.wav");
const crashSound = new Audio("sounds/crash.wav");

function playSound(sound) {
  if (soundEnabled && !isPaused && !gameOver) {
    try {
      sound.currentTime = 0;
      sound.play().catch((err) => {
        console.warn("No se pudo reproducir sonido:", err);
      });
    } catch (e) {
      console.warn("Error al reproducir sonido:", e);
    }
  }
}

// Teclado
document.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "P") {
    if (!isPaused && !gameOver && !canvas.classList.contains("hidden")) {
      pauseGame();
    } else if (isPaused) {
      resumeGame();
    }
  } else {
    changeDirection(event);
  }
});

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  if (key === 38 && direction !== "DOWN") direction = "UP";
  if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  if (key === 40 && direction !== "UP") direction = "DOWN";
  playSound(moveSound);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };
}

function draw() {
  if (gameOver || isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#0a0";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  const head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    playSound(crashSound);
    gameOver = true;
    clearInterval(intervalId);
    alert("¡Juego terminado! Puntuación: " + score);
    returnToMenu();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
    playSound(eatSound);
  } else {
    snake.pop();
  }

  // Actualizar puntuación en el contenedor
  scoreDisplay.textContent = "Puntuación: " + score;
}

// ========== Funciones de menú ==========
function startGame() {
  menu.classList.add("hidden");
  countdownEl.classList.remove("hidden");
  let counter = 3;
  countdownEl.textContent = counter;

  const countdown = setInterval(() => {
    counter--;
    if (counter === 0) {
      clearInterval(countdown);
      countdownEl.classList.add("hidden");
      canvas.classList.remove("hidden");
      gameInfo.classList.remove("hidden"); // Mostrar puntuación y botón de pausa
      initGame();
    } else {
      countdownEl.textContent = counter;
    }
  }, 1000);
}

function initGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  gameOver = false;
  isPaused = false;
  scoreDisplay.textContent = "Puntuación: " + score;
  intervalId = setInterval(draw, 100);
}

function returnToMenu() {
  canvas.classList.add("hidden");
  gameInfo.classList.add("hidden"); // Ocultar puntuación y botón de pausa
  menu.classList.remove("hidden");
}

function pauseGame() {
  isPaused = true;
  clearInterval(intervalId);
  pauseButton.classList.add("hidden"); // Ocultar botón de pausa
  pauseMenu.classList.remove("hidden");
}

function resumeGame() {
  isPaused = false;
  pauseMenu.classList.add("hidden");
  pauseButton.classList.remove("hidden"); // Mostrar botón de pausa
  intervalId = setInterval(draw, 100);
}

function quitToMenu() {
  pauseMenu.classList.add("hidden");
  returnToMenu();
}

function openSettings() {
  menu.classList.add("hidden");
  settingsMenu.classList.remove("hidden");
}

function toggleSound() {
  soundEnabled = soundToggle.checked;
}

function backToMenu() {
  settingsMenu.classList.add("hidden");
  menu.classList.remove("hidden");
}
