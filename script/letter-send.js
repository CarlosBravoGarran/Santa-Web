document.addEventListener('DOMContentLoaded', function () {
    
    // Función para establecer datos en localStorage
    function setLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }

    // Función para obtener datos desde localStorage
    function getLocalStorage(name) {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
    }

    // Función para mostrar mensaje de éxito temporal
    function showSuccessSend() {
        const message = document.createElement('div');
        message.classList.add('success-message');
        message.textContent = 'Carta enviada al Polo Norte.';
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 1500);
    }

    // Escuchar el botón de envío y verificar la validez del formulario
    document.querySelector('.send_letter').addEventListener('click', function (event) {
        const form = document.querySelector('.letter_form');

        if (!form.checkValidity()) {
            // Si el formulario no es válido, detén el envío y muestra los mensajes de error
            form.reportValidity();
            return;
        }

        event.preventDefault(); // Detener el envío por defecto después de validación
        console.log("Formulario enviado y validado");

        // Obtener datos de la sesión
        const session = getLocalStorage('userSession');
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

        console.log("Datos del formulario obtenidos");

        // Verificar que el correo coincida con el registrado
        if (emailInput !== session.email) {
            alert("El correo ingresado no coincide con el registrado en la cuenta.");
            return;
        }

        // Obtener cartas anteriores del usuario o inicializar un array vacío
        const userLettersKey = `user_${session.username}_letters`;
        let userLetters = getLocalStorage(userLettersKey) || [];
        console.log("Cartas anteriores obtenidas:", userLetters);

        // Crear un nuevo objeto de carta y añadirlo al array de cartas
        const newLetter = {
            name: nameInput,
            email: emailInput,
            city: cityInput,
            country: countryInput,
            message: messageInput,
            date: new Date().toISOString()
        };
        userLetters.push(newLetter);

        // Guardar el array actualizado en el storage
        setLocalStorage(userLettersKey, userLetters);
        
        // Confirmación de envío
        showSuccessSend();
        form.reset(); // Limpiar el formulario
    });
});
