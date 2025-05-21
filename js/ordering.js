// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const categoryButtons = document.querySelectorAll('.menu-categories .btn');
const checkoutBtn = document.getElementById('checkout-btn');
const userInfoForm = document.getElementById('user-info-form');
const subtotalAmount = document.getElementById('subtotal-amount');
const finalTotalAmount = document.getElementById('final-total-amount');
const deliveryFee = 150; // PKR
const checkoutTotalAmount = document.getElementById('checkout-total-amount');

// State management
let currentStep = 1;
let selectedPaymentMethod = null;

// Initialize cart if not already initialized
window.cart = window.cart || [];

// Debug logs
console.log('Ordering.js loaded');
console.log('Products Grid Element:', productsGrid);
console.log('Products Array:', window.products);

// Format price to PKR (Global function)
window.formatPrice = window.formatPrice || function(price) {
    return `PKR ${price.toLocaleString()}`;
};

// Generate star rating HTML
const generateRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
};

// Create product card HTML
const createProductCard = (product) => {
    return `
        <div class="col-md-4 menu-item" data-category="${product.category}">
            <div class="card">
                ${product.isPopular ? '<div class="card-badge">Popular</div>' : ''}
                <div class="card-img-wrapper">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </div>
                <div class="card-body">
                    <div class="card-rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="card-footer">
                        <div class="price-tag">
                            <span class="price">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Function to add item to cart
function addToCart(productId) {
    try {
        // First try to find the product in the products array
        let product = window.products.find(p => p.id === Number(productId));
        
        // If not found in products, try to find in deals
        if (!product && window.deals) {
            product = window.deals.find(d => d.id === productId);
        }

        if (!product) {
            console.error('Product not found:', productId);
            showNotification('Error adding item to cart', 'error');
            return;
        }

        // Check if item already exists in cart
        const existingItem = window.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`Added another ${product.name} to cart`);
        } else {
            window.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                isDeal: !!window.deals?.find(d => d.id === productId) // Mark if it's a deal
            });
            showNotification(`${product.name} added to cart`);
        }

        // Update cart display
        window.updateCartDisplay();

    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding item to cart', 'error');
    }
}

// Filter products by category
const filterProducts = (category) => {
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    if (!window.products || !Array.isArray(window.products)) {
        console.error('Products array not found or invalid');
        return;
    }
    
    const filteredProducts = category === 'all' 
        ? window.products 
        : window.products.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="col-12 text-center"><p>No products found in this category</p></div>';
        return;
    }
    
    const productsHTML = filteredProducts.map(product => `
        <div class="col-md-4 menu-item" data-category="${product.category}">
            <div class="card">
                ${product.isPopular ? '<div class="card-badge">Popular</div>' : ''}
                <div class="card-img-wrapper">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </div>
                <div class="card-body">
                    <div class="card-rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="card-footer">
                        <div class="price-tag">
                            <span class="price">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    productsGrid.innerHTML = productsHTML;

    // Add event listeners to the new "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('.add-to-cart').dataset.productId;
            addToCart(productId);
        });
    });
};

// Deal Timer Functionality
function updateDealTimers() {
    const dealCards = document.querySelectorAll('.deal-card');
    
    dealCards.forEach(card => {
        const timerContainer = card.querySelector('.deal-timer');
        if (!timerContainer) return; // Skip if no timer exists

        const hoursElement = timerContainer.querySelector('.timer-item:nth-child(1) .timer-number');
        const minutesElement = timerContainer.querySelector('.timer-item:nth-child(2) .timer-number');
        const secondsElement = timerContainer.querySelector('.timer-item:nth-child(3) .timer-number');
        
        if (!hoursElement || !minutesElement || !secondsElement) return; // Skip if any timer element is missing
        
        let hours = parseInt(hoursElement.textContent);
        let minutes = parseInt(minutesElement.textContent);
        let seconds = parseInt(secondsElement.textContent);
        
        const timer = setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else {
                if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else {
                    if (hours > 0) {
                        hours--;
                        minutes = 59;
                        seconds = 59;
                    } else {
                        clearInterval(timer);
                        card.style.opacity = '0.5';
                        card.style.pointerEvents = 'none';
                        return;
                    }
                }
            }
            
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    });
}

