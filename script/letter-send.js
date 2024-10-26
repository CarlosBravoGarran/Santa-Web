
document.addEventListener('DOMContentLoaded', function () {
    // Funciones utilitarias
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return JSON.parse(parts.pop().split(';').shift());
        }
        return null;
    }
    

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    // Función mostrar mensaje de registro temporal
    function showSuccessSend() {
        const message = document.createElement('div');
        message.classList.add('success-message');
        message.textContent = 'Carta enviada al Polo Norte.';
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 1500);
    }

    // Verificar la sesión y enviar carta
    document.querySelector('.send_letter').addEventListener('click', function (event) {
        event.preventDefault(); 
        console.log("Botón de enviar carta presionado");

        // Obtener datos de la sesión
        const session = getCookie('userSession');
        if (!session || !session.active) {
            alert("Debe iniciar sesión para enviar una carta.");
            console.log("Sesión no iniciada o inactiva.");
            return;
        }

        // Obtener datos del formulario
        const nameInput = document.getElementById('letter_name').value;
        const emailInput = document.getElementById('letter_email').value;
        const cityInput = document.getElementById('letter_city').value;
        const countryInput = document.getElementById('letter_country').value;
        const messageInput = document.getElementById('letter_message').value;

        console.log("Datos del formulario obtenidos:");

        // Verificar que el correo coincida con el registrado
        if (emailInput !== session.email) {
            alert("El correo ingresado no coincide con el registrado en la cuenta.");
            return;
        }

        // Obtener cartas anteriores del usuario o inicializar un array vacío
        const userLettersKey = `user_${session.username}_letters`;
        let userLetters = getCookie(userLettersKey) || [];
        console.log("Cartas anteriores obtenidas:", userLetters);

        // Crear un nuevo objeto de carta y añadrilo al array de cartas
        const newLetter = {
            name: nameInput,
            email: emailInput,
            city: cityInput,
            country: countryInput,
            message: messageInput,
            date: new Date().toISOString()
        };
        userLetters.push(newLetter);

        // Guardar el array actualizado en la cookie
        setCookie(userLettersKey, userLetters, 7);
        console.log("Nueva carta guardada en cookie:", newLetter);

        // Confirmación de envío
        showSuccessSend();
        document.querySelector('.letter_form').reset(); // Limpiar el formulario
    });
});
