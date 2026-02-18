// ==========================================
// LOGIKA DIGITAL — INTERACTIVE FUNCTIONALITY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initToastContainer();
    initHamburgerMenu();
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    initCTATracking();
    initContactForm();
});

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

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

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
// HAMBURGER MENU
// ==========================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('header-nav');

    if (!hamburger || !nav) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        const isOpen = document.body.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', isOpen);
    }

    function closeMenu() {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu on nav link click
    nav.querySelectorAll('.nav-link, .btn').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ==========================================
// SMOOTH SCROLL — Custom easing animation
// ==========================================
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY, duration = 900) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (elapsed < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;

                smoothScrollTo(targetPosition, 900);
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// CTA TRACKING
// ==========================================
function initCTATracking() {
    const ctaButtons = {
        'hero-cta': 'Hero - Solicitar Auditoría'
    };

    Object.keys(ctaButtons).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                console.log(`CTA Clicked: ${ctaButtons[id]}`);
            });
        }
    });
}

// ==========================================
// CONTACT FORM HANDLER WITH EMAILJS
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // EmailJS Configuration — DO NOT CHANGE
    const EMAILJS_CONFIG = {
        serviceID: 'service_7txdn9a',
        templateID: 'template_iabzf0t',
        publicKey: '3HUKg3BA7HDShi91l'
    };

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const consultaInput = document.getElementById('consulta');
        const privacyCheckbox = document.getElementById('privacy');
        const submitButton = contactForm.querySelector('button[type="submit"]');

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

        // Disable submit & show loading
        submitButton.disabled = true;
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<span style="opacity: 0.7;">Enviando...</span>';

        try {
            const templateParams = {
                from_name: formData.nombre,
                from_email: formData.email,
                phone: formData.telefono,
                message: formData.consulta
            };

            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParams
            );

            console.log('Email sent successfully!', response.status, response.text);

            showToast(
                `Tu consulta ha sido enviada correctamente. Te contactaremos pronto al correo ${formData.email}.`,
                `¡Gracias ${formData.nombre}!`,
                'success',
                6000
            );

            contactForm.reset();

        } catch (error) {
            console.error('Error sending email:', error);

            showToast(
                'Hubo un error al enviar tu consulta. Por favor, intenta nuevamente o contáctanos a admin@logikateam.com',
                'Error al enviar',
                'error',
                7000
            );
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}
