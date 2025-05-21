// Deals data structure
window.deals = [
    {
        id: 'double-burger-combo',
        name: 'Double Burger Combo',
        description: 'Two signature burgers with fries and drinks',
        price: 600,
        originalPrice: 800,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        category: 'burger',
        items: ['2 Burgers', 'Large Fries', '2 Drinks'],
        validUntil: '2024-12-31',
        discount: 25,
        timeLimit: {
            hours: 48,
            minutes: 0,
            seconds: 0
        }
    },
    {
        id: 'family-pizza-pack',
        name: 'Family Pizza Pack',
        description: 'Large pizza with 2 sides and 4 drinks',
        price: 1400,
        originalPrice: 2000,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        category: 'pizza',
        items: ['Large Pizza', '2 Side Dishes', '4 Drinks'],
        validUntil: '2024-12-31',
        discount: 30,
        timeLimit: {
            hours: 24,
            minutes: 0,
            seconds: 0
        }
    },
    {
        id: 'chicken-feast',
        name: 'Chicken Feast',
        description: 'Variety of chicken items perfect for sharing',
        price: 1080,
        originalPrice: 1500,
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isPopular: true,
        category: 'chicken',
        items: ['8pc Chicken', '4 Sides', '2L Drink'],
        validUntil: '2024-12-31',
        discount: 28,
        timeLimit: {
            hours: 72,
            minutes: 0,
            seconds: 0
        }
    }
];

