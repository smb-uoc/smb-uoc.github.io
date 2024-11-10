const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const age = document.getElementById('age');

// Show input error message
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    small.innerText = message;
}

// Show success outline
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

// Check email is valid
function checkEmail(input) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, 'Email is not valid');
    }
}

// Check required fields
function checkRequired(inputArr) {
    inputArr.forEach(function (input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`);
        } else {
            showSuccess(input);
        }
    })
}

// Get field name
function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Check input length
function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} characters`);
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} characters`);
    } else {
        return true;
    }
}

// Check passwords match
function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match');
    }
}

// Check age is valid
function checkAge(input, min, max) {
    if (input.value < min) {
        showError(input, `${getFieldName(input)} must be at least ${min}`);
    } else if (input.value >= max) {
        showError(input, `${getFieldName(input)} must be less than ${max}`);
    } else {
        showSuccess(input);
    }
}

// Check password has mandatory characters
function checkPasswordMandatoryCharacters(input) {
    const uppers = /[A-Z]/;
    const signs = /[`~!@#$%^&*()_+\-={}|\[\]\\:";'<>?,.\/]/;
    const lowers = /[a-z]/;
    const numbers = /[0-9]/;
    const valid = /^[a-zA-Z0-9`~!@#$%^&*()_+\-={}|\[\]\\:";'<>?,./]*$/;

    if (!uppers.test(input.value.trim())) {
        showError(input, `${getFieldName(input)} must contain at least one capital letter`);
    } else if (!signs.test(input.value.trim())) {
        showError(input, `${getFieldName(input)} must contain at least one of the following signs: \` ~ ! @ # $ % ^ & * ( ) _ + - = { } | [ ] \\ : " ; ' < > ? , . /`);
    } else if (!lowers.test(input.value.trim())) {
        showError(input, `${getFieldName(input)} must contain at least one lower letter`);
    } else if (!numbers.test(input.value.trim())) {
        showError(input, `${getFieldName(input)} must contain at least one number`);
    } else if (!valid.test(input.value.trim())) {
        showError(input, `${getFieldName(input)} must only contain letters, numbers or the following signs: \` ~ ! @ # $ % ^ & * ( ) _ + - = { } | [ ] \ : " ; ' < > ? , . /`);
    } else {
        return true;
    }
}

// Check password validations
function checkPassword(input, min, max) {
    if (checkPasswordMandatoryCharacters(input) && checkLength(input, min, max)) {
        showSuccess(input);
    }
}

// Event listeners
form.addEventListener('submit', function (e) {
    e.preventDefault();

    checkRequired([username, email, password, password2, age]);
    checkLength(username, 3, 15);
    checkPassword(password, 8, 25);
    checkEmail(email);
    checkPasswordsMatch(password, password2);
    checkAge(age, 0, 1000);
});
