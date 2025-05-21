// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart first to ensure it's available for other functions
    initializeCart();
    
    // Then initialize other features
    initializeSmoothScroll();
    initializeNavbar();
    initializeMenuFiltering();
    initializeAnimations();
    initializeContactForm();
    initializeGallery();
    initializeMobileMenu();
    initializeHeroSection();

    // Navbar Toggle for Mobile
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
            navbarToggler.setAttribute('aria-expanded', 
                navbarCollapse.classList.contains('show'));
        });

        // Close navbar when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navbarToggler.contains(event.target) || 
                                navbarCollapse.contains(event.target);
            
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });

        // Close navbar when clicking on a nav link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});

// Smooth scrolling for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar background change on scroll
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Menu category filtering with animation
function initializeMenuFiltering() {
    const menuCategories = document.querySelectorAll('.menu-categories .btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!menuCategories.length || !menuItems.length) return;

    menuCategories.forEach(category => {
        category.addEventListener('click', function() {
            menuCategories.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter') || 'all';
            
            menuItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}


function showCartNotification(itemName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${itemName} added to cart!</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    if (!counter) return;
    
    counter.textContent = cartCount;
    counter.classList.add('bump');
    setTimeout(() => counter.classList.remove('bump'), 300);
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Form validation and submission
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = this.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        });
        
        if (isValid) {
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Message sent successfully!';
            this.appendChild(successMessage);
            
            this.reset();
            setTimeout(() => successMessage.remove(), 3000);
        }
    });
}

// Image gallery lightbox
function initializeGallery() {
    const galleryImages = document.querySelectorAll('.gallery img');
    if (!galleryImages.length) return;

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => showLightbox(img.src));
    });
}

function showLightbox(src) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${src}" alt="Gallery Image">
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    const closeLightbox = () => {
        lightbox.remove();
        document.body.style.overflow = '';
    };
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;

    navbarToggler.addEventListener('click', function(e) {
        e.stopPropagation(); // prevent bubbling
        const isOpen = navbarCollapse.classList.contains('show');
        this.classList.toggle('active');
        navbarCollapse.classList.toggle('show');

        if (!isOpen) {
            document.addEventListener('click', closeOnClickOutside);
        }
    });

    function closeOnClickOutside(e) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
            navbarToggler.classList.remove('active');
            document.removeEventListener('click', closeOnClickOutside);
        }
    }
}


// Hero Section with Parallax
function initializeHeroSection() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroOverlay = document.querySelector('.hero-overlay');
    const video = document.querySelector('.hero-video-bg video');

    if (!hero) return;

    // Parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${rate * 0.3}px)`;
        }
        
        if (heroOverlay) {
            heroOverlay.style.transform = `translateY(${rate * 0.2}px)`;
        }
    });

    // Video handling
    if (video) {
        video.addEventListener('loadeddata', function() {
            video.classList.add('loaded');
        });

        video.addEventListener('error', function() {
            video.style.display = 'none';
            hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`;
        });
    }
}

// Initialize cart functionality
function initializeCart() {
    // Ensure cart is initialized
    window.cart = window.cart || [];
    
    // Initialize cart display
    if (typeof window.updateCartDisplay === 'function') {
        window.updateCartDisplay();
    }
} 