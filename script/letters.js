
document.addEventListener('DOMContentLoaded', function () {
    const lettersPopup = document.getElementById('letters');                        // El pop-up de cartas
    const lettersContainer = document.querySelector('.letters-popup__container');   // Contenedor de las cartas
    const myLettersButton = document.querySelector('.my_letters');                  // Botón para abrir "Mis cartas"
    let dragSourceIndex = null; // Variable para almacenar el índice de la carta que se está arrastrando
    let dropTargetIndex = null; // Índice del destino de la carta arrastrada

    // Función para establecer datos en localStorage
    function setLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }

    // Función para obtener datos desde localStorage
    function getLocalStorage(name) {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
    }

    // Función para mostrar las cartas del usuario en el pop-up
    function displayLetters() {
        const noLettersMessage = document.querySelector('.no-letters'); // Mensaje "No hay cartas"
        const session = getLocalStorage('userSession');

        const userLettersKey = `user_${session.username}_letters`;
        const userLetters = getLocalStorage(userLettersKey) || [];

        lettersContainer.innerHTML = ''; // Limpiar el contenido anterior

        if (userLetters.length === 0) {
            noLettersMessage.style.display = 'flex'; // Mostrar el mensaje de "No hay cartas"
            lettersContainer.style.display = 'none'; // Ocultar el contenedor
        } else {
            noLettersMessage.style.display = 'none'; // Ocultar el mensaje
            lettersContainer.style.display = 'flex'; // Mostrar el contenedor
            userLetters.forEach((letter, index) => {
                const card = document.createElement('div');
                card.classList.add('letters-popup__card');
                card.setAttribute('draggable', 'true'); // Hacer la carta arrastrable
                card.setAttribute('data-index', index); // Asignar el índice como atributo de datos

                card.innerHTML = `
                    <button class="letters-popup__x" data-index="${index}">x</button>
                    <img class="letters-popup__img" src="images/profile_icon.webp" alt="Retrato de ${letter.name}">
                    <h2 class="letters-popup__name">${letter.name}</h2>
                    <h3 class="letters-popup__place">${letter.city}, ${letter.country}</h3>
                    <p class="letters-popup__text">${letter.message}</p>
                `;

                // Eventos de arrastre para cada carta
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragover', handleDragOver);
                card.addEventListener('drop', handleDrop);
                card.addEventListener('dragend', handleDragEnd);

                // Evento para eliminar carta al hacer clic en "x"
                card.querySelector('.letters-popup__x').addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    if (confirm('¿Está seguro de que desea eliminar esta carta?')) {
                        deleteLetter(index);
                    }
                });

                lettersContainer.appendChild(card); // Añadir la carta al contenedor
            });
        }

        lettersPopup.style.display = 'flex'; // Mostrar el pop-up
    }

    // Funciones de Drag and Drop
    function handleDragStart(ev) {
        dragSourceIndex = +this.getAttribute('data-index');
        ev.dataTransfer.effectAllowed = 'move';

        this.classList.add('dragged_letter');                  // Clase para resaltar la carta
        lettersContainer.classList.add('not-dragged_letter');  // Oscurecer el resto de cartas
    }

    // Limpia los estilos de borde de todas las cartas
    function removeBorders() {
        document.querySelectorAll('.letters-popup__card').forEach(card => {
            card.style.borderLeft = "none";
            card.style.borderRight = "none";
        });
    }

    function handleDragOver(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';

        const target = ev.currentTarget;
        const bounding = target.getBoundingClientRect();
        const offset = ev.clientX - bounding.left;

        removeBorders(); // Limpiar los estilos de borde de todas las cartas

        // Determinar si el usuario está arrastrando hacia el lado izquierdo o derecho de la carta
        if (offset < bounding.width / 2) {
            target.style.borderLeft = "3px solid #f00";
            target.style.borderRight = "none";
            dropTargetIndex = target.getAttribute('data-index');
        } else {
            target.style.borderRight = "3px solid #f00";
            target.style.borderLeft = "none";
            dropTargetIndex = target.getAttribute('data-index');
        }
    }

    function handleDrop(ev) {
        ev.stopPropagation();

        if (dragSourceIndex !== dropTargetIndex) {
            insertLetter(dragSourceIndex, dropTargetIndex); // Insertar carta en el nuevo índice
        }
        return false;
    }

    function handleDragEnd() {
        dragSourceIndex = null; // Limpiar el índice de la carta arrastrada
        dropTargetIndex = null; // Limpiar el índice de destino
        document.querySelectorAll('.letters-popup__card').forEach(card => {
            card.style.borderLeft = "none";
            card.style.borderRight = "none";
            card.classList.remove('dragged_letter');
        });
        lettersContainer.classList.remove('not-dragged_letter');
    }

    // Función para insertar carta en una nueva posición y actualizar el storage
    function insertLetter(fromIndex, toIndex) {
        const session = getLocalStorage('userSession');
        const userLettersKey = `user_${session.username}_letters`;
        let userLetters = getLocalStorage(userLettersKey) || [];

        // No hacer nada si la carta se intenta colocar en su misma posición o adyacente sin movimiento
        if (fromIndex === toIndex || fromIndex + 1 === toIndex || fromIndex - 1 === toIndex) {
            return;
        }

        // Extraer la carta arrastrada e iinsertarla en la nueva posición
        const [movedLetter] = userLetters.splice(fromIndex, 1);
        userLetters.splice(toIndex, 0, movedLetter);

        // Guardar el nuevo orden en el storage y actualizar display
        setLocalStorage(userLettersKey, userLetters, 7);
        displayLetters();
    }

    // Eliminar una carta y actualizar el storage
    function deleteLetter(index) {
        const session = getLocalStorage('userSession');
        const userLettersKey = `user_${session.username}_letters`;
        let userLetters = getLocalStorage(userLettersKey) || [];

        // Eliminar la carta del array y actualizar el storage
        userLetters.splice(index, 1);
        setLocalStorage(userLettersKey, userLetters);

        displayLetters();
    }

    // Evento para abrir el pop-up y cargar cartas al hacer clic en "Mis cartas"
    myLettersButton.addEventListener('click', displayLetters);

    // Evento para cerrar el pop-up con el botón "Cerrar"
    document.querySelector('.letters-popup__close').addEventListener('click', function () {
        lettersPopup.style.display = 'none';
        lettersContainer.innerHTML = ''; // Limpiar el contenedor
    });

    // Evento para cerrar el pop-up al hacer clic fuera del él
    window.addEventListener('click', function (ev) {
        if (ev.target === lettersPopup) {
            lettersPopup.style.display = 'none';
            lettersContainer.innerHTML = ''; // Limpiar el contenedor
        }
    });
});
