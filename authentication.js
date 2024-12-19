// Email Validation Function
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Function to handle Sign-Up
function validateSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (email === '' || password === '') {
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

    // Prepare data
    const userData = { email, password };

    // Check if users already exist in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    const userExists = existingUsers.some(user => user.email === email);
    if (userExists) {
        alert('Email already registered. Please sign in.');
        window.location.href = 'signin.html';
        return;
    }

    // Save new user to localStorage
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('Account successfully created!');
    window.location.href = 'C:\Users\Hussein\Desktop\Gymbeast\index.html'; // Redirect to C:\Users\Hussein\Desktop\Gymbeast\index.html
}

// Event listener for "SIGN IN" button (in Account Section)
document.addEventListener('DOMContentLoaded', function () {
    const toSigninButton = document.getElementById('to-signin');
    const finalSigninButton = document.getElementById('final-signin');
    const backToAccountButton = document.getElementById('back-to-account');

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
         window.location.href = 'C:\Users\Hussein\Desktop\Gymbeast\index.html'; // Redirect directly to C:\Users\Hussein\Desktop\Gymbeast\index.html if logged in
    }

    // Sign-In Button: Display the Sign-In Section
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

            // Show Sign-In Section
            document.getElementById('account-section').style.display = 'none';
            document.getElementById('signin-section').style.display = 'block';

            // Set the email in the Sign-In section
            document.getElementById('user-email-display').innerText = email;
        });
    }

    // "Not You?" link: Go back to Account Section
    if (backToAccountButton) {
        backToAccountButton.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('signin-section').style.display = 'none';
            document.getElementById('account-section').style.display = 'block';
        });
    }

    // Final Sign-In Button: Check credentials and sign in
    if (finalSigninButton) {
        finalSigninButton.addEventListener('click', function (e) {
            e.preventDefault();
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

            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check credentials
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                alert('Sign-In Successful!');
                // Store login state in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInEmail', email); // Store logged-in email
                window.location.href = 'C:\Users\Hussein\Desktop\Gymbeast\index.html'; // Redirect to C:\Users\Hussein\Desktop\Gymbeast\index.html
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }
});
