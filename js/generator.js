/**
 * AutoPass Web - Password Generator Module
 * Handles password generation logic with cryptographically secure randomness
 */

const CHAR_SETS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

/**
 * Get cryptographically secure random integer
 */
function getSecureRandom(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getSecureRandom(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Generate a random password based on options
 * @param {number} length - Password length
 * @param {Object} options - Character options
 * @returns {string} Generated password
 */
function generateRandomPassword(length, options = {}) {
    const { uppercase = true, numbers = true, symbols = true } = options;

    let charset = CHAR_SETS.lowercase;
    let required = [];

    // Add character sets and ensure at least one from each
    if (uppercase) {
        charset += CHAR_SETS.uppercase;
        required.push(CHAR_SETS.uppercase[getSecureRandom(CHAR_SETS.uppercase.length)]);
    }
    if (numbers) {
        charset += CHAR_SETS.numbers;
        required.push(CHAR_SETS.numbers[getSecureRandom(CHAR_SETS.numbers.length)]);
    }
    if (symbols) {
        charset += CHAR_SETS.symbols;
        required.push(CHAR_SETS.symbols[getSecureRandom(CHAR_SETS.symbols.length)]);
    }

    // Always include at least one lowercase
    required.push(CHAR_SETS.lowercase[getSecureRandom(CHAR_SETS.lowercase.length)]);

    // Generate remaining characters
    const remaining = length - required.length;
    const chars = [...required];

    for (let i = 0; i < remaining; i++) {
        chars.push(charset[getSecureRandom(charset.length)]);
    }

    // Shuffle to randomize positions
    return shuffleArray(chars).join('');
}

/**
 * Generate a password based on a hint
 * Keeps the hint intact at the beginning and appends random characters
 * @param {string} hint - User provided hint (will be preserved at start)
 * @param {number} length - Total password length
 * @param {Object} options - Character options for the random part
 * @returns {string} Generated password: hint + random characters
 */
function generateHintPassword(hint, length, options = {}) {
    const { uppercase = true, numbers = true, symbols = true } = options;

    // Clean the hint (remove spaces)
    const cleanHint = hint.replace(/\s/g, '');

    // If hint is already longer than or equal to desired length, just return hint trimmed
    if (cleanHint.length >= length) {
        return cleanHint.slice(0, length);
    }

    // Calculate how many random characters we need
    const randomLength = length - cleanHint.length;

    // Build charset for random part
    let charset = CHAR_SETS.lowercase;
    if (uppercase) charset += CHAR_SETS.uppercase;
    if (numbers) charset += CHAR_SETS.numbers;
    if (symbols) charset += CHAR_SETS.symbols;

    // Generate random characters
    let randomPart = [];
    let required = [];

    // Ensure at least one of each selected type in the random part
    if (uppercase && randomLength > 0) {
        required.push(CHAR_SETS.uppercase[getSecureRandom(CHAR_SETS.uppercase.length)]);
    }
    if (numbers && randomLength > 1) {
        required.push(CHAR_SETS.numbers[getSecureRandom(CHAR_SETS.numbers.length)]);
    }
    if (symbols && randomLength > 2) {
        required.push(CHAR_SETS.symbols[getSecureRandom(CHAR_SETS.symbols.length)]);
    }

    // Fill remaining random length
    const remainingLength = randomLength - required.length;
    for (let i = 0; i < remainingLength; i++) {
        randomPart.push(charset[getSecureRandom(charset.length)]);
    }

    // Combine required chars with random chars and shuffle
    const allRandomChars = [...required, ...randomPart];
    const shuffledRandom = shuffleArray(allRandomChars);

    // Final password: hint + shuffled random characters
    return cleanHint + shuffledRandom.join('');
}

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} Strength score (0-100) and label
 */
function calculateStrength(password) {
    let score = 0;

    // Length score (max 30)
    score += Math.min(password.length * 2, 30);

    // Character variety (max 40)
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;

    // Unique characters ratio (max 20)
    const uniqueRatio = new Set(password).size / password.length;
    score += Math.floor(uniqueRatio * 20);

    // Consecutive characters penalty
    let consecutive = 0;
    for (let i = 1; i < password.length; i++) {
        if (Math.abs(password.charCodeAt(i) - password.charCodeAt(i - 1)) === 1) {
            consecutive++;
        }
    }
    score -= Math.min(consecutive * 2, 10);

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine label and color
    let label, color;
    if (score < 30) {
        label = 'Weak';
        color = '#ef4444';
    } else if (score < 60) {
        label = 'Fair';
        color = '#f59e0b';
    } else if (score < 80) {
        label = 'Good';
        color = '#10b981';
    } else {
        label = 'Strong';
        color = '#22c55e';
    }

    return { score, label, color };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateRandomPassword, generateHintPassword, calculateStrength };
}
