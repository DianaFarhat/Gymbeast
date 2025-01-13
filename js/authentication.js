// Utility Functions
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidLebaneseNumber(number) {
    const regex = /^(03|70|71|76|78|79|01|04|05|06|07|09|81)\d{6}$/;
    return regex.test(number);
}

// Hashing password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function validateSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const name = document.getElementById('signup-name').value.trim();
    const confirm = document.getElementById('signup-confirm').value.trim();
    const number = document.getElementById('signup-number').value.trim();

    const missingFields = [];
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!name) missingFields.push('Name');
    if (!confirm) missingFields.push('Confirm Password');
    if (!number) missingFields.push('Phone Number');

    if (missingFields.length > 0) {
        alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (password.length < 8 ) {
        alert('Password must contain at least 8 characters.');
        return;
    }

    if (confirm !== password) {
        alert('Passwords do not match.');
        return;
    }

    if (!isValidLebaneseNumber(number)) {
        alert('Please enter a valid Lebanese phone number.');
        return;
    }

    let hashedPassword;
    try {
        hashedPassword = await hashPassword(password);
    } catch (error) {
        alert('An error occurred while processing your password. Please try again.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert('Email already registered. Please sign in.');
        window.location.href = 'signin.html';
        return;
    }

    const userData = {
        email,
        password: hashedPassword,
        name,
        number,
        shippingAddress: {},
        billingAddress: {}
    };

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    document.cookie = `isLoggedIn=true; path=/; max-age=86400; Secure; SameSite=Strict`;
    document.cookie = `loggedInEmail=${encodeURIComponent(email)}; path=/; max-age=86400; Secure; SameSite=Strict`;

    alert('Account successfully created!');
    window.location.href = '../index.html';
}


// Signin Function
async function handleSignin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === '' || password === '') {
        alert('Please enter both email and password.');
        return;
    }

    // Hash the entered password
    const hashedPassword = await hashPassword(password);
    console.log('Entered email:', email);
    console.log('Entered hashed password:', hashedPassword);

    // Retrieve users from local storage
    const users = JSON.parse(localStorage.getItem('users')) ||  [];
    console.log('Stored users:', users);

    // Find user with matching email and hashed password
    const user = users.find(user => user.email === email);

    if (user) {
        if (user.password === hashedPassword) {
            // If password matches, log the user in
            document.cookie = "isLoggedIn=true; path=/; max-age=86400; Secure; SameSite=Strict";
            document.cookie = "loggedInEmail=${email}; path=/; max-age=86400; Secure; SameSite=Strict";

            alert('Sign-In Successful!');
            window.location.href = '../index.html';
        } else {
            alert('Invalid password. Please try again.');
        }
    } else {
        alert('Invalid email. Please try again.');
    }
}

// Prefill Checkout
function prefillCheckout() {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});

    if (cookies.isLoggedIn === 'true') {
        const email = cookies.loggedInEmail;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);
        if (user) {
            document.getElementById('checkout-name').value = user.name;
            document.getElementById('checkout-email').value = user.email;
            document.getElementById('checkout-number').value = user.number;
        }
    }
}


// Event Listeners

document.addEventListener('DOMContentLoaded', function () {
    // Select the button by its ID
    const createAccountButton = document.getElementById('create-account-button');

    // Check if the button exists on the page
    if (createAccountButton) {
        // Add the click event listener
        createAccountButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent any default button behavior
            validateSignup();   // Call the validateSignup function
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {
    // Redirect if already logged in
    const isLoggedIn = document.cookie.includes('isLoggedIn=true');
    if (isLoggedIn) {
        window.location.href = '../index.html';
        return;
    }

    // Elements for navigation buttons
    const toSigninButton = document.getElementById('to-signin');
    const finalSigninButton = document.getElementById('final-signin');
    const backToAccountButton = document.getElementById('back-to-account');

    if (toSigninButton) {
        toSigninButton.addEventListener('click', function (e) {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput ? emailInput.value.trim() : '';

            if (email === '') {
                alert('Please enter your email address.');
                return;
            }
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            document.getElementById('account-section').style.display = 'none';
            document.getElementById('signin-section').style.display = 'block';

            const emailDisplay = document.getElementById('user-email-display');
            if (emailDisplay) emailDisplay.innerText = email;
        });
    }

    if (backToAccountButton) {
        backToAccountButton.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('signin-section').style.display = 'none';
            document.getElementById('account-section').style.display = 'block';
        });
    }

    if (finalSigninButton) {
        finalSigninButton.addEventListener('click', function (e) {
            e.preventDefault();
            handleSignin();
        });
    }


});



function togglePassword(inputId, toggleIcon) {
    const input = document.getElementById(inputId);
    const icon = toggleIcon.querySelector('i');

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}