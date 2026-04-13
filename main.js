const passwordDisplay = document.getElementById('passwordDisplay');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthInput = document.getElementById('lengthInput');
const includeUppercase = document.getElementById('includeUppercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecialChars = document.getElementById('includeSpecialChars');

const lowerCaseChars = "abcdefghijklmnopqrstuvwxyzçğıöşü";
const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇĞİÖŞÜ";
const numberChars = "0123456789";
const specialChars = "!@#$%^&*()_+[]{}|;:,.<>/?";

function generatePassword(length) {
    let charset = lowerCaseChars;
    let password = "";
    let requiredChars = [];

    if (includeUppercase.checked) {
        charset += upperCaseChars;
        requiredChars.push(upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]);
    }
    if (includeNumbers.checked) {
        charset += numberChars;
        requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (includeSpecialChars.checked) {
        charset += specialChars;
        requiredChars.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
    }

    if (!includeUppercase.checked && !includeNumbers.checked && !includeSpecialChars.checked && requiredChars.length === 0) {
         requiredChars.push(lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]);
    }

    const remainingLength = length - requiredChars.length;
    for (let i = 0; i < remainingLength; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    password += requiredChars.join('');
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    if (password.length > length) {
       password = password.slice(0, length);
       password = password.split('').sort(() => Math.random() - 0.5).join('');
    }
    else if (password.length < length && charset.length > 0) {
         while(password.length < length) {
             password += charset[Math.floor(Math.random() * charset.length)];
         }
         password = password.split('').sort(() => Math.random() - 0.5).join('');
    }

    return password;
}

function syncLength(value) {
    let numValue = Math.round(Number(value));
    numValue = Math.max(12, Math.min(64, numValue));

    if (!isNaN(numValue)) {
      lengthSlider.value = numValue;
      if (lengthInput.value !== String(numValue)) {
          lengthInput.value = numValue;
      }
    } else {
      lengthSlider.value = 12;
      lengthInput.value = 12;
    }
}

generateBtn.addEventListener('click', () => {
    const length = Math.max(12, Math.min(64, parseInt(lengthInput.value) || 12));
    lengthInput.value = length;
    lengthSlider.value = length;
    passwordDisplay.value = generatePassword(length);
});

clearBtn.addEventListener('click', () => {
    passwordDisplay.value = '';
});

copyBtn.addEventListener('click', () => {
    const password = passwordDisplay.value;
    if (password) {
        navigator.clipboard.writeText(password).then(() => {

        }).catch(err => {
            console.error('Kopyalama başarısız: ', err);

        });
    }
});

lengthSlider.addEventListener('input', (e) => {
    lengthInput.value = e.target.value;
});

lengthInput.addEventListener('input', (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    e.target.value = value;

    if (value !== '') {
        let numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 12 && numValue <= 64) {
            lengthSlider.value = numValue;
        }
    }
});

lengthInput.addEventListener('blur', (e) => {
    let value = e.target.value;
    let numValue = parseInt(value);

    if (value === '' || isNaN(numValue) || numValue < 12) {
        syncLength(12);
    } else if (numValue > 64) {
        syncLength(64);
    } else {
        syncLength(numValue);
    }
});

syncLength(lengthSlider.value);
