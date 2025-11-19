// MILS DEALS - Security Configuration
// security-config.js
// Last Updated: 2025-01-20

const SecurityConfig = {
    // Application Security Settings
    app: {
        name: "MILS DEALS",
        version: "1.0.0",
        environment: "production", // development, staging, production
        debug: false
    },

    // Content Security Policy (CSP) Configuration
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Remove in production if possible
            "https://trusted-cdn.com"
        ],
        styleSrc: [
            "'self'",
            "'unsafe-inline'", // Needed for inline styles
            "https://fonts.googleapis.com"
        ],
        fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://cdnjs.cloudflare.com"
        ],
        imgSrc: [
            "'self'",
            "data:",
            "https:",
            "blob:"
        ],
        connectSrc: [
            "'self'",
            "https://api.milsdeals.com",
            "wss://websocket.milsdeals.com"
        ],
        frameSrc: [
            "'self'",
            "https://www.google.com",
            "https://www.openstreetmap.org"
        ],
        objectSrc: ["'none'"], // No Flash/PDF objects
        mediaSrc: ["'self'"],
        frameAncestors: ["'self'"], // Prevent clickjacking
        formAction: ["'self'"],
        baseUri: ["'self'"]
    },

    // Security Headers Configuration
    headers: {
        hsts: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true
        },
        xFrameOptions: "SAMEORIGIN",
        xContentTypeOptions: "nosniff",
        xXSSProtection: "1; mode=block",
        referrerPolicy: "strict-origin-when-cross-origin",
        permissionsPolicy: {
            camera: "()",
            microphone: "()",
            location: "(self)",
            payment: "()"
        }
    },

    // Form Security & Validation
    forms: {
        maxLength: {
            name: 100,
            email: 254,
            phone: 20,
            message: 2000,
            password: 128
        },
        validation: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^(\+27|0)[6-8][0-9]{8}$/,
            name: /^[a-zA-ZÀ-ÿ\s'-]{2,100}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        },
        csrf: {
            enabled: true,
            tokenLength: 32,
            timeout: 3600000 // 1 hour
        }
    },

    // API Security
    api: {
        baseURL: "https://api.milsdeals.com",
        timeout: 10000, // 10 seconds
        retryAttempts: 3,
        endpoints: {
            contact: "/api/contact",
            enquiry: "/api/enquiry",
            booking: "/api/booking",
            payment: "/api/payment"
        },
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': null // To be set by backend
        }
    },

    // Payment Security
    payment: {
        providers: {
            stripe: {
                publicKey: "pk_live_...", // Replace with actual key
                apiVersion: "2023-10-16"
            },
            paypal: {
                clientId: "AY...", // Replace with actual ID
                currency: "ZAR"
            }
        },
        security: {
            pciCompliant: true,
            tokenization: true,
            fraudDetection: true
        }
    },

    // Authentication & Session Security
    auth: {
        session: {
            timeout: 3600000, // 1 hour
            renewBeforeExpiry: 300000, // 5 minutes
            secure: true,
            httpOnly: true,
            sameSite: "strict"
        },
        password: {
            minLength: 8,
            requireSpecialChar: true,
            requireNumbers: true,
            requireUpperCase: true,
            requireLowerCase: true
        }
    },

    // Input Sanitization
    sanitization: {
        html: {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
            allowedAttributes: {
                'a': ['href', 'title']
            }
        },
        stripTags: true,
        escapeHtml: true
    },

    // Rate Limiting Configuration
    rateLimiting: {
        enabled: true,
        windowMs: 900000, // 15 minutes
        maxRequests: 100, // Limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again later.",
        skipSuccessfulRequests: false
    },

    // Logging & Monitoring
    logging: {
        level: "warn", // error, warn, info, debug
        console: true,
        file: false,
        events: {
            security: true,
            errors: true,
            formSubmissions: true,
            paymentAttempts: true
        }
    },

    // Error Handling
    errors: {
        showDetailedErrors: false, // Set to true only in development
        genericMessage: "An error occurred. Please try again later.",
        contactEmail: "security@milsdeals.com"
    },

    // Third-Party Services Security
    thirdParty: {
        maps: {
            provider: "openstreetmap",
            apiKey: null, // No API key needed for OpenStreetMap
            domainWhitelist: ["milsdeals.com"]
        },
        analytics: {
            provider: "google-analytics", // Placeholder for future implementation
            trackingId: null
        },
        fonts: {
            provider: "google-fonts",
            preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]
        }
    },

    // Security Monitoring
    monitoring: {
        enabled: true,
        endpoints: {
            health: "/api/health",
            metrics: "/api/metrics",
            security: "/api/security-events"
        },
        alerts: {
            email: "alerts@milsdeals.com",
            webhook: null // Set up for Slack/Discord in future
        }
    }
};