// Add Deal to Cart Function
function addDealToCart(dealId) {
    const dealCard = document.querySelector(`[onclick="addDealToCart('${dealId}')"]`).closest('.deal-card');
    const dealName = dealCard.querySelector('h3').textContent;
    const dealPrice = dealCard.querySelector('.current-price').textContent;
    const dealImage = dealCard.querySelector('.deal-image img').src;
    
    // Create a new cart item
    const cartItem = {
        id: dealId,
        name: dealName,
        price: parseFloat(dealPrice.replace('PKR ', '')),
        quantity: 1,
        image: dealImage,
        isDeal: true
    };
    
    // Add to cart
    addToCart(cartItem.id);
    
    // Show notification
    showNotification(`${dealName} added to cart!`);
}

// Update order progress
function updateOrderProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    currentStep = step;
    
    steps.forEach((stepEl, index) => {
        if (index + 1 < step) {
            stepEl.classList.remove('active');
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });

    // Check if all requirements are met
    const isCartNotEmpty = window.cart && window.cart.length > 0;
    const isFormValid = validateFormSection();
    const isPaymentSelected = selectedPaymentMethod !== null;

    // Enable/disable checkout button based on all conditions
    if (checkoutBtn) {
        checkoutBtn.disabled = !(isCartNotEmpty && isFormValid && isPaymentSelected);
    }
}

// Form validation with visual feedback
function validateFormSection() {
    if (!userInfoForm) return false;

    let isValid = true;
    const requiredFields = [
        'userName',
        'userEmail',
        'userPhone',
        'deliveryArea',
        'houseNumber',
        'userAddress'
    ];

    requiredFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input || !input.value.trim()) {
            isValid = false;
            if (input) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            }
        } else if (input) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        }
    });

    // Additional validation for specific fields
    const emailInput = document.getElementById('userEmail');
    if (emailInput && emailInput.value) {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        if (!emailValid) {
            isValid = false;
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
        }
    }

    const phoneInput = document.getElementById('userPhone');
    if (phoneInput && phoneInput.value) {
        const phoneValid = /^[0-9]{11}$/.test(phoneInput.value);
        if (!phoneValid) {
            isValid = false;
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
        }
    }

    // Update checkout button state
    if (checkoutBtn) {
        const isCartNotEmpty = window.cart && window.cart.length > 0;
        const isPaymentSelected = selectedPaymentMethod !== null;
        checkoutBtn.disabled = !(isCartNotEmpty && isValid && isPaymentSelected);
    }

    return isValid;
}

// Payment method selection
function selectPaymentMethod(method) {
    const methods = document.querySelectorAll('.payment-method');
    selectedPaymentMethod = method;
    
    methods.forEach(el => {
        if (el.dataset.method === method) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });

    // Update checkout button state
    if (checkoutBtn) {
        const isCartNotEmpty = window.cart && window.cart.length > 0;
        const isFormValid = validateFormSection();
        checkoutBtn.disabled = !(isCartNotEmpty && isFormValid && selectedPaymentMethod !== null);
    }
}

