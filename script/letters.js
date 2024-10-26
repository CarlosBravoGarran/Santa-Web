
document.addEventListener('DOMContentLoaded', function () {
    const lettersPopup = document.getElementById('letters');                        // El pop-up de cartas
    const lettersContainer = document.querySelector('.letters-popup__container');   // Contenedor de las cartas
    const myLettersButton = document.querySelector('.my_letters');                  // Botón para abrir "Mis cartas"

    // Función para obtener los datos de la cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return JSON.parse(parts.pop().split(';').shift());
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
            document.querySelector('.letters-popup__container').style.display = 'none' // Ocultar el contenedor
        } else {
            noLettersMessage.style.display = 'none'; // Ocultar el mensaje
            document.querySelector('.letters-popup__container').style.display = 'flex'; // Mostrar el contenedor
            userLetters.forEach((letter, index) => {
                const card = document.createElement('div');
                card.classList.add('letters-popup__card');

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

        lettersContainer.innerHTML = ``; // Limpiar el contenedor


        displayLetters(); // Refrescar la vista de cartas
    }

    // Evento para abrir el pop-up y cargar cartas al hacer clic en "Mis cartas"
    myLettersButton.addEventListener('click', displayLetters);

    // Evento para cerrar el pop-up con el botón "Cerrar"
    document.querySelector('.letters-popup__close').addEventListener('click', function () {
        lettersPopup.style.display = 'none';
        lettersContainer.innerHTML = ``; // Limpiar el contenedor
    });

    // Evento para cerrar el pop-up al hacer clic fuera del él
    window.addEventListener('click', function (e) {
        if (e.target === lettersPopup) {
            lettersPopup.style.display = 'none';
            lettersContainer.innerHTML = ``; // Limpiar el contenedor
        }
    });
});
