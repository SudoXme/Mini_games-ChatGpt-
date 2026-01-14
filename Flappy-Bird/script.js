const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameOver = false;
let score = 0;

// Bird
const bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.5,
  lift: -8,
  velocity: 0,

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Ground collision
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      gameOver = true;
    }

    // Top collision
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },

  jump() {
    this.velocity = this.lift;
  }
};

// Pipes
const pipes = [];
const pipeWidth = 50;
const pipeGap = 140;
const pipeSpeed = 2;

function createPipe() {
  const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 20;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap,
    passed: false
  });
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // Bottom pipe
    ctx.fillRect(
      pipe.x,
      canvas.height - pipe.bottom,
      pipeWidth,
      pipe.bottom
    );
  });
}

// Update pipes
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // Collision detection
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }

    // Scoring
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }
}

// Score
function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    bird.update();
    updatePipes();
  }

  bird.draw();
  drawPipes();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 120, 250);
  }

  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") bird.jump();
});

canvas.addEventListener("click", () => bird.jump());

// Pipe creation interval
setInterval(() => {
  if (!gameOver) createPipe();
}, 1500);

// Start game
gameLoop();
