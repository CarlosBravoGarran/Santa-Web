
document.addEventListener('DOMContentLoaded', function () {
    // Elementos de la barra de navegación
    const loginButtons = document.querySelector('.access');             // Contenedor de los botones de login y registro
    const profileContainer = document.querySelector('.user_profile');   // Contenedor del perfil del usuario
    const profileIcon = document.querySelector('.profile__icon');       // Ícono de perfil
    const profileMenu = document.querySelector('.profile__menu');       // Menú del perfil

    // Manejar el envío del formulario de inicio de sesión
    document.querySelector('.login__form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir que el formulario recargue la página

        // Obtener los valores de los campos
        const username = document.getElementById('login_username').value;
        const password = document.getElementById('login_password').value;

        // Intentar obtener los datos de usuario guardados en la cookie
        const userData = getCookie('userData');

        // Si no hay datos guardados
        if (!userData) {
            alert('No existen usuarios registrados. Por favor, regístrese primero.');
            return;
        }

        // Comprobar si el usuario introducido existe y la contraseña es correcta
        if (userData.username === username && userData.password === password) {
            document.querySelector('.pop-up.login').style.display = 'none';     // Cerrar el pop-up de login
            showSuccessLogin();                                                 // Mostrar mensaje de éxito
            loginButtons.style.display = 'none';                                // Ocultar los botones de "Iniciar Sesión" y "Registrarse"
            profileContainer.style.display = 'flex';                            // Mostrar el ícono de perfil
            document.querySelector('.login__form').reset();                     // Limpiar el formulario
        } else {
            alert('Usuario o contraseña incorrectos. Inténtelo de nuevo.');
        }
    });

    // Mostrar/ocultar el menú del perfil al hacer clic en el ícono usando toggle de clase
    profileIcon.addEventListener('click', function() {
        profileMenu.classList.toggle('menu__hidden');  // Alternar la clase 'hidden' para mostrar/ocultar el menú
    });

    // Cerrar sesión
    document.getElementById('logout_button').addEventListener('click', function () {
        // Preguntar al usuario si desea cerrar sesión
        const confirmLogout = confirm('¿Está seguro de que desea cerrar sesión?');
    
        if (confirmLogout) {
            profileContainer.style.display = 'none';            // Ocultar el perfil
            loginButtons.style.display = 'flex';                // Volver a mostrar los botones de login y registro
            profileMenu.classList.add('menu__hidden');          // Ocultar menú
        }
    });
    
    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!profileContainer.contains(event.target)) {
            profileMenu.classList.add('menu__hidden');
        }
    });
});
