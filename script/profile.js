
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return JSON.parse(parts.pop().split(';').shift());
    return null;
}

// Función para establecer una cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Días hasta que expire
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}


document.addEventListener('DOMContentLoaded', function () {
    const profilePopup = document.querySelector('.profile');
    const editProfileButton = document.getElementById('edit_profile');
    const closePopupButton = document.getElementById('close_profile');
    const saveProfileButton = document.getElementById('save_profile');
    const myProfileButton = document.querySelector('.my_profile');

    // Constantes para los displays
    const usernameDisplay = document.getElementById('username_display');
    const emailDisplay = document.getElementById('email_display');
    const cityDisplay = document.getElementById('city_display');
    const countryDisplay = document.getElementById('country_display');
    
    // Mostrar el pop-up de perfil y cargar datos al hacer clic en el botón "Mi Perfil"
    myProfileButton.addEventListener('click', function () {
        const userData = getCookie('userData');

        usernameDisplay.textContent = userData?.username || '';
        emailDisplay.textContent = userData?.email || '';
        cityDisplay.textContent = userData?.city || '';
        countryDisplay.textContent = userData?.country || '';

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
        const userData = getCookie('userData') || {};

        userData.username = usernameDisplay.textContent;
        userData.email = emailDisplay.textContent;
        userData.city = cityDisplay.textContent;
        userData.country = countryDisplay.textContent;

        setCookie('userData', userData, 1);

        [usernameDisplay, emailDisplay, cityDisplay, countryDisplay].forEach(display => {
            display.style.border = 'none';
            display.removeAttribute('contenteditable');
        });
    });

    // Cerrar el pop-up al hacer clic en "Cerrar"
    closePopupButton.addEventListener('click', function () {
        profilePopup.style.display = 'none';
    });
});
