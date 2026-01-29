/**
 * FolkTech.AI - Main JavaScript
 * Handles interactive functionality for the website
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contactForm');

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    function initMobileNav() {
        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Update aria-expanded
            const isExpanded = navLinks.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ========================================
    // Header Scroll Effect
    // ========================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            // Add shadow when scrolled
            if (scrollY > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // ========================================
    // Smooth Scrolling for Anchor Links
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY;

                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Contact Form Handling
    // ========================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual endpoint)
                await simulateFormSubmission(data);

                // Show success message
                showNotification('Thank you! Your message has been sent.', 'success');
                contactForm.reset();

            } catch (error) {
                // Show error message
                showNotification('Sorry, there was an error. Please try again.', 'error');
                console.error('Form submission error:', error);

            } finally {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Simulate form submission (for demo purposes)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Log form data for demo
                console.log('Form submitted:', data);
                resolve();
            }, 1000);
        });
    }

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: '9999',
            animation: 'slideIn 0.3s ease'
        });

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
            `;
            document.head.appendChild(style);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => removeNotification(notification));

        // Auto-remove after 5 seconds
        setTimeout(() => removeNotification(notification), 5000);
    }

    function removeNotification(notification) {
        if (!notification) return;

        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.about-card, .service-card, .tech-feature');

        if (!animatedElements.length) return;

        // Add initial styles
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animations
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Initialize All Functions
    // ========================================
    function init() {
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initScrollAnimations();
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
