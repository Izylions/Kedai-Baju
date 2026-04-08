// scripts/app.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Izylions E-commerce loaded successfully.");
    
    // You can initialize your other modules here if needed
    // For example, checking if a user is already logged in via localStorage
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
});
