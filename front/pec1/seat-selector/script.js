const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const currencySelect = document.getElementById('currency');
const totalCurrency = document.getElementById('totalCurrency');

populateCurrency();
populateUI();

let ticketPrice = +movieSelect.value;

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

// Save selected movie index and price
function setCurrencyData(selectedIndex, value) {
    localStorage.setItem('selectedCurrencyIndex', selectedIndex);
    localStorage.setItem('selectedCurrencyRate', value);
}

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = `${selectedSeatsCount}`;
    total.innerText = `${(selectedSeatsCount * ticketPrice * currencySelect.value).toFixed(2)}`;

    if (currencySelect.selectedIndex !== -1) {
        totalCurrency.innerText = currencySelect.options[currencySelect.selectedIndex].text;
    }

    setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

// Fetch currency data
function populateCurrency() {
    fetch('https://open.exchangerate-api.com/v6/latest/usd')
        .then(res => res.json())
        .then(data => {
            let currencies = Object.entries(data.rates).map(rate => {
                return `<option value="${rate[1]}">${rate[0]}</option>`;
            });
            currencySelect.innerHTML = currencies.join('');

            const selectedCurrencyIndex = localStorage.getItem('selectedCurrencyIndex');
            if (selectedCurrencyIndex !== null) {
                currencySelect.selectedIndex = selectedCurrencyIndex;
            } else {
                currencySelect.selectedIndex = 0;
            }
            replaceMoviePrice();
            updateSelectedCount();
        });
}

function replaceMoviePrice() {
    [...movieSelect.options].forEach(option => {
        const newValue = (option.value * currencySelect.value).toFixed(2);
        let newCurrency = currencySelect.options[currencySelect.selectedIndex].text;
        option.text = `${option.text.split('(')[0].trim()} (${newValue} ${newCurrency})`;
    });
    ticketPrice = +movieSelect.value;
}

// Get data from localstorage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

// Movie select event
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

// Currency select event
currencySelect.addEventListener('change', e => {
    setCurrencyData(e.target.selectedIndex, e.target.value);
    replaceMoviePrice();
    updateSelectedCount();
});

// Seat click event
container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

// Initial count and total set
updateSelectedCount();