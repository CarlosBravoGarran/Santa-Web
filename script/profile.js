
// Función para establecer datos en localStorage
function setLocalStorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

// Función para obtener datos desde localStorage
function getLocalStorage(name) {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
}

// Función para "expirar" o eliminar datos de localStorage
function clearLocalStorageItem(name) {
    localStorage.removeItem(name);
}

document.addEventListener('DOMContentLoaded', function () {

    clearLocalStorageItem('userSession'); // Eliminar la entrada de sesión al cargar la página


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
        const session = getLocalStorage('userSession');
        if (!session || !session.active) {
            alert("No hay ninguna sesión activa.");
            return;
        }

        const userData = getLocalStorage(`user_${session.username}`);
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
        const session = getLocalStorage('userSession');
        if (!session || !session.active) {
            alert("No hay ninguna sesión activa para guardar cambios.");
            return;
        }

        // Obtener los datos actuales del registro del usuario
        const oldUsername = session.username;
        const userData = getLocalStorage(`user_${oldUsername}`) || {};

        // Actualizar solo los campos editados
        const newUsername = usernameDisplay.textContent;
        userData.username = newUsername;
        userData.email = emailDisplay.textContent;
        userData.city = cityDisplay.textContent;
        userData.country = countryDisplay.textContent;

        // Guardar el registro de `user_<username>` actualizado y borrar el anterior
        setLocalStorage(`user_${newUsername}`, userData);
        clearLocalStorageItem(`user_${oldUsername}`);

        // Si el nombre de usuario ha cambiado, actualizar `registered_users`, `userSession` y user_<username>_letters
        if (newUsername !== oldUsername) {
            clearLocalStorageItem(`user_${oldUsername}`);

            // Actualizar `registered_users`
            let registeredUsers = getLocalStorage('registered_users') || [];
            const index = registeredUsers.indexOf(oldUsername);
            if (index !== -1) {
                registeredUsers[index] = newUsername;
                setLocalStorage('registered_users', registeredUsers);
            }

            // Actualizar el local storage de `userSession` con el nuevo nombre de usuario
            session.username = newUsername;
            setLocalStorage('userSession', session);

            // Actualizar `user_<username>_letters`
            const letters = getLocalStorage(`user_${oldUsername}_letters`) || [];
            setLocalStorage(`user_${newUsername}_letters`, letters);
            clearLocalStorageItem(`user_${oldUsername}_letters`);
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
