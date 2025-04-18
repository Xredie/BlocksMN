const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let player = { x: canvas.width / 2, y: canvas.height / 2, speed: 5, color: 'red', direction: { x: 0, y: 0 }, velocity: 0, grounded: true, health: 10 };

// Przeciwnicy
let enemies = [
    { x: 100, y: 100, speed: 2, health: 10 },
    { x: 500, y: 300, speed: 2, health: 10 }
];

// Kamera
let camera = { x: 0, y: 0 };

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fizyka skoku
    if (!player.grounded) {
        player.velocity += 0.5;
    } else {
        player.velocity = 0;
    }
    player.y += player.velocity;

    if (player.y > canvas.height - 50) {
        player.y = canvas.height - 50;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    // Rysowanie gracza
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - camera.x, player.y - camera.y, 50, 50);

    // Rysowanie przeciwników
    enemies.forEach(enemy => {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x - camera.x, enemy.y - camera.y, 50, 50);

        // Logika AI
        let distance = Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2));
        if (distance < 100) {
            if (enemy.x < player.x) enemy.x -= enemy.speed;
            if (enemy.x > player.x) enemy.x += enemy.speed;
            if (enemy.y < player.y) enemy.y -= enemy.speed;
            if (enemy.y > player.y) enemy.y += enemy.speed;
        } else {
            if (enemy.x < player.x) enemy.x += enemy.speed;
            if (enemy.x > player.x) enemy.x -= enemy.speed;
            if (enemy.y < player.y) enemy.y += enemy.speed;
            if (enemy.y > player.y) enemy.y -= enemy.speed;
        }

        // Sprawdzanie, czy przeciwnicy biją gracza
        if (Math.abs(player.x - enemy.x) < 50 && Math.abs(player.y - enemy.y) < 50) {
            player.health -= 1;
            if (player.health <= 0) {
                alert('Game Over');
            }
        }
    });

    // Rysowanie działek
    // Prosta logika strzałów w kierunku gracza
    turrets.forEach(turret => {
        let distance = Math.sqrt(Math.pow(turret.x - player.x, 2) + Math.pow(turret.y - player.y, 2));
        if (distance < turret.range) {
            turret.shooting = true;
        } else {
            turret.shooting = false;
        }

        if (turret.shooting) {
            ctx.beginPath();
            ctx.moveTo(turret.x, turret.y);
            ctx.lineTo(player.x, player.y);
            ctx.stroke();
        }
    });

    // Rysowanie kamerki
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;

    movePlayer();
    requestAnimationFrame(gameLoop);
}

function movePlayer() {
    player.x += player.direction.x * player.speed;
    player.y += player.direction.y * player.speed;
}

function startGame() {
    gameStarted = true;
    document.getElementById('gui').style.display = 'none';
    gameLoop();
}

document.getElementById('jumpBtn').addEventListener('click', () => {
    if (player.grounded) {
        player.velocity = -10; // Skok
        player.grounded = false;
    }
});

document.getElementById('joystick').addEventListener('touchmove', (event) => {
    let touch = event.touches[0];
    let centerX = joystick.offsetLeft + joystick.offsetWidth / 2;
    let centerY = joystick.offsetTop + joystick.offsetHeight / 2;
    player.direction.x = (touch.clientX - centerX) / joystick.offsetWidth;
    player.direction.y = (touch.clientY - centerY) / joystick.offsetHeight;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
                     
