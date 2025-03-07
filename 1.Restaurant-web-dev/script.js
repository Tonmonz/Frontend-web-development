document.addEventListener("DOMContentLoaded", function() {
    // Navigation toggle for mobile
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    navToggle.addEventListener("click", function() {
        navLinks.classList.toggle("active");
        if (navLinks.classList.contains("active")) {
            navLinks.style.display = "flex";
        } else {
            setTimeout(() => {
                navLinks.style.display = "none";
            }, 300);
        }
    });

    // Scroll header effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu tabs functionality
    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuCategories = document.querySelectorAll(".menu-category");

    menuTabs.forEach(tab => {
        tab.addEventListener("click", function() {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove("active"));
            // Add active class to clicked tab
            this.classList.add("active");
            
            // Hide all menu categories
            menuCategories.forEach(category => {
                category.classList.remove("active");
            });
            
            // Show the corresponding category
            const categoryId = this.getAttribute("data-category");
            document.getElementById(categoryId).classList.add("active");
        });
    });

    // Shopping cart functionality
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartPreview = document.querySelector(".cart-preview");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotalPrice = document.getElementById("cart-total-price");
    const closeCartButton = document.getElementById("close-cart");

    // Cart data
    let cart = [];

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function() {
            const menuItem = this.closest(".menu-item");
            const title = menuItem.querySelector("h3").textContent.replace(/\s*\bPopular\b|\s*\bChef's Choice\b|\s*\bClassic\b|\s*\bVegetarian\b|\s*\bHouse Special\b|\s*\bNon-Alcoholic\b/g, '').trim();
            const price = parseFloat(menuItem.querySelector(".price").textContent.replace('$', ''));
            const imgSrc = menuItem.querySelector("img").src;
            
            // Check if item already in cart
            const existingItemIndex = cart.findIndex(item => item.title === title);
            
            if (existingItemIndex !== -1) {
                // Increase quantity if item already in cart
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    title,
                    price,
                    imgSrc,
                    quantity: 1
                });
            }
            
            // Update cart display
            updateCart();
            
            // Show cart preview
            cartPreview.classList.add("active");
            
            // Animation for button
            this.classList.add("added");
            setTimeout(() => {
                this.classList.remove("added");
            }, 500);
        });
    });

    // Close cart preview
    closeCartButton.addEventListener("click", function() {
        cartPreview.classList.remove("active");
    });

    // Update cart function
    function updateCart() {
        // Clear cart items
        cartItems.innerHTML = "";
        
        // Calculate total price and count
        let totalPrice = 0;
        let totalCount = 0;
        
        // Add items to cart display
        cart.forEach((item, index) => {
            totalPrice += item.price * item.quantity;
            totalCount += item.quantity;
            
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
            cartItemElement.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        // Update cart count and total price
        cartCount.textContent = `(${totalCount})`;
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        const decreaseButtons = document.querySelectorAll(".decrease");
        const increaseButtons = document.querySelectorAll(".increase");
        
        decreaseButtons.forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                cart[index].quantity += 1;
                updateCart();
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                    setTimeout(() => {
                        navLinks.style.display = "none";
                    }, 300);
                }
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById("contact-form");
    const reservationForm = document.getElementById("reservation-form");
    const formMessage = document.getElementById("form-message");
    const reservationMessage = document.getElementById("reservation-message");

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            formMessage.textContent = "Thank you for your message! We'll get back to you soon.";
            formMessage.style.color = "#4CAF50";
            contactForm.reset();
        });
    }

    if (reservationForm) {
        reservationForm.addEventListener("submit", function(e) {
            e.preventDefault();
            reservationMessage.textContent = "Reservation confirmed! We look forward to serving you.";
            reservationMessage.style.color = "#4CAF50";
            reservationForm.reset();
        });
    }

    // Animation on scroll
    function revealOnScroll() {
        const elements = document.querySelectorAll('.menu-item, .hero-content, h2');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
});