// scripts/cart.js

// State management
let cart = [];
let wishlist = [];

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const wishlistBtn = document.getElementById('wishlist-btn');
const addToCartHeroBtn = document.getElementById('add-to-cart-hero');

// Function to update the cart UI
function updateCartUI() {
    cartBtn.textContent = `Cart (${cart.length})`;
}

// Add to Cart Logic
addToCartHeroBtn.addEventListener('click', () => {
    // In a real app, you would pass an object with product details (ID, name, price)
    const product = {
        id: 1,
        name: "Izylions Signature Jacket",
        price: 199.99
    };
    
    cart.push(product);
    updateCartUI();
    
    // Optional: Visual feedback
    addToCartHeroBtn.textContent = "Added!";
    addToCartHeroBtn.style.backgroundColor = "#4CAF50"; // Green success color
    
    setTimeout(() => {
        addToCartHeroBtn.textContent = "Add to Cart";
        addToCartHeroBtn.style.backgroundColor = ""; // Reset
    }, 2000);
});

// Wishlist Logic
wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (wishlist.length === 0) {
        alert("Your wishlist is currently empty. Start adding items!");
    } else {
        alert(`You have ${wishlist.length} items in your wishlist.`);
    }
});
