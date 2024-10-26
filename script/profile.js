
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

// Función para eliminar una cookie
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


document.addEventListener('DOMContentLoaded', function () {

    deleteCookie('userSession'); // Eliminar la cookie de sesión al cargar la página


    // Elementos para el pop-up de perfil
    const profilePopup = document.querySelector('.profile');
    const editProfileButton = document.getElementById('edit_profile');
    const closePopupButton = document.getElementById('close_profile');
    const saveProfileButton = document.getElementById('save_profile');
    const myProfileButton = document.querySelector('.my_profile');

    // Elementos de visualización de datos de perfil
    const usernameDisplay = document.getElementById('username_display');
    const emailDisplay = document.getElementById('email_display');
    const cityDisplay = document.getElementById('city_display');
    const countryDisplay = document.getElementById('country_display');

    // Mostrar el pop-up de perfil y cargar datos al hacer clic en el botón "Mi Perfil"
    myProfileButton.addEventListener('click', function () {
        const session = getCookie('userSession');
        if (!session || !session.active) {
            alert("No hay ninguna sesión activa.");
            return;
        }

        const userData = getCookie(`user_${session.username}`);
        if (userData) {
            usernameDisplay.textContent = userData.username || '';
            emailDisplay.textContent = userData.email || '';
            cityDisplay.textContent = userData.city || '';
            countryDisplay.textContent = userData.country || '';
        }

        profilePopup.style.display = 'flex';
    });

    // Hacer editable el perfil al hacer clic en "Editar"
    editProfileButton.addEventListener('click', function () {
        [usernameDisplay, emailDisplay, cityDisplay, countryDisplay].forEach(display => {
            display.style.border = '1px solid #000';
            display.setAttribute('contenteditable', 'true');
        });
    });

    // Guardar los cambios al hacer clic en "Guardar"
    saveProfileButton.addEventListener('click', function () {
        const session = getCookie('userSession');
        if (!session || !session.active) {
            alert("No hay ninguna sesión activa para guardar cambios.");
            return;
        }

        // Obtener los datos actuales de la cookie del usuario
        const oldUsername = session.username;
        const userData = getCookie(`user_${oldUsername}`) || {};

        // Actualizar solo los campos editados
        const newUsername = usernameDisplay.textContent;
        userData.username = newUsername;
        userData.email = emailDisplay.textContent;
        userData.city = cityDisplay.textContent;
        userData.country = countryDisplay.textContent;

        // Guardar la cookie de `user_<username>` actualizada
        setCookie(`user_${newUsername}`, userData, 7);

        // Si el nombre de usuario ha cambiado, actualizar `registered_users` y `userSession`
        if (newUsername !== oldUsername) {
            deleteCookie(`user_${oldUsername}`);

            // Actualizar `registered_users`
            let registeredUsers = getCookie('registered_users') || [];
            const index = registeredUsers.indexOf(oldUsername);
            if (index !== -1) {
                registeredUsers[index] = newUsername;
                setCookie('registered_users', registeredUsers, 7);
            }

            // Actualizar la cookie `userSession` con el nuevo nombre de usuario
            session.username = newUsername;
            setCookie('userSession', session, 1);
        }

        // Restaurar los estilos de los campos y quitar la edición
        [usernameDisplay, emailDisplay, cityDisplay, countryDisplay].forEach(display => {
            display.style.border = 'none';
            display.removeAttribute('contenteditable');
        });

        alert("Perfil actualizado correctamente.");
    });

    // Cerrar el pop-up al hacer clic en "Cerrar"
    closePopupButton.addEventListener('click', function () {
        profilePopup.style.display = 'none';
    });
});
