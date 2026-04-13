const passwordDisplay = document.getElementById('passwordDisplay');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthInput = document.getElementById('lengthInput');
const includeUppercase = document.getElementById('includeUppercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecialChars = document.getElementById('includeSpecialChars');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
const toast = document.getElementById('toast');

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*()_+[]{}|;:,.<>/?";

function randomInt(max) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0xFFFFFFFF / max) * max;
    let x;
    do {
        crypto.getRandomValues(buf);
        x = buf[0];
    } while (x >= limit);
    return x % max;
}

function pick(str) {
    return str[randomInt(str.length)];
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generatePassword(length) {
    const pools = [LOWER];
    const required = [pick(LOWER)];

    if (includeUppercase.checked) { pools.push(UPPER); required.push(pick(UPPER)); }
    if (includeNumbers.checked) { pools.push(NUMBERS); required.push(pick(NUMBERS)); }
    if (includeSpecialChars.checked) { pools.push(SPECIAL); required.push(pick(SPECIAL)); }

    const charset = pools.join('');
    const chars = [...required];
    while (chars.length < length) chars.push(pick(charset));

    return shuffle(chars).join('');
}

function estimateStrength(pw) {
    if (!pw) return { pct: 0, label: '—', color: 'var(--border)' };
    let pool = 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 25;
    const entropy = pw.length * Math.log2(pool);
    const pct = Math.min(100, Math.round((entropy / 128) * 100));
    let label, color;
    if (entropy < 50) { label = 'Zayıf'; color = '#888'; }
    else if (entropy < 80) { label = 'Orta'; color = '#bbb'; }
    else if (entropy < 110) { label = 'Güçlü'; color = '#eee'; }
    else { label = 'Çok Güçlü'; color = '#fff'; }
    return { pct, label, color };
}

function updateStrength() {
    const { pct, label, color } = estimateStrength(passwordDisplay.value);
    strengthFill.style.width = pct + '%';
    strengthFill.style.background = color;
    strengthLabel.textContent = label;
}

function clampLength(v) {
    const n = Math.round(Number(v));
    if (isNaN(n)) return 16;
    return Math.max(12, Math.min(64, n));
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1500);
}

generateBtn.addEventListener('click', () => {
    const length = clampLength(lengthInput.value);
    lengthInput.value = length;
    lengthSlider.value = length;
    passwordDisplay.value = generatePassword(length);
    updateStrength();
});

clearBtn.addEventListener('click', () => {
    passwordDisplay.value = '';
    updateStrength();
});

copyBtn.addEventListener('click', async () => {
    const pw = passwordDisplay.value;
    if (!pw) return;
    try {
        await navigator.clipboard.writeText(pw);
        showToast('Kopyalandı');
    } catch {
        showToast('Kopyalanamadı');
    }
});

lengthSlider.addEventListener('input', (e) => {
    lengthInput.value = e.target.value;
});

lengthInput.addEventListener('input', (e) => {
    const v = e.target.value.replace(/\D/g, '');
    e.target.value = v;
    if (v !== '') {
        const n = parseInt(v, 10);
        if (n >= 12 && n <= 64) lengthSlider.value = n;
    }
});

lengthInput.addEventListener('blur', () => {
    const n = clampLength(lengthInput.value);
    lengthInput.value = n;
    lengthSlider.value = n;
});

[includeUppercase, includeNumbers, includeSpecialChars].forEach(cb => {
    cb.addEventListener('change', () => {
        if (passwordDisplay.value) {
            passwordDisplay.value = generatePassword(clampLength(lengthInput.value));
            updateStrength();
        }
    });
});

updateStrength();
