
document.addEventListener('DOMContentLoaded', function() {
    const game1Button = document.getElementById('game1_button'); // Botón "Juego 1"
    const gameImage = document.getElementById('game_image');
    const game2Container = document.querySelector('.game2__container');
    const game1Container = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.querySelector('.game_start-button');
    const playArea = document.querySelector('.play-area');
    const circle = document.querySelector('.circle');
    let score = 0;
    let timeLeft = 90;
    let gameInterval;
    let timerInterval;

    // Iniciar o detener el juego
    function toggleGame() {
        if (startButton.textContent === "Start Game") {
            startGame();
            startButton.style.backgroundColor = 'red';
        } else {
            endGame(true); // Finalizar el juego manualmente
            startButton.style.backgroundColor = 'green';
        }
    }

    // Iniciar el juego
    function startGame() {
        score = 0;
        timeLeft = 90;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        circle.style.display = 'block';
        startButton.textContent = "Stop Game"; // Cambiar el texto del botón
        startButton.disabled = false;

        // Mover el círculo cada segundo
        gameInterval = setInterval(moveCircle, 1000);
        // Iniciar el temporizador
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Mover el círculo a una posición aleatoria con desplazamiento
    function moveCircle() {
        const x = Math.floor(Math.random() * (playArea.clientWidth - 50));
        const y = Math.floor(Math.random() * (playArea.clientHeight - 50));
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
    }

    // Actualizar el temporizador
    function updateTimer() {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false); // Finalizar el juego automáticamente
        }
    }

    // Finalizar el juego
    function endGame(manual = false) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        circle.style.display = 'none';
        startButton.textContent = "Start Game"; // Volver a poner el texto en "Start Game"
        startButton.disabled = false;

        if (!manual) { // Si el juego terminó automáticamente
            alert(`Game Over! Your final score is ${score}`);
        }
    }

    // Evento para contar puntos al hacer clic en el círculo
    circle.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = score;
    });

    // Mostrar el juego al hacer clic en el botón "Juego 1"
    game1Button.addEventListener('click', function() {
        gameImage.style.display = 'none';
        game2Container.style.display = 'none';
        game1Container.style.display = 'flex';
    });

    // Evento para iniciar o detener el juego al hacer clic en el botón "Start/Stop Game"
    startButton.addEventListener('click', toggleGame);
});
