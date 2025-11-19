// MILS DEALS JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('MILS DEALS JavaScript loaded successfully!');
    
    // Initialize all functionality
    initFormValidation();
    initInteractiveElements();
    initSearchFunctionality();
    initBookingSystem();
    initCharacterCounters();
    
    // Initialize map
    initMap();
});

// Enhanced Form Validation
function initFormValidation() {
    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Initializing contact form validation...');
        
        // Real-time validation for email and phone
        const emailField = contactForm.querySelector('#email');
        const phoneField = contactForm.querySelector('#phone');
        const messageField = contactForm.querySelector('#message');
        
        if (emailField) {
            emailField.addEventListener('blur', function() {
                validateEmailField(this);
            });
        }
        
        if (phoneField) {
            phoneField.addEventListener('blur', function() {
                validatePhoneField(this);
            });
        }
        
        if (messageField) {
            messageField.addEventListener('input', function() {
                updateWordCount(this, 100);
            });
        }
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submission attempted');
            if (validateContactForm(this)) {
                submitContactForm(this);
            }
        });
    }
}

// Specific validation functions
function validateEmailField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    
    // Clear previous error
    field.classList.remove('error');
    if (errorElement) errorElement.style.display = 'none';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, '❌ This field is required');
        return false;
    }
    
    // Email validation
    if (field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showFieldError(field, '❌ Invalid email address. Please enter a valid email like: example@gmail.com');
            return false;
        }
    }
    
    return true;
}

function validatePhoneField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    
    // Clear previous error
    field.classList.remove('error');
    if (errorElement) errorElement.style.display = 'none';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, '❌ This field is required');
        return false;
    }
    
    // South African cell phone validation
    if (field.value) {
        // Remove all spaces and special characters for validation
        const cleanPhone = field.value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
        
        if (!phoneRegex.test(cleanPhone)) {
            showFieldError(field, '❌ Invalid South African cell number. Please enter a valid number like: 082 123 4567 or +27821234567');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Character counter functionality
function initCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[data-max-words]');
    textareas.forEach(textarea => {
        const maxWords = parseInt(textarea.getAttribute('data-max-words')) || 100;
        const counterId = textarea.id + 'Counter';
        
        // Create counter element if it doesn't exist
        if (!document.getElementById(counterId)) {
            const counter = document.createElement('div');
            counter.id = counterId;
            counter.className = 'character-counter';
            counter.style.fontSize = '0.8rem';
            counter.style.color = 'var(--dark)';
            counter.style.marginTop = '5px';
            counter.style.textAlign = 'right';
            textarea.parentNode.appendChild(counter);
        }
        
        textarea.addEventListener('input', function() {
            updateWordCount(this, maxWords);
        });
        
        // Initialize counter
        updateWordCount(textarea, maxWords);
    });
}

function updateWordCount(textarea, maxWords) {
    const text = textarea.value.trim();
    const words = text ? text.split(/\s+/).filter(word => word.length > 0) : [];
    const wordCount = words.length;
    const counterId = textarea.id + 'Counter';
    const counter = document.getElementById(counterId);
    
    if (counter) {
        counter.textContent = `${wordCount}/${maxWords} words`;
        
        if (wordCount > maxWords) {
            counter.style.color = 'var(--accent)';
            counter.innerHTML = `❌ ${wordCount}/${maxWords} words - <strong>Too many words! Maximum is ${maxWords} words.</strong>`;
        } else if (wordCount > maxWords * 0.8) {
            counter.style.color = 'var(--warning)';
        } else {
            counter.style.color = 'var(--success)';
        }
    }
}

// Form-specific validation
function validateContactForm(form) {
    let isValid = true;
    
    // Validate email
    const emailField = form.querySelector('#email');
    if (emailField && !validateEmailField(emailField)) {
        isValid = false;
    }
    
    // Validate phone
    const phoneField = form.querySelector('#phone');
    if (phoneField && !validatePhoneField(phoneField)) {
        isValid = false;
    }
    
    // Validate message word count
    const messageField = form.querySelector('#message');
    if (messageField) {
        const text = messageField.value.trim();
        const words = text ? text.split(/\s+/).filter(word => word.length > 0) : [];
        if (words.length > 100) {
            showFieldError(messageField, `❌ Maximum 100 words allowed. You have used ${words.length} words.`);
            isValid = false;
        }
    }
    
    // Validate other required fields
    const otherRequired = form.querySelectorAll('input[required]:not(#email):not(#phone), select[required]');
    otherRequired.forEach(field => {
        if (field.hasAttribute('required') && !field.value.trim()) {
            showFieldError(field, '❌ This field is required');
            isValid = false;
        }
    });
    
    return isValid;
}

// Form submission handlers
function submitContactForm(form) {
    const submitButton = form.querySelector('#submitButton') || form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('formMessage');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    console.log('Simulating contact form submission...');
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        if (formMessage) {
            formMessage.innerHTML = '<div class="success-message">✅ Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.</div>';
            formMessage.style.display = 'block';
        }
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        // Reset character counters
        initCharacterCounters();
        
        // Scroll to success message
        if (formMessage) {
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        console.log('Contact form submitted successfully!');
    }, 2000);
}

