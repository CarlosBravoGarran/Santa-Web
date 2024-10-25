// Añadir el "placeholder" en el select al cargar la página
const selectElement = document.getElementById('user_gender');
selectElement.insertAdjacentHTML('afterbegin', '<option value="" selected hidden>Ingresa tu género</option>');


// Abrir el pop-up de registro
document.querySelector('.access input[value="Registrarse"]').addEventListener('click', function() {
    document.querySelector('.pop-up.register').style.display = 'flex';
});

// Cerrar el pop-up cuando se haga clic en "Cancelar"
document.querySelector('.register__buttons input[value="Cancelar"]').addEventListener('click', function() {
    if (confirm('¿Está seguro de que desea cancelar el registro?')) {
        document.querySelector('.pop-up.register').style.display = 'none';
    }
});

// Cerrar el pop-up cuando se haga clic fuera del pop-up
document.addEventListener('click', function(event) {
    const popUp = document.querySelector('.pop-up.register');
    const form = document.querySelector('.register__form');
    if (popUp.style.display === 'flex' && !form.contains(event.target) && !event.target.closest('.access input[value="Registrarse"]') && confirm('¿Está seguro de que desea cancelar el registro?')) {
        popUp.style.display = 'none';
    }
});

// Limpiar campos con confirmación
document.querySelector('.register__buttons input[value="Limpiar Datos"]').addEventListener('click', function() {
    if (confirm('¿Está seguro de que desea limpiar todos los campos?')) {
        document.querySelector('.register__form').reset();
        document.getElementById('child_form').innerHTML = ''; // Limpiar los campos de los hijos

    }
});

