// scripts/auth.js

const loginBtn = document.getElementById('login-btn');

// Simulated login state
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Update the button text based on status
function updateLoginUI() {
    if (isLoggedIn) {
        loginBtn.textContent = 'My Account / Logout';
    } else {
        loginBtn.textContent = 'Login / Register';
    }
}

// Handle the click event
loginBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevents the link from jumping to the top of the page
    
    if (isLoggedIn) {
        // Handle Logout
        const confirmLogout = confirm("Do you want to log out of Izylions?");
        if (confirmLogout) {
            isLoggedIn = false;
            localStorage.setItem('isLoggedIn', 'false');
            alert("You have been logged out.");
            updateLoginUI();
        }
    } else {
        // Handle Login (Mockup)
        const username = prompt("Enter your username to login/register to Izylions:");
        if (username) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            alert(`Welcome, ${username}!`);
            updateLoginUI();
        }
    }
});

// Run this when the script loads to check previous sessions
function checkLoginStatus() {
    updateLoginUI();
}
