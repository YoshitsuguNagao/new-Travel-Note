const flightBtn = document.querySelector('.trip-btn');
const refreshBtn = document.querySelector('.refresh-btn');

function rotate() {
  const departureImput = document.forms.tripForm.departureDate.value;
  const returnImput = document.forms.tripForm.returnDate.value;
  const cityImput = document.forms.tripForm.departureCity.value;
  const budgetImput = document.forms.tripForm.budget.value;
  if (departureImput === null || departureImput === '', returnImput === null || returnImput === '', budgetImput === null || budgetImput === '', cityImput === null || cityImput === '') {
    return false;
  }
  flightBtn.classList.add('rotate');
}

function rotateRefresh() {
  refreshBtn.classList.add('rotate');
}

if (flightBtn) {
  flightBtn.addEventListener('click', rotate);
}

if (refreshBtn) {
  refreshBtn.addEventListener('click', rotateRefresh);
}
