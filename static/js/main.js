// Particle animation
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
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

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };

        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

// Skill bar animations
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Fade in animations
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Show modal popup for form feedback
function showFormModal(message, isSuccess = true) {
    const modal = document.getElementById('form-modal');
    const msgDiv = document.getElementById('form-modal-message');
    msgDiv.innerHTML = message;
    msgDiv.className = isSuccess ? 'form-modal-success' : 'form-modal-error';
    modal.style.display = 'flex';
}

function closeFormModal() {
    const modal = document.getElementById('form-modal');
    modal.style.display = 'none';
}

// Typing effect for hero subtitle
function typeEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = 'AI Engineer & Machine Learning Expert';
    let i = 0;
    subtitle.textContent = '';
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    setTimeout(typeWriter, 1000);
}

// Parallax effect for hero background
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Dynamic background color based on scroll
function setupDynamicBackground() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = scrolled / maxScroll;
        const hue = 220 + (scrollPercentage * 60); // From blue to purple
        document.documentElement.style.setProperty('--primary', `hsl(${hue}, 70%, 60%)`);
    });
}

// Mouse cursor effect
function setupCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: all 0.1s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    // Grow cursor on hover over interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-category').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'var(--accent)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    setupSmoothScrolling();
    animateCounters();
    animateSkillBars();
    setupScrollAnimations();
    // Modal close button
    const modalClose = document.getElementById('form-modal-close');
    if (modalClose) {
        modalClose.onclick = closeFormModal;
    }
    // Close modal on background click
    const modal = document.getElementById('form-modal');
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) closeFormModal();
        };
    }

    // Contact form AJAX submission
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    showFormModal(res.message, true);
                    form.reset();
                } else {
                    showFormModal(res.error || 'Failed to send message.', false);
                }
            })
            .catch(() => {
                showFormModal('Failed to send message. Please try again later.', false);
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
    }
    typeEffect();
    setupParallax();
    setupDynamicBackground();
    setupCursorEffect();
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Responsive navigation for mobile
function createMobileMenu() {
    const nav = document.querySelector('.nav');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.cssText = `
        display: none;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 12px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    // Add mobile styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav {
                flex-direction: column;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                padding: 20px;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            .nav.active {
                transform: translateY(0);
            }
            .menu-toggle {
                display: block !important;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
            }
            .nav-btn {
                width: 100%;
                text-align: center;
                margin-bottom: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    document.body.insertBefore(menuToggle, nav);
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
}
// Initialize mobile menu
if (window.innerWidth <= 768) {
    createMobileMenu();
}
// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
        createMobileMenu();
    }
});
