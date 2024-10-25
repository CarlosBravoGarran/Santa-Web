// Función para obtener los datos de la cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            try {
                return JSON.parse(parts.pop().split(';').shift());
            } catch (error) {
                console.error("Error parsing JSON from cookie:", error);
                return null;
            }
        }
        return null;
    }

    
document.addEventListener('DOMContentLoaded', function () {
    const lettersPopup = document.getElementById('letters'); // El pop-up de cartas
    const lettersContainer = document.querySelector('.letters-popup__container'); // Contenedor donde se mostrarán las cartas
    const noLettersMessage = document.querySelector('.no-letters'); // Mensaje "No hay cartas"
    const myLettersButton = document.querySelector('.my_letters'); // Botón para abrir "Mis cartas"

    

    // Función para mostrar las cartas del usuario en el pop-up
    function displayLetters() {
        const session = getCookie('userSession');
        if (!session || !session.active) {
            alert("Debe iniciar sesión para ver sus cartas.");
            return;
        }

        const userLettersKey = `user_${session.username}_letters`;
        const userLetters = getCookie(userLettersKey) || [];

        if (userLetters.length === 0) {
            noLettersMessage.style.display = 'flex'; // Mostrar el mensaje de "No hay cartas"
        } else {
            noLettersMessage.style.display = 'none'; // Ocultar el mensaje
            userLetters.forEach((letter) => {
                const card = document.createElement('div');
                card.classList.add('letters-popup__content');

                card.innerHTML = `
                    <img class="letters-popup__img" src="images/niño1.jpg" alt="Retrato de ${letter.name}">
                    <h2 class="letters-popup__name">${letter.name}</h2>
                    <h3 class="letters-popup__place">${letter.city}, ${letter.country}</h3>
                    <p class="letters-popup__text">${letter.message}</p>
                `;

                lettersContainer.appendChild(card); // Añadir la carta al contenedor
            });
        }

        lettersPopup.style.display = 'flex'; // Mostrar el pop-up
    }

    // Evento para abrir el pop-up y cargar cartas al hacer clic en "Mis cartas"
    myLettersButton.addEventListener('click', displayLetters);
});