// Create deal card HTML
function createDealCard(deal) {
    const timeLeft = calculateTimeLeft(deal.timeLimit);
    const savings = deal.originalPrice - deal.price;
    
    return `
        <div class="col-md-4 mb-4">
            <div class="deal-card ${deal.isPopular ? 'featured' : ''}" data-deal-id="${deal.id}">
                <div class="deal-image">
                    <img src="${deal.image}" alt="${deal.name}" loading="lazy">
                    ${deal.isPopular ? '<div class="deal-badge">Popular</div>' : ''}
                    <div class="deal-badge permanent">
                        <i class="fas fa-tag"></i> ${deal.discount}% OFF
                    </div>
                </div>
                <div class="deal-content">
                    <div class="deal-header">
                        <h3>${deal.name}</h3>
                        <p>${deal.description}</p>
                    </div>
                    <ul class="deal-items">
                        ${deal.items.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                    </ul>
                    <div class="deal-price">
                        <div class="price-info">
                            <span class="original-price">PKR ${deal.originalPrice.toLocaleString()}</span>
                            <span class="current-price">PKR ${deal.price.toLocaleString()}</span>
                        </div>
                        <small class="text-success">Save PKR ${savings.toLocaleString()}</small>
                    </div>
                    <div class="deal-timer" data-end-time="${deal.validUntil}">
                        <div class="timer-item">
                            <span class="timer-number hours">${timeLeft.hours}</span>
                            <span class="timer-label">Hours</span>
                        </div>
                        <div class="timer-item">
                            <span class="timer-number minutes">${timeLeft.minutes}</span>
                            <span class="timer-label">Minutes</span>
                        </div>
                        <div class="timer-item">
                            <span class="timer-number seconds">${timeLeft.seconds}</span>
                            <span class="timer-label">Seconds</span>
                        </div>
                    </div>
                    <button class="btn btn-add-to-cart" onclick="addDealToCart('${deal.id}')">
                        <span class="btn-text">Add to Cart</span>
                        <i class="fas fa-shopping-cart btn-icon"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Calculate time left for deal
function calculateTimeLeft(timeLimit) {
    return {
        hours: timeLimit.hours.toString().padStart(2, '0'),
        minutes: timeLimit.minutes.toString().padStart(2, '0'),
        seconds: timeLimit.seconds.toString().padStart(2, '0')
    };
}

// Initialize deals section
function initializeDeals() {
    const dealsContainer = document.getElementById('deals-container');
    if (!dealsContainer) return;

    // Add section animation
    dealsContainer.classList.add('fade-in');
    
    // Create and append deal cards
    const dealsHTML = window.deals.map(deal => createDealCard(deal)).join('');
    dealsContainer.innerHTML = dealsHTML;

    // Start timer updates
    window.deals.forEach(deal => {
        startDealTimer(deal.id, deal.timeLimit);
    });

    // Add scroll animation for deal cards
    const dealCards = document.querySelectorAll('.deal-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    dealCards.forEach(card => {
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
}

// Start timer for a deal
function startDealTimer(dealId, timeLimit) {
    const timer = setInterval(() => {
        if (timeLimit.seconds > 0) {
            timeLimit.seconds--;
        } else {
            if (timeLimit.minutes > 0) {
                timeLimit.minutes--;
                timeLimit.seconds = 59;
            } else {
                if (timeLimit.hours > 0) {
                    timeLimit.hours--;
                    timeLimit.minutes = 59;
                    timeLimit.seconds = 59;
                } else {
                    clearInterval(timer);
                    const dealCard = document.querySelector(`[data-deal-id="${dealId}"]`);
                    if (dealCard) {
                        dealCard.classList.add('expired');
                        showNotification(`The deal "${dealId}" has expired!`, 'warning');
                    }
                    return;
                }
            }
        }

        // Update timer display with animation
        const dealCard = document.querySelector(`[data-deal-id="${dealId}"]`);
        if (dealCard) {
            const hours = dealCard.querySelector('.timer-number.hours');
            const minutes = dealCard.querySelector('.timer-number.minutes');
            const seconds = dealCard.querySelector('.timer-number.seconds');
            
            if (hours && minutes && seconds) {
                updateTimerDigit(hours, timeLimit.hours);
                updateTimerDigit(minutes, timeLimit.minutes);
                updateTimerDigit(seconds, timeLimit.seconds);
            }

            // Add urgency animation when time is running low
            if (timeLimit.hours === 0 && timeLimit.minutes < 30) {
                dealCard.classList.add('urgent');
            }
        }
    }, 1000);
}

// Update timer digit with animation
function updateTimerDigit(element, value) {
    const currentValue = element.textContent;
    const newValue = value.toString().padStart(2, '0');
    
    if (currentValue !== newValue) {
        element.classList.add('flip');
        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('flip');
        }, 300);
    }
}

// Add deal to cart
function addDealToCart(dealId) {
    const deal = window.deals.find(d => d.id === dealId);
    if (!deal) {
        showNotification('Deal not found!', 'error');
        return;
    }

    try {
        // Initialize cart if it doesn't exist
        if (!window.cart) {
            window.cart = [];
        }

        // Add to cart
        const existingItem = window.cart.find(item => item.id === dealId);
        if (existingItem) {
            existingItem.quantity++;
            showNotification(`Added another ${deal.name} to cart!`, 'success');
        } else {
            window.cart.push({
                id: dealId,
                name: deal.name,
                price: deal.price,
                quantity: 1,
                image: deal.image,
                isDeal: true,
                originalPrice: deal.originalPrice,
                savings: deal.originalPrice - deal.price,
                items: deal.items
            });
            showNotification(`${deal.name} added to cart!`, 'success');
        }

        // Show success animation on button
        const button = document.querySelector(`[data-deal-id="${dealId}"] .btn-add-to-cart`);
        if (button) {
            button.classList.add('clicked');
            
            // Change icon to checkmark
            const icon = button.querySelector('.btn-icon');
            if (icon) {
                icon.classList.remove('fa-shopping-cart');
                icon.classList.add('fa-check');
            }
            
            setTimeout(() => {
                button.classList.remove('clicked');
                if (icon) {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-shopping-cart');
                }
            }, 1500);
        }

        // Update cart display
        if (typeof window.updateCartDisplay === 'function') {
            window.updateCartDisplay();
        }

        // Scroll to cart summary
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            cartSummary.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Error adding deal to cart:', error);
        showNotification('Error adding deal to cart', 'error');
    }
}

// Helper function for notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDeals); 