// Update cart display
function updateCartDisplay() {
    if (!cartItems) return;

    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'flex';
        if (totalItems > 0) {
            cartCount.classList.add('bounce');
            setTimeout(() => cartCount.classList.remove('bounce'), 300);
        }
    }
    
    if (window.cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        updateOrderProgress(1);
    } else {
        cartItems.innerHTML = window.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${item.name}</h5>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="btn-quantity decrease-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="btn-quantity increase-quantity">+</button>
                </div>
                <div class="cart-item-total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Update totals
    const subtotal = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;

    if (cartTotalAmount) cartTotalAmount.textContent = formatPrice(subtotal);
    if (subtotalAmount) subtotalAmount.textContent = formatPrice(subtotal);
    if (finalTotalAmount) finalTotalAmount.textContent = formatPrice(total);
    if (checkoutTotalAmount) checkoutTotalAmount.textContent = formatPrice(total);

    // Update checkout button state
    if (checkoutBtn) {
        const isFormValid = validateFormSection();
        const isPaymentSelected = selectedPaymentMethod !== null;
        checkoutBtn.disabled = !(window.cart.length > 0 && isFormValid && isPaymentSelected);
    }
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = window.cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    // Remove item if quantity becomes 0
    if (item.quantity <= 0) {
        window.cart = window.cart.filter(item => item.id !== productId);
        showNotification(`${item.name} removed from cart`, 'info');
    } else {
        showNotification(`Updated ${item.name} quantity to ${item.quantity}`, 'info');
    }

    // Update cart display
    window.updateCartDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    const item = window.cart.find(item => item.id === productId);
    if (!item) return;
    
    window.cart = window.cart.filter(item => item.id !== productId);
    showNotification(`${item.name} removed from cart`, 'info');
    window.updateCartDisplay();
}

// // Handle checkout process
async function handleCheckout() {
    if (!validateFormSection()) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    if (!selectedPaymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }

    // Collect form data
    const formData = {
        customer: {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            area: document.getElementById('deliveryArea').value,
            houseNumber: document.getElementById('houseNumber').value,
            address: document.getElementById('userAddress').value,
            notes: document.getElementById('orderNotes').value,
            deliveryTime: document.getElementById('deliveryTime').value
        },
        items: window.cart,
        paymentMethod: selectedPaymentMethod,
        total: window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee
    };

    try {
        // Create a hidden form for Formspree submission
        const form = document.createElement('form');
        form.style.display = 'none';
        form.method = 'POST';
        form.action = 'https://formspree.io/f/mvgayjrw';

        // Add form fields
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'email';
        emailInput.value = formData.customer.email;
        form.appendChild(emailInput);

        const messageInput = document.createElement('textarea');
        messageInput.name = 'message';
        messageInput.value = JSON.stringify(formData, null, 2);
        form.appendChild(messageInput);

        // Add form to document and submit
        document.body.appendChild(form);
        form.submit();

        // Show success message
        showNotification('Order placed successfully! Thank you for your order.', 'success');

        // Clear cart and form
        window.cart = [];
        userInfoForm.reset();
        updateCartDisplay();

        // Reset payment method selection
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        selectedPaymentMethod = null;
        
        // Reset progress
        updateOrderProgress(1);
        
    } catch (error) {
        showNotification('There was an error processing your order. Please try again.', 'error');
    }
}



// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize page
function initializePage() {
    // Form input listeners
    if (userInfoForm) {
        const inputs = userInfoForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                if (validateFormSection()) {
                    updateOrderProgress(2);
                }
            });

            // Add blur validation
            input.addEventListener('blur', () => {
                if (input.required && !input.value.trim()) {
                    input.classList.add('is-invalid');
                }
            });
        });
    }

    // Payment method listeners
    document.querySelectorAll('.payment-method').forEach(el => {
        el.addEventListener('click', () => {
            selectPaymentMethod(el.dataset.method);
        });
    });

    // Cart item controls
    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const productId = cartItem.dataset.productId;
            
            if (e.target.closest('.decrease-quantity')) {
                window.updateQuantity(productId, -1);
            } else if (e.target.closest('.increase-quantity')) {
                window.updateQuantity(productId, 1);
            } else if (e.target.closest('.remove-item')) {
                window.removeFromCart(productId);
            }
        });
    }

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Initial product load
    filterProducts('all');

    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.category);
        });
    });

    // Initialize deal timers when the page loads
    updateDealTimers();
}

// Make functions globally available
window.updateCartDisplay = updateCartDisplay;
window.handleCheckout = handleCheckout;
window.validateFormSection = validateFormSection;
window.selectPaymentMethod = selectPaymentMethod;
window.updateOrderProgress = updateOrderProgress;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializePage); 