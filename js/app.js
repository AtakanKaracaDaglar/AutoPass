/** Main Application Logic */

// Application State
const state = {
    mode: 'random',
    length: 16,
    options: {
        uppercase: true,
        numbers: true,
        symbols: true
    },
    passwords: [],
    currentPassword: ''
};

// Storage Key
const STORAGE_KEY = 'autopass_history';

/** Initialize Application */
function init() {
    loadFromStorage();
    setupEventListeners();
    renderPasswordList(state.passwords);
    updateLengthDisplay(state.length);
}

/** Load Saved Passwords */
function loadFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            state.passwords = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load from storage:', e);
        state.passwords = [];
    }
}

/** Save Passwords Locally */
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.passwords));
    } catch (e) {
        console.warn('Failed to save to storage:', e);
    }
}

/** Setup Event Listeners */
function setupEventListeners() {
    // Mode Selection
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
            toggleHintInput(state.mode === 'hint');
        });
    });

    // Length Control
    const lengthSlider = document.getElementById('lengthSlider');
    if (lengthSlider) {
        lengthSlider.addEventListener('input', (e) => {
            state.length = parseInt(e.target.value);
            updateLengthDisplay(state.length);
        });
    }

    // Option Toggles
    const optionInputs = document.querySelectorAll('.option-input');
    optionInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.options[e.target.name] = e.target.checked;
        });
    });

    // Generate Action
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerate);
    }

    // Copy Action
    const copyBtn = document.getElementById('copyCurrentBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (state.currentPassword) {
                copyToClipboard(state.currentPassword);
            }
        });
    }

    // Download History
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadAsTxt(state.passwords);
        });
    }

    // Clear History
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllPasswords);
    }

    // Regenerate Action
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', handleGenerate);
    }
}


/** Generate Password Logic */
function handleGenerate() {
    const hintInput = document.getElementById('hintInput');
    const passwordOutput = document.getElementById('passwordOutput');

    let password;

    if (state.mode === 'hint') {
        const hint = hintInput?.value.trim();
        if (!hint) {
            showToast('Please enter a hint', 'error');
            hintInput?.focus();
            return;
        }
        password = generateHintPassword(hint, state.length, state.options);
    } else {
        password = generateRandomPassword(state.length, state.options);
    }

    state.currentPassword = password;

    // Display Result
    if (passwordOutput) {
        passwordOutput.textContent = password;
        animateGenerate();
    }

    // Strength Calculation
    const strength = calculateStrength(password);
    updateStrengthIndicator(strength);

    // Save To History
    const passwordEntry = {
        password,
        mode: state.mode,
        strength,
        timestamp: Date.now()
    };

    state.passwords.unshift(passwordEntry);

    // Limit History Size
    if (state.passwords.length > 50) {
        state.passwords = state.passwords.slice(0, 50);
    }

    saveToStorage();
    renderPasswordList(state.passwords);

    // Show Output
    const outputSection = document.getElementById('outputSection');
    if (outputSection) {
        outputSection.classList.add('visible');
    }
}

/** Delete Single Password */
function deletePassword(index) {
    state.passwords.splice(index, 1);
    saveToStorage();
    renderPasswordList(state.passwords);
    showToast('Password removed');
}

/** Clear All Passwords */
function clearAllPasswords() {
    if (state.passwords.length === 0) {
        showToast('History is already empty', 'info');
        return;
    }

    state.passwords = [];
    state.currentPassword = '';
    saveToStorage();
    renderPasswordList(state.passwords);

    const passwordOutput = document.getElementById('passwordOutput');
    if (passwordOutput) {
        passwordOutput.textContent = '••••••••••••';
    }

    const outputSection = document.getElementById('outputSection');
    if (outputSection) {
        outputSection.classList.remove('visible');
    }

    showToast('All passwords cleared');
}

// Init On Load
document.addEventListener('DOMContentLoaded', init);
