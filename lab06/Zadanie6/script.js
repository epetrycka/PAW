const newPasswordInput = document.getElementById('new-password');
const repeatPasswordInput = document.getElementById('repeat-password');
const toggleNewBtn = document.getElementById('toggle-new');
const toggleRepeatBtn = document.getElementById('toggle-repeat');
const matchMessageEl = document.getElementById('match-message');

const reqLength = document.getElementById('req-length');
const reqSpecial = document.getElementById('req-special');
const reqCapital = document.getElementById('req-capital');
const reqDigit = document.getElementById('req-digit');

const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const capitalRegex = /[A-Z]/;
const digitRegex = /[0-9]/;

function toggleVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

toggleNewBtn.addEventListener('click', () => {
    toggleVisibility(newPasswordInput, toggleNewBtn);
});

toggleRepeatBtn.addEventListener('click', () => {
    toggleVisibility(repeatPasswordInput, toggleRepeatBtn);
});

function updateRequirement(element, isValid) {
    const icon = element.querySelector('i');

    icon.classList.remove('fa-circle', 'fa-check-circle', 'fa-xmark');
    element.classList.remove('valid', 'invalid');

    if (isValid) {
        element.classList.add('valid');
        icon.classList.add('fa-check-circle');
    } else {
        element.classList.add('invalid');
        icon.classList.add('fa-xmark');
    }
}

function validatePassword() {
    const password = newPasswordInput.value;
    
    updateRequirement(reqLength, password.length >= 8);
    updateRequirement(reqSpecial, specialCharRegex.test(password));
    updateRequirement(reqCapital, capitalRegex.test(password));
    updateRequirement(reqDigit, digitRegex.test(password));
}

newPasswordInput.addEventListener('input', validatePassword);

validatePassword();

function checkPasswordMatch(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        
        const newPass = newPasswordInput.value;
        const repeatPass = repeatPasswordInput.value;

        matchMessageEl.classList.remove('message-success', 'message-error');

        if (newPass === '' || repeatPass === '') {
                matchMessageEl.textContent = 'Pola nie mogą być puste.';
                matchMessageEl.classList.add('message-error');
                return;
        }

        if (newPass === repeatPass) {
            matchMessageEl.textContent = 'Hasła są zgodne!';
            matchMessageEl.classList.add('message-success');
        } else {
            matchMessageEl.textContent = 'Hasła nie są zgodne!';
            matchMessageEl.classList.add('message-error');
        }
    }
}

repeatPasswordInput.addEventListener('keydown', checkPasswordMatch);