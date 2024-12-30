function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function isValidLebaneseNumber(number) {
    const regex = /^(03|70|71|76|78|79|01|04|05|06|07|09|81)\d{6}$/;
    return regex.test(number);
}

function validateSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const name = document.getElementById('signup-name').value.trim();
    const confirm = document.getElementById('signup-confirm').value.trim();
    const number = document.getElementById('signup-number').value.trim();

    if (email === '' || password === '' || name === '' || confirm === '' || number === '') {
        alert('Please fill in all fields.');
        return;
    }
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
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

    const userData = { email, password, name, number };

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some(user => user.email === email);
    if (userExists) {
        alert('Email already registered. Please sign in.');
        window.location.href = 'signin.html';
        return;
    }

    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInEmail', email);

    alert('Account successfully created!');
    window.location.href = '../index.html';
}


function handleSignin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === '' || password === '') {
        alert('Please enter both email and password.');
        return;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Sign-In Successful!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInEmail', email);

        window.location.href = '../index.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = '../index.html';
        return;
    }

    const toSigninButton = document.getElementById('to-signin');
    const finalSigninButton = document.getElementById('final-signin');
    const backToAccountButton = document.getElementById('back-to-account');

    if (toSigninButton) {
        toSigninButton.addEventListener('click', function (e) {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

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

            document.getElementById('user-email-display').innerText = email;
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
