document.addEventListener('DOMContentLoaded', function () {
    const lettersPopup = document.getElementById('letters'); // El pop-up de cartas
    const lettersContainer = document.querySelector('.letters-popup__container'); // Contenedor donde se mostrarán las cartas
    const myLettersButton = document.querySelector('.my_letters'); // Botón para abrir "Mis cartas"

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

    // Función para establecer la cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    // Función para mostrar las cartas del usuario en el pop-up
    function displayLetters() {
        const noLettersMessage = document.querySelector('.no-letters'); // Mensaje "No hay cartas"
        const session = getCookie('userSession');

        const userLettersKey = `user_${session.username}_letters`;
        const userLetters = getCookie(userLettersKey) || [];

        if (userLetters.length === 0) {
            noLettersMessage.style.display = 'flex'; // Mostrar el mensaje de "No hay cartas"
        } else {
            noLettersMessage.style.display = 'none'; // Ocultar el mensaje
            userLetters.forEach((letter, index) => {
                const card = document.createElement('div');
                card.classList.add('letters-popup__content');

                card.innerHTML = `
                    <button class="letters-popup__x" data-index="${index}">x</button>
                    <img class="letters-popup__img" src="images/profile_icon.webp" alt="Retrato de ${letter.name}">
                    <h2 class="letters-popup__name">${letter.name}</h2>
                    <h3 class="letters-popup__place">${letter.city}, ${letter.country}</h3>
                    <p class="letters-popup__text">${letter.message}</p>
                `;

                // Evento para eliminar carta al hacer clic en "x"
                card.querySelector('.letters-popup__x').addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (confirm('¿Está seguro de que desea eliminar esta carta?')) {
                        deleteLetter(index);
                    }
                });

                lettersContainer.appendChild(card); // Añadir la carta al contenedor
            });
        }

        lettersPopup.style.display = 'flex'; // Mostrar el pop-up
    }

    // Función para eliminar una carta y actualizar la cookie
    function deleteLetter(index) {
        const session = getCookie('userSession');
        const userLettersKey = `user_${session.username}_letters`;
        let userLetters = getCookie(userLettersKey) || [];

        // Eliminar la carta del array y actualizar la cookie
        userLetters.splice(index, 1);
        setCookie(userLettersKey, userLetters, 7); // Actualizar la cookie con el nuevo array de cartas

        lettersContainer.innerHTML = `
            <h2 class="letters-popup__title">Tus Cartas</h2>
            <div class="no-letters">
                NO HAY CARTAS EN EL BUZÓN DE PAPÁ NOEL
            </div>
            `; // Limpiar el contenedor de cartas manteniendo el título


        displayLetters(); // Refrescar la vista de cartas
    }

    // Evento para abrir el pop-up y cargar cartas al hacer clic en "Mis cartas"
    myLettersButton.addEventListener('click', displayLetters);
});