// Interactive Elements
function initInteractiveElements() {
    console.log('Initializing interactive elements...');
    
    // Tab functionality for sign-in page
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.textContent.toLowerCase().includes('sign') ? 'signin' : 'register';
                openTab(tabName, this);
            });
        });
    }
    
    // Enhanced deal card interactions
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
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

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('dealSearch');
    if (searchInput) {
        console.log('Initializing search functionality...');
        searchInput.addEventListener('input', debounce(searchDeals, 300));
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Map Functionality
function initMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        console.log('Initializing map...');
        
        // Using OpenStreetMap as a free alternative
        mapContainer.innerHTML = `
            <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=25.58,-33.98,25.62,-33.94&layer=mapnik&marker=-33.96,25.6" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0"
                style="border-radius: 15px;"
                title="MILS DEALS Location in Gqeberha">
            </iframe>
        `;
        
        // Add a link to full page map
        const mapLink = document.createElement('p');
        mapLink.innerHTML = '<a href="https://www.openstreetmap.org/?mlat=-33.96&amp;mlon=25.6#map=13/-33.96/25.6" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">View Larger Map</a>';
        mapLink.style.textAlign = 'center';
        mapLink.style.marginTop = '15px';
        mapContainer.parentNode.appendChild(mapLink);
    }
}

// Booking System (simplified for now)
function initBookingSystem() {
    console.log('Booking system initialized');
}

// Global functions for HTML onclick attributes
function openTab(tabName, element) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    element.classList.add('active');
}

// Search and filter functions
function searchDeals() {
    const searchTerm = document.getElementById('dealSearch').value.toLowerCase();
    const dealCards = document.querySelectorAll('.deal-card');
    let visibleCount = 0;

    dealCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.deal-description').textContent.toLowerCase();
        const location = card.querySelector('.location').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || location.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const resultsElement = document.getElementById('resultsCount');
    if (resultsElement) {
        resultsElement.textContent = `Showing ${visibleCount} deals`;
    }
}

function filterDeals() {
    const category = document.getElementById('categoryFilter').value;
    const dealCards = document.querySelectorAll('.deal-card');
    let visibleCount = 0;

    dealCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('resultsCount').textContent = `Showing ${visibleCount} deals`;
}

function sortDeals() {
    const sortBy = document.getElementById('sortFilter').value;
    const dealsContainer = document.querySelector('.deals-grid');
    const dealCards = Array.from(document.querySelectorAll('.deal-card'));

    dealCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            case 'price-high':
                return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
            case 'popular':
                return parseInt(b.getAttribute('data-popularity')) - parseInt(a.getAttribute('data-popularity'));
            default:
                return 0; // Featured - keep original order
        }
    });

    // Clear and re-append sorted cards
    dealsContainer.innerHTML = '';
    dealCards.forEach(card => dealsContainer.appendChild(card));
}

function resetFilters() {
    document.getElementById('dealSearch').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('sortFilter').value = 'featured';
    
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach(card => card.style.display = 'block');
    
    document.getElementById('resultsCount').textContent = `Showing ${dealCards.length} deals`;
    
    // Reset to original order
    sortDeals();
}

// Enable search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('dealSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDeals();
            }
        });
    }
});

console.log('MILS DEALS JavaScript file loaded');// 404 page specific JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            console.log('404 Page - MILS DEALS');
            
            // Add some interactive elements
            const errorCode = document.querySelector('.error-code');
            if (errorCode) {
                errorCode.addEventListener('mouseover', function() {
                    this.style.transform = 'scale(1.1)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                errorCode.addEventListener('mouseout', function() {
                    this.style.transform = 'scale(1)';
                });
            }
            
            // Log 404 errors for analytics (simulated)
            console.warn('404 Error: User encountered missing page - ' + window.location.href);
        });

