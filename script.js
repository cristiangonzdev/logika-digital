// ==========================================
// LOGIKA DIGITAL - INTERACTIVE FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize toast container
    initToastContainer();

    // Smooth scroll for anchor links
    initSmoothScroll();

    // Intersection Observer for scroll animations
    initScrollAnimations();

    // CTA button tracking
    initCTATracking();

    // Parallax effect on hero
    initParallaxEffect();

    // Contact form handling
    initContactForm();

    // Hamburger menu
    initHamburgerMenu();

});

// ==========================================
// HAMBURGER MENU
// ==========================================
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const headerNav = document.getElementById('headerNav');

    if (!hamburgerBtn || !headerNav) return;

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        headerNav.classList.toggle('open');
        document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            headerNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
function initToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
}

function showToast(message, title = '', type = 'success', duration = 5000) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon SVG based on type
    let iconSVG = '';
    if (type === 'success') {
        iconSVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (type === 'error') {
        iconSVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-linecap="round"/></svg>';
    } else if (type === 'info') {
        iconSVG = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-linecap="round"/></svg>';
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSVG}</div>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-linecap="round"/>
            </svg>
        </button>
    `;

    container.appendChild(toast);

    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto remove after duration
    setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    toast.classList.add('hiding');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#' || href === '#estrategia') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Optional: Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Service cards scroll-triggered animation (great for mobile)
    const serviceCardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-pop');
                // Remove the class after animation so it can re-trigger
                setTimeout(() => {
                    entry.target.classList.remove('scroll-pop');
                }, 600);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    document.querySelectorAll('.service-card').forEach(card => {
        serviceCardObserver.observe(card);
    });

    // Also animate process steps
    document.querySelectorAll('.process-step').forEach(step => {
        serviceCardObserver.observe(step);
    });
}

// ==========================================
// CTA TRACKING
// ==========================================
function initCTATracking() {
    const ctaButtons = {
        'hero-cta': 'Hero - Solicitar Auditoría',
        'final-cta': 'Final CTA - Agendar Reunión'
    };

    Object.keys(ctaButtons).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', (e) => {
                // Log CTA click for analytics
                console.log(`CTA Clicked: ${ctaButtons[id]}`);

                // Here you would integrate with your analytics platform
                // Example: gtag('event', 'cta_click', { cta_name: ctaButtons[id] });

                // Smooth scroll to contact form
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });
}

// ==========================================
// PARALLAX EFFECT
// ==========================================
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');

    if (!heroBackground) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;

                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;

                ticking = false;
            });

            ticking = true;
        }
    });
}

// ==========================================
// SERVICE CARD INTERACTIONS
// ==========================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ==========================================
// LEAD MAGNET INTERACTION
// ==========================================
const leadMagnetCard = document.querySelector('.lead-magnet-card');

if (leadMagnetCard) {
    leadMagnetCard.addEventListener('click', () => {
        console.log('Lead Magnet clicked - User interested in free audit');
        // Here you would trigger a modal or redirect to audit form
    });
}

// ==========================================
// SCROLL PROGRESS INDICATOR (Optional Enhancement)
// ==========================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, #00D9FF 0%, #00FF88 100%);
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Uncomment to enable scroll progress bar
// initScrollProgress();

// ==========================================
// CONTACT FORM HANDLER WITH EMAILJS
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // EmailJS Configuration
    const EMAILJS_CONFIG = {
        serviceID: 'service_7txdn9a',
        templateID: 'template_iabzf0t',
        publicKey: '3HUKg3BA7HDShi91l'
    };

    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.publicKey);

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form elements
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const consultaInput = document.getElementById('consulta');
        const privacyCheckbox = document.getElementById('privacy');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        // Get form data
        const formData = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            consulta: consultaInput.value,
            privacyAccepted: privacyCheckbox.checked
        };

        // Validate privacy acceptance
        if (!formData.privacyAccepted) {
            showToast(
                'Debes aceptar la Política de Privacidad para continuar.',
                'Política requerida',
                'error',
                4000
            );
            return;
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span style="opacity: 0.7;">Enviando...</span>';

        try {
            // Prepare template params for EmailJS
            const templateParams = {
                from_name: formData.nombre,
                from_email: formData.email,
                phone: formData.telefono,
                message: formData.consulta
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParams
            );

            console.log('Email sent successfully!', response.status, response.text);

            // Show success message
            showToast(
                `Tu consulta ha sido enviada correctamente. Te contactaremos pronto al correo ${formData.email}.`,
                `¡Gracias ${formData.nombre}!`,
                'success',
                6000
            );

            // Reset form
            contactForm.reset();

        } catch (error) {
            console.error('Error sending email:', error);

            // Show error message
            showToast(
                'Hubo un error al enviar tu consulta. Por favor, intenta nuevamente o contáctanos a contacto@logikadigital.com',
                'Error al enviar',
                'error',
                7000
            );
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}
