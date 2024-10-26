
// Función para obtener una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return JSON.parse(parts.pop().split(';').shift());
    }
    return null;
}


// Función para establecer una cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

// Función para mostrar mensaje de inicio de sesión exitoso
function showSuccessLogin() {
    const message = document.createElement('div');
    message.classList.add('success-message');
    message.textContent = 'Ha iniciado sesión correctamente.';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000); // 2000 ms
}

// Función para iniciar sesión
function startSession(username, email, city, country) {
    const sessionData = { username, email, city, country, active: true };
    setCookie('userSession', sessionData, 1); // Sesión activa por 1 día
}

document.addEventListener('DOMContentLoaded', function () {
    const loginButtons = document.querySelector('.access');             // Contenedor de los botones de login y registro
    const profileContainer = document.querySelector('.user_profile');   // Contenedor del perfil del usuario
    const profileIcon = document.querySelector('.profile__icon');       // Ícono de perfil
    const profileMenu = document.querySelector('.profile__menu');       // Menú del perfil

    profileMenu.classList.add('menu__hidden');

    // Manejar el envío del formulario de inicio de sesión
    document.querySelector('.login__form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir que el formulario recargue la página

        // Obtener los valores de los campos
        const username = document.getElementById('login_username').value;
        const password = document.getElementById('login_password').value;

        // Obtener la lista de usuarios registrados
        const registeredUsers = getCookie('registered_users') || [];

        // Verificar si el usuario está registrado
        if (!registeredUsers.includes(username)) {
            alert('No existe este usuario registrado. Por favor, regístrese primero.');
            return;
        }

        // Obtener los datos del usuario desde la cookie 'user_<username>'
        const userData = getCookie(`user_${username}`);

        // Verificar que el usuario y la contraseña sean correctos
        if (userData && userData.password === password) {
            document.querySelector('.login').style.display = 'none';            // Cerrar el pop-up de login
            showSuccessLogin();                                                 // Mostrar mensaje de éxito
            loginButtons.style.display = 'none';                                // Ocultar los botones de "Iniciar Sesión" y "Registrarse"
            profileContainer.style.display = 'flex';                            // Mostrar el ícono de perfil
            document.querySelector('.login__form').reset();                     // Limpiar el formulario

            // Iniciar la sesión con el correo electrónico del usuario autenticado
            startSession(userData.username, userData.email, userData.city, userData.country);
        } else {
            alert('Usuario o contraseña incorrectos. Inténtelo de nuevo.');
        }
    });

    // Mostrar/ocultar el menú del perfil al hacer clic en el ícono usando toggle de clase
    profileIcon.addEventListener('click', function() {
        profileMenu.classList.toggle('menu__hidden');  // Alternar la clase 'hidden' para mostrar/ocultar el menú
    });

    // Cerrar sesión
    document.querySelector('.logout').addEventListener('click', function () {
        const confirmLogout = confirm('¿Está seguro de que desea cerrar sesión?');
    
        if (confirmLogout) {
            profileContainer.style.display = 'none';            // Ocultar el perfil
            loginButtons.style.display = 'flex';                // Volver a mostrar los botones de login y registro
            profileMenu.classList.add('menu__hidden');          // Ocultar menú

            // Eliminar la cookie de sesión para cerrar la sesión
            setCookie('userSession', '', -1); // Expira la cookie para cerrar la sesión
        }
    });
    
    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!profileContainer.contains(event.target)) {
            profileMenu.classList.add('menu__hidden');
        }
    });
});
