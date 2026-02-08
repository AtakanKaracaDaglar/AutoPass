/** UI Interaction Module */

/** Show Toast Notification */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto Remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/** Copy To Clipboard */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Password copied to clipboard!');
        return true;
    } catch (err) {
        // Fallback Mechanism
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showToast('Password copied to clipboard!');
            return true;
        } catch (e) {
            showToast('Failed to copy password', 'error');
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

/** Download Password List */
function downloadAsTxt(passwords) {
    if (!passwords || passwords.length === 0) {
        showToast('No passwords to download', 'error');
        return;
    }

    const content = passwords.map((p, i) => `${i + 1}. ${p.password}`).join('\n');
    const header = `AutoPass Web - Generated Passwords\nDate: ${new Date().toLocaleString()}\n${'='.repeat(40)}\n\n`;

    const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `passwords_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    showToast('Passwords downloaded successfully!');
}

/** Update Strength UI */
function updateStrengthIndicator(strength) {
    const bar = document.getElementById('strengthBar');
    const label = document.getElementById('strengthLabel');

    if (bar && label) {
        bar.style.width = `${strength.score}%`;
        bar.style.backgroundColor = strength.color;
        label.textContent = strength.label;
        label.style.color = strength.color;
    }
}

/** Toggle Input Visibility */
function togglePasswordVisibility(element) {
    const type = element.type === 'password' ? 'text' : 'password';
    element.type = type;
    return type === 'text';
}

/** Update Length Display */
function updateLengthDisplay(value) {
    const display = document.getElementById('lengthValue');
    if (display) {
        display.textContent = value;
    }
}

/** Toggle Hint Input */
function toggleHintInput(show) {
    const hintContainer = document.getElementById('hintContainer');
    if (hintContainer) {
        hintContainer.style.display = show ? 'block' : 'none';
        hintContainer.style.opacity = show ? '1' : '0';
    }
}

/** Render Password List */
function renderPasswordList(passwords) {
    const list = document.getElementById('passwordList');
    if (!list) return;

    if (passwords.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔐</span>
                <p>No passwords generated yet</p>
                <p class="empty-hint">Generate your first password above!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = passwords.map((item, index) => `
        <div class="password-item" data-index="${index}">
            <div class="password-content">
                <span class="password-text">${item.password}</span>
                <div class="password-meta">
                    <span class="password-mode">${item.mode === 'hint' ? '💡 Hint' : '🎲 Random'}</span>
                    <span class="password-strength" style="color: ${item.strength.color}">${item.strength.label}</span>
                </div>
            </div>
            <div class="password-actions">
                <button class="btn-icon btn-copy" onclick="copyToClipboard('${item.password}')" title="Copy">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                <button class="btn-icon btn-delete" onclick="deletePassword(${index})" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

/** Animate Generation Effect */
function animateGenerate() {
    const output = document.getElementById('passwordOutput');
    if (output) {
        output.classList.remove('generated');
        void output.offsetWidth; // Force reflow
        output.classList.add('generated');
    }
}
