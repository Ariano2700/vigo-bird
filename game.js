const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameConteiner = document.getElementById('game-container');const flappyImg = new Image();
flappyImg.src = 'img/vigobird.png';

//Constantes del juego

const FLPA_SPEED = -4;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Valores del personaje
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//score
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

//Audio de colision
const collisionAudio = new Audio('img/vigoExplotando.mp3');
//Audio fondo
//const backgroundAudio = new Audio('img/fondoSonido.mp3');

canvas.addEventListener('touchstart', function (e) {
    if (window.innerWidth <= 600) { // Cambia 600 al valor que desees para determinar cuándo habilitar el salto táctil
        birdVelocity = FLPA_SPEED;
        e.preventDefault(); // Evita el desplazamiento de la pantalla táctil en dispositivos móviles
    }
});

document.body.onkeyup = function (e) {
    if (e.code == 'ArrowUp') {
        birdVelocity = FLPA_SPEED;
    }
}

document.getElementById('restart').addEventListener('click', function () {
    hideEndMenu();
    resetGame();
    loop();
});

function increaseScore() {
    if (birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP ||
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Creacion de cajas para el bird y el pipes
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_HEIGHT,
        height: BIRD_HEIGHT
    }
    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }
    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
        return true;
    }

    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
    }

    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;

}

function hideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameConteiner.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameConteiner.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endgame() {
    //alert('UY SE LE MURIO EL VIGITOOOO');
    collisionAudio.play();
    showEndMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(flappyImg, birdX, birdY);

    //Pipes draw
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //checkeo de la colision y que finalice el juego
    if (collisionCheck()) {
        endgame();
        return;
    }

    // forgot to move the pipes
    pipeX -= 1.5;
    // si el pipe se mueve fuera del frame necesitamos que se reinicie
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }


    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    //backgroundAudio.play();

    increaseScore();
    requestAnimationFrame(loop);

}

loop();