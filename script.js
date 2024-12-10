// DOM Elements
const passwordInput = document.getElementById('password');
const strengthMeter = document.querySelector('.strength-meter');
const requirements = document.querySelectorAll('.requirements p');
const togglePassword = document.getElementById('togglePassword');
const verifyButton = document.getElementById('verifyPassword');

// Password patterns
const patterns = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/
};

// Common passwords set
let commonPasswords = new Set();

// Load common passwords
async function loadCommonPasswords() {
    try {
        const response = await fetch('filtered_passwords.txt');
        const text = await response.text();
        commonPasswords = new Set(text.split('\n').map(pw => pw.trim().toLowerCase()));
    } catch (error) {
        console.error('Error loading common passwords:', error);
    }
}

// Initialize
loadCommonPasswords();

// Event Listeners
passwordInput.addEventListener('input', updateStrength);

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('showing');
});

verifyButton.addEventListener('click', async function() {
    const password = passwordInput.value.toLowerCase();
    
    if (commonPasswords.has(password)) {
        alert('Warning: This password was found in common password lists! Please choose a different password.');
    } else {
        alert('Success: Password not found in common password lists!');
    }
});

// Main strength checking function
function updateStrength() {
    const password = passwordInput.value;
    let strength = 0;
    let validRequirements = 0;

    // Check each requirement
    Object.keys(patterns).forEach((pattern, index) => {
        const isValid = patterns[pattern].test(password);
        const requirementElement = requirements[index];
        
        if (isValid) {
            requirementElement.classList.add('valid');
            validRequirements++;
            strength += 20;
        } else {
            requirementElement.classList.remove('valid');
        }
    });

    // Update strength meter
    strengthMeter.style.width = `${strength}%`;
    
    // Update color based on strength
    if (strength <= 40) {
        strengthMeter.setAttribute('data-strength', 'weak');
        strengthMeter.style.backgroundColor = '#ff4757';
    } else if (strength <= 80) {
        strengthMeter.setAttribute('data-strength', 'medium');
        strengthMeter.style.backgroundColor = '#ffa502';
    } else {
        strengthMeter.setAttribute('data-strength', 'strong');
        strengthMeter.style.backgroundColor = '#2ecc71';
    }

    // Enable/disable verify button
    verifyButton.disabled = strength !== 100;
}
