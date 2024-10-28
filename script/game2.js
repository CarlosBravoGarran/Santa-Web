
document.addEventListener('DOMContentLoaded', function() {
    const game2Button = document.getElementById('game2_button'); 
    const gameImage = document.getElementById('game_image');
    const game1Container = document.getElementById('game-container');
    const game3Image = document.querySelector('.game3_img');
    const game2Container = document.querySelector('.game2__container');
    const memoryGrid = document.querySelector('.game2__grid');
    const restartButton = document.querySelector('.game2__restart-button');


    // Imágenes para el juego
    const images = [
        '🎅', '🎅', '🎄', '🎄', '⛄', '⛄', '🎁', '🎁',
        '🦌', '🦌', '🎉', '🎉', '🍪', '🍪', '🌟', '🌟',
        '🔔', '🔔', '❄️', '❄️'
    ];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0; // Contador de pares encontrados

    // Mezclar las imágenes
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Crear el tablero de juego
    function createBoard() {
        memoryGrid.innerHTML = '';
        const shuffledImages = shuffle(images);
        shuffledImages.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.innerHTML = `
                <div class="memory-card_inner">
                    <div class="memory-card_front"></div>
                    <div class="memory-card_back">${symbol}</div>
                </div>
            `;
            card.addEventListener('click', flipCard);
            memoryGrid.appendChild(card);
        });
    }

    // Voltear la carta
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            checkForMatch();
        }
    }

    // Comprobar si las cartas coinciden
    function checkForMatch() {
        const isMatch = firstCard.querySelector('.memory-card_back').textContent === secondCard.querySelector('.memory-card_back').textContent;
        isMatch ? disableCards() : unflipCards();
    }

    // Fijar las cartas
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++; // Incrementa el contador de pares encontrados
        resetBoard();

        if (matchedPairs === images.length / 2) {
            setTimeout(() => {
                showWinMessage();
                createBoard(); // Reinicia el juego
            }, 500);
        }
    }

    // Voltear las cartas de nuevo
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }


    // Reiniciar el tablero
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // Función mostrar mensaje 
    function showWinMessage() {
        const message = document.createElement('div');
        message.classList.add('win_message');
        message.textContent = '!HAS GANADO¡';
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 1500);
    }

    // Cambiar al juego 2
    game2Button.addEventListener('click', function() {
        gameImage.style.display = 'none';
        game1Container.style.display = 'none';
        game3Image.style.display = 'none';
        game2Container.style.display = 'flex';
        createBoard();
    });


    // Reiniciar el juego
    restartButton.addEventListener('click', createBoard);    

});
