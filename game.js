const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Kamera i gracz
let camera = { x: 0, y: 0 };
let player = {
    x: 100,
    y: 100,
    w: 50,
    h: 50,
    speed: 5,
    vx: 0,
    vy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    health: 100,
    color: "red"
};

// Przeciwnicy
let enemies = [
    { x: 300, y: 300, w: 50, h: 50, speed: 1.5, color: "green" },
    { x: 500, y: 150, w: 50, h: 50, speed: 2, color: "green" }
];

// Klawisze
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Skok przyciskiem
document.getElementById("jumpBtn").addEventListener("click", () => {
    if (player.grounded) {
        player.vy = player.jumpPower;
        player.grounded = false;
    }
});

// Sterowanie
function updateMovement() {
    if (keys["a"] || keys["ArrowLeft"]) player.vx = -player.speed;
    else if (keys["d"] || keys["ArrowRight"]) player.vx = player.speed;
    else player.vx = 0;
}

// Fizyka
function applyPhysics() {
    player.vy += player.gravity;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.vy = 0;
        player.grounded = true;
    }
}

// Rysowanie
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - camera.x, player.y - camera.y, player.w, player.h);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Proste AI – podążanie
        if (enemy.x < player.x) enemy.x += enemy.speed;
        if (enemy.x > player.x) enemy.x -= enemy.speed;
        if (enemy.y < player.y) enemy.y += enemy.speed;
        if (enemy.y > player.y) enemy.y -= enemy.speed;

        // Kolizja = damage
        if (
            Math.abs(player.x - enemy.x) < 50 &&
            Math.abs(player.y - enemy.y) < 50
        ) {
            player.health -= 0.1;
            if (player.health <= 0) {
                alert("Zginąłeś!");
                player.health = 100;
                player.x = 100;
                player.y = 100;
            }
        }

        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - camera.x, enemy.y - camera.y, enemy.w, enemy.h);
    });
}

// Kamera
function updateCamera() {
    camera.x = player.x - canvas.width / 2 + player.w / 2;
    camera.y = player.y - canvas.height / 2 + player.h / 2;
}

// Główna pętla
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateMovement();
    applyPhysics();
    updateCamera();
    drawPlayer();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    document.getElementById("gui").style.display = "none";
    gameLoop();
}

// Start po kliknięciu
window.startGame = startGame;