// Security Utility Functions
const SecurityUtils = {
    // Generate CSRF Token
    generateCSRFToken: function() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    // Validate Email
    validateEmail: function(email) {
        return SecurityConfig.forms.validation.email.test(email);
    },

    // Validate South African Phone Number
    validatePhone: function(phone) {
        const cleanPhone = phone.replace(/[\s\-()]/g, '');
        return SecurityConfig.forms.validation.phone.test(cleanPhone);
    },

    // Sanitize HTML Input
    sanitizeHTML: function(input) {
        if (!SecurityConfig.sanitization.stripTags) return input;
        
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    },

    // Escape HTML for output
    escapeHTML: function(html) {
        if (!SecurityConfig.sanitization.escapeHtml) return html;
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;'
        };
        return html.replace(/[&<>"'/]/g, (m) => map[m]);
    },

    // Password Strength Checker
    checkPasswordStrength: function(password) {
        const requirements = SecurityConfig.auth.password;
        let strength = 0;
        let feedback = [];

        if (password.length >= requirements.minLength) strength++;
        else feedback.push(`Password must be at least ${requirements.minLength} characters long`);

        if (requirements.requireLowerCase && /[a-z]/.test(password)) strength++;
        else if (requirements.requireLowerCase) feedback.push("Include lowercase letters");

        if (requirements.requireUpperCase && /[A-Z]/.test(password)) strength++;
        else if (requirements.requireUpperCase) feedback.push("Include uppercase letters");

        if (requirements.requireNumbers && /\d/.test(password)) strength++;
        else if (requirements.requireNumbers) feedback.push("Include numbers");

        if (requirements.requireSpecialChar && /[@$!%*?&]/.test(password)) strength++;
        else if (requirements.requireSpecialChar) feedback.push("Include special characters (@$!%*?&)");

        return {
            strength: (strength / 5) * 100,
            isValid: strength === 5,
            feedback: feedback
        };
    },

    // Log Security Events
    logSecurityEvent: function(event, details) {
        if (SecurityConfig.logging.events.security) {
            console.warn(`[SECURITY] ${event}:`, {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                ...details
            });
        }
    },

    // Validate File Upload
    validateFileUpload: function(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) {
        if (!file) return { isValid: false, error: "No file provided" };
        
        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: "File type not allowed" };
        }
        
        if (file.size > maxSize) {
            return { isValid: false, error: "File too large" };
        }
        
        return { isValid: true, error: null };
    }
};

// Initialize Security Features
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 MILS DEALS Security Configuration Loaded');
    
    // Add CSRF tokens to forms
    if (SecurityConfig.forms.csrf.enabled) {
        const forms = document.querySelectorAll('form[method="post"]');
        forms.forEach(form => {
            const csrfToken = SecurityUtils.generateCSRFToken();
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'csrf_token';
            input.value = csrfToken;
            form.appendChild(input);
            
            // Store token in session storage for validation
            sessionStorage.setItem('csrf_token', csrfToken);
        });
    }

    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateFormSecurity(this)) {
                e.preventDefault();
                SecurityUtils.logSecurityEvent('Form validation failed', {
                    formId: this.id || 'unknown',
                    action: this.action
                });
            }
        });
    });

    // Log page views for security monitoring
    SecurityUtils.logSecurityEvent('Page view', {
        page: document.title,
        referrer: document.referrer
    });
});

// Form Security Validation
function validateFormSecurity(form) {
    const emailInputs = form.querySelectorAll('input[type="email"]');
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    
    // Validate emails
    for (let input of emailInputs) {
        if (input.value && !SecurityUtils.validateEmail(input.value)) {
            showSecurityError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Validate phone numbers
    for (let input of phoneInputs) {
        if (input.value && !SecurityUtils.validatePhone(input.value)) {
            showSecurityError(input, 'Please enter a valid South African phone number');
            return false;
        }
    }
    
    return true;
}

// Display security errors
function showSecurityError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message security-error';
    errorDiv.textContent = '🔒 ' + message;
    errorDiv.style.color = SecurityConfig.app.environment === 'production' ? '#e74c3c' : '#f39c12';
    input.parentNode.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
        input.classList.remove('error');
    }, 5000);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityConfig, SecurityUtils };
}

console.log('🔒 MILS DEALS Security System Initialized - Environment:', SecurityConfig.app.environment);