document.addEventListener('DOMContentLoaded', function () {
    const childrenField = document.getElementById('user_children');
    const childrenContainer = document.getElementById('child_form');

    // Función para crear los campos adicionales para los hijos
    function createChildrenFields(numChildren) {
        // Limpiar los campos anteriores
        childrenContainer.innerHTML = '';

        for (let i = 1; i <= numChildren; i++) {
            // Crear un contenedor para cada hijo
            const childDiv = document.createElement('div');
            childDiv.classList.add('register__field');
            childDiv.innerHTML = `
                <h3>Hijo/a ${i}</h3>
                <label for="child_name_${i}">Nombre</label>
                <input type="text" id="child_name_${i}" name="child_name_${i}" placeholder="Nombre del hijo/a ${i}">
                <label for="child_age_${i}">Edad</label>
                <input type="number" id="child_age_${i}" name="child_age_${i}" placeholder="Edad del hijo/a ${i}">
                <label for="child_toy_${i}">Juguete favorito</label>
                <input type="text" id="child_toy_${i}" name="child_toy_${i}" placeholder="Juguete favorito del hijo/a ${i}">
            `;
            // Añadir el contenedor al formulario
            childrenContainer.appendChild(childDiv);
        }
    }

    // Función mostrar mensaje de registro temporal
    function showSuccessRegister() {
        const message = document.createElement('div');
        message.classList.add('success-message');
        message.textContent = 'Se ha registrado correctamente.';
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 2000); // 2000 ms
    }

    // Función para establecer una cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Días hasta que expire
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    // Actualizar campos cuando cambie el número de hijos
    childrenField.addEventListener('input', function () {
        const numChildren = parseInt(childrenField.value);

        if (numChildren > 0) {
            createChildrenFields(numChildren);
        } else {
            childrenContainer.innerHTML = ''; // Si no tiene hijos limpiar el contenedor
        }
    });

    // Comprobar el formulario y enviarlo
    document.querySelector('.register__form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que recargue la página al enviar el formulario

        // Obtener valores de los campos del formulario
        const username = document.getElementById('user_name').value;
        const password = document.getElementById('user_password').value;
        const confirmPassword = document.getElementById('user_confirm_password').value;
        const email = document.getElementById('user_email').value;
        const city = document.getElementById('user_city').value;
        const country = document.getElementById('user_country').value;
        const gender = document.getElementById('user_gender').value;
        const children = document.getElementById('user_children').value;

        // Validación de nombre de usuario (mínimo 3 caracteres)
        if (username.length < 3) {
            alert('El nombre de usuario debe tener al menos 3 caracteres.');
            return;
        }

        // Validación de contraseña (mínimo 12 caracteres, con 2 números, 1 carácter especial, 1 mayúscula y 1 minúscula)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{2,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            alert('La contraseña debe tener al menos 12 caracteres, incluyendo 2 números, 1 carácter especial, 1 letra mayúscula y 1 letra minúscula.');
            return;
        }

        // Validación de confirmación de contraseña
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('El correo electrónico no es válido.');
            return;
        }

        // Validación de ciudad y país (mínimo 3 caracteres)
        if (city.length < 3 || country.length < 3) {
            alert('La ciudad y el país deben tener al menos 3 caracteres.');
            return;
        }

        // Validación de hijos (campo numérico)
        if (isNaN(children) || children < 0) {
            alert('Por favor, ingrese un número válido para el campo "hijos".');
            return;
        }

        // Comprobar y obtener datos de los hijos
        const childrenList = [];
        for (let i = 1; i <= children; i++) {
            const childName = document.getElementById(`child_name_${i}`).value;
            const childAge = document.getElementById(`child_age_${i}`).value;
            const childToy = document.getElementById(`child_toy_${i}`).value;

            if (childName.length < 2) {
                alert(`El nombre de la hija/o ${i} debe tener al menos 2 caracteres.`);
                return;
            }

            if (isNaN(childAge) || childAge <= 0) {
                alert(`Por favor, ingrese una edad válida para la hija/o ${i}.`);
                return;
            }

            if (childToy.length < 2) {
                alert(`El juguete favorito de la hija/o ${i} debe tener al menos 2 caracteres.`);
                return;
            }

            childrenList.push({ name: childName, age: childAge, toy: childToy });
        }

        // Crear objeto con los datos del usuario
        const userData = {
            username: username,
            password: password,
            email: email,
            city: city,
            country: country,
            gender: gender,
            children: childrenList
        };

        setCookie('userData', userData, 1);                                 // Guardar valores en una cookie
        document.querySelector('.pop-up.register').style.display = 'none';  // Cerrar la ventana del formulario tras la confirmación
        showSuccessRegister();                                               // Mostrar mensaje de éxito
        document.querySelector('.register__form').reset();                  // Limpiar el formulario
        childrenContainer.innerHTML = '';                                   // Limpiar los campos de los hijos
    });
});




//--------------LOG IN---------------//

// Abrir el pop-up de iniciar sesión
document.querySelector('.access input[value="Iniciar Sesión"]').addEventListener('click', function() {
    document.querySelector('.pop-up.login').style.display = 'flex';
});

// Cerrar el pop-up al hacer clic en "Cancelar"
document.querySelector('.login__buttons input[value="Cancelar"]').addEventListener('click', function() {
    document.querySelector('.pop-up.login').style.display = 'none';
});

// Cerrar el pop-up al hacer clic fuera del pop-up
document.addEventListener('click', function(event) {
    const popUp = document.querySelector('.pop-up.login');
    const form = document.querySelector('.login__form');
    if (popUp.style.display === 'flex' && !form.contains(event.target) && !event.target.closest('.access input[value="Iniciar Sesión"]')){
        popUp.style.display = 'none';
    }
});

// Función para obtener datos de una cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return JSON.parse(parts.pop().split(';').shift());
    return null;
}

// Función mostrar mensaje de registro temporal
function showSuccessLogin() {
    const message = document.createElement('div');
    message.classList.add('success-message');
    message.textContent = 'Ha iniciado sesión correctamente.';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000); // 2000 ms
}