const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');
const overlayEl = document.getElementById('overlay');
const messageEl = document.getElementById('message');

// Fetch exchange rates and update the DOM
async function calculate() {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;
    let error = null;

    overlayEl.style.display = "flex";
    messageEl.innerText = "Loading...";
    messageEl.className = "loading";

    try {
        const res = await fetch(`https://open.exchangerate-api.com/v6/latest/${currency_one}`);
        const data = await res.json();

        const rate = data.rates[currency_two];
        rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
        amountEl_two.value = (amountEl_one.value * (rate)).toFixed(2);
    } catch (ex) {
        error = "Error loading data: " + ex.message;
        console.error(error);
    } finally {
        if (error !== null) {
            messageEl.innerText = error + "\nClick anywhere to retry";
            messageEl.className = "error";
        } else {
            messageEl.innerText = "";
            overlayEl.style.display = "none";
        }
    }
}

function checkValue() {
    if (amountEl_one.value < 0) {
        alert("El valor no puede ser negativo");
        amountEl_one.value = 1;
    }
    calculate();
}

// Event Listeners
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', checkValue);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);
overlayEl.addEventListener('click', calculate);

swap.addEventListener('click', () => {
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value = temp;
    calculate();
});

calculate();
