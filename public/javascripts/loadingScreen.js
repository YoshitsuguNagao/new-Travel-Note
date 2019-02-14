
const flightBtn = document.querySelector('.trip-btn');

function rotate() {
  flightBtn.classList.add('rotate');
  console.log('hola');
}

flightBtn.addEventListener('click', rotate);
