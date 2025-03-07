// Product Database
const PRODUCTS = [
    {
        id: 1,
        name: "Advanced Smart Watch",
        description: "Fitness tracker with heart rate monitor and GPS",
        price: 129.99,
        category: "wearables",
        rating: 4,
        image: "images/smartwatch.jpg",
        stock: 50
    },
    {
        id: 2,
        name: "Premium Noise Cancelling Headphones",
        description: "Wireless headphones with 40-hour battery life",
        price: 249.99,
        category: "audio",
        rating: 4.5,
        image: "images/headphones.jpg",
        stock: 30
    },
    {
        id: 3,
        name: "Portable Bluetooth Speaker",
        description: "Rugged design with 360-degree sound",
        price: 79.99,
        category: "audio",
        rating: 3.5,
        image: "images/speaker.jpg",
        stock: 75
    },
    {
        id: 4,
        name: "MacBook Pro 16\"",
        description: "High-performance laptop with M2 chip",
        price: 2499.99,
        category: "computers",
        rating: 5,
        image: "images/macbook.jpg",
        stock: 21
    },
    {
        id: 5,
        name: "Fitness Tracker Band",
        description: "Slim design with sleep and activity tracking",
        price: 59.99,
        category: "wearables",
        rating: 4,
        image: "images/fitness-band.jpg",
        stock: 100
    }
];
// Global Variables
let cart = [];
let wishlist = [];

// Product Rendering Function
function renderProducts(productsToRender = PRODUCTS) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    productsToRender.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product');
        productEl.dataset.id = product.id;
        productEl.dataset.name = product.name;
        productEl.dataset.price = product.price;
        productEl.dataset.category = product.category;

        productEl.innerHTML = `
            <div class="product-badge ${product.stock < 20 ? 'low-stock' : ''}">
                ${product.stock < 20 ? 'Low Stock' : ''}
            </div>
            <img src="${product.image}" alt="${product.name}">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-rating">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <span class="rating">
                        ${generateStarRating(product.rating)}
                    </span>
                </div>
                <div class="product-actions">
                    <button onclick="addToCart(this)" class="add-to-cart">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button onclick="addToWishlist(this)" class="add-to-wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        productGrid.appendChild(productEl);
    });
}

// Star Rating Generation
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return `
        ${[...Array(fullStars)].map(() => '<i class="fas fa-star"></i>').join('')}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${[...Array(emptyStars)].map(() => '<i class="far fa-star"></i>').join('')}
    `;
}

// Filtering and Sorting Functions
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const filteredProducts = categoryFilter 
        ? PRODUCTS.filter(p => p.category === categoryFilter)
        : PRODUCTS;
    
    renderProducts(filteredProducts);
}

function sortProducts() {
    const sortOption = document.getElementById('sort-select').value;
    let sortedProducts = [...PRODUCTS];

    switch(sortOption) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
    }

    renderProducts(sortedProducts);
}

function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const searchResults = PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );

    renderProducts(searchResults);
}

// Wishlist Management
function addToWishlist(button) {
    const product = button.closest('.product');
    const id = product.dataset.id;
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);

    // Check if product is already in wishlist
    if (!wishlist.some(item => item.id === id)) {
        wishlist.push({ id, name, price });
        updateWishlistDisplay();
        animateWishlistIcon(button);
    }
}

function updateWishlistDisplay() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlistNav = document.getElementById('wishlist-nav');
    const wishlistSection = document.getElementById('wishlist-section');

    wishlistGrid.innerHTML = '';
    wishlist.forEach(item => {
        const product = PRODUCTS.find(p => p.id == item.id);
        if (product) {
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('product', 'wishlist-item');
            wishlistItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <div class="wishlist-actions">
                        <button onclick="moveToCart('${item.id}')">
                            <i class="fas fa-cart-plus"></i> Move to Cart
                        </button>
                        <button onclick="removeFromWishlist('${item.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            wishlistGrid.appendChild(wishlistItem);
        }
    });

    wishlistCount.textContent = wishlist.length;
    wishlistSection.classList.toggle('hidden', wishlist.length === 0);
    wishlistNav.classList.toggle('active', wishlist.length > 0);
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id != id);
    updateWishlistDisplay();
}

function moveToCart(id) {
    const wishlistItem = wishlist.find(item => item.id == id);
    if (wishlistItem) {
        addToCart(document.querySelector(`.product[data-id="${id}"] .add-to-cart`));
        removeFromWishlist(id);
    }
}

function animateWishlistIcon(button) {
    const wishlistIcon = button.querySelector('.fa-heart');
    wishlistIcon.classList.add('animate-heart');
    setTimeout(() => {
        wishlistIcon.classList.remove('animate-heart');
    }, 600);
}

// Cart Management
function addToCart(button) {
    const product = button.closest('.product');
    const id = product.dataset.id;
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);

    // Find the full product details
    const fullProduct = PRODUCTS.find(p => p.id == id);

    // Check stock availability
    if (fullProduct.stock <= 0) {
        showModal('Out of Stock', 'This product is currently unavailable.');
        return;
    }

    // Check if product is already in cart
    const existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex > -1) {
        // Increment quantity if product exists
        if (cart[existingProductIndex].quantity < fullProduct.stock) {
            cart[existingProductIndex].quantity++;
        } else {
            showModal('Stock Limit', `Only ${fullProduct.stock} items available.`);
            return;
        }
    } else {
        // Add new product to cart
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }

    updateCartDisplay();
    updateCartCount();
    enableCheckoutButton();
}

function updateCartDisplay() {
    const cartBody = document.getElementById('cart-body');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total-amount');
    const clearCartBtn = document.getElementById('clear-cart');

    // Clear existing cart items
    cartBody.innerHTML = '';

    // Calculate totals
    let subtotal = 0;

    // Populate cart items
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button onclick="changeQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button onclick="removeFromCart(${index})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartBody.appendChild(row);
    });

    // Calculate tax and total
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    // Update totals display
    subtotalEl.textContent = subtotal.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);

    // Show/hide clear cart button
    clearCartBtn.style.display = cart.length > 0 ? 'block' : 'none';
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    // Remove item if quantity becomes zero
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartDisplay();
    updateCartCount();
    enableCheckoutButton();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
    enableCheckoutButton();
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    updateCartCount();
    enableCheckoutButton();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function enableCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = cart.length === 0;
}

function checkout() {
    if (cart.length === 0) return;

    const subtotal = parseFloat(document.getElementById('subtotal').textContent);
    const tax = parseFloat(document.getElementById('tax').textContent);
    const total = parseFloat(document.getElementById('total-amount').textContent);

    showModal('Order Confirmation', `
        <p>Thank you for your purchase!</p>
        <p>Order Details:</p>
        <ul>
            ${cart.map(item => `
                <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
            `).join('')}
        </ul>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax: $${tax.toFixed(2)}</p>
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
    `);

    // Clear cart after checkout
    cart = [];
    updateCartDisplay();
    updateCartCount();
}

// Modal System
function showModal(title, message) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
        <h2>${title}</h2>
        ${message}
        <button onclick="closeModal()">Close</button>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    enableCheckoutButton();
});