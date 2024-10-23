
const finalDate = new Date("December 24, 2024 23:59:00").getTime();    // Definir fecha y hora final

// Función para actualizar el contador cada segundo
const countdown = setInterval(function() {

  const actualDate = new Date().getTime();     // Obtener fecha y hora actual
  const timeLeft = finalDate - actualDate;    // Calcular diferencia entre fecha final y actual

  // Calcular días, horas, minutos y segundos
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Mostrar el resultado en el elemento "countdown"
  document.getElementById("countdown").innerHTML = days + " días " + hours + " h "
  + minutes + " min " + seconds + " seg";

  // Si la cuenta regresiva termina, mostrar un mensaje
  if (timeLeft < 0) {
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML = "¡Ha llegado el día!";
  }
}, 1000);
