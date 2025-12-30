const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 550, w: 40, h: 40, speed: 7 };
let blocks = [];
let blockSpeed = 3;
let gameOver = false;

// Player movement
document.addEventListener("keydown", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
        if (e.key === "ArrowRight" && player.x < canvas.width - player.w)
            player.x += player.speed;
    }

    // Restart game
    if (gameOver && e.code === "Space") resetGame();
});

// Create blocks every second
setInterval(() => {
    if (!gameOver) {
        const size = Math.random() * 30 + 20;
        blocks.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            w: size,
            h: size,
        });
    }
}, 1000);

// Reset game
function resetGame() {
    blocks = [];
    player.x = 180;
    gameOver = false;
}

// Check collision
function collides(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Draw blocks
    ctx.fillStyle = "red";
    blocks.forEach((b) => {
        b.y += blockSpeed;

        // Collision check
        if (collides(player, b)) {
            gameOver = true;
        }

        ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Remove blocks off-screen
    blocks = blocks.filter((b) => b.y < canvas.height + 50);

    // Game Over screen
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "32px Arial";
        ctx.fillText("GAME OVER", 110, 280);

        ctx.font = "20px Arial";
        ctx.fillText("Press SPACE to restart", 105, 315);
    }

    requestAnimationFrame(update);
}

update();
