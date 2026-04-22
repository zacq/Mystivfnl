document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-inject reveal classes to maintain generic HTML but support rich animations
    
    // Select Hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-headline, .hero-subtext, .hero-ctas > *');
    heroElements.forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 120}ms`;
    });

    // Select Section Headers
    document.querySelectorAll('.section-header > p, .section-header > h2').forEach((el) => {
        el.classList.add('reveal-up');
    });

    document.querySelectorAll('.section-header').forEach(header => {
        Array.from(header.children).forEach((child, idx) => {
            child.classList.add('reveal-up');
            child.style.transitionDelay = `${idx * 100}ms`;
        });
    });

    // Stats
    document.querySelectorAll('.stat-item').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 100}ms`;
    });

    // Trust Grid
    document.querySelectorAll('.trust-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${(index % 4) * 100}ms`;
    });

    // Services
    document.querySelectorAll('.service-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${(index % 3) * 100}ms`;
    });

    // Process
    document.querySelectorAll('.step-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 150}ms`;
    });

    // Estimator
    document.querySelectorAll('.estimator-panel').forEach(el => el.classList.add('reveal-scale'));

    // Forms & Contact
    document.querySelectorAll('.form-card, .contact-details').forEach(el => {
        el.classList.add('reveal-up');
    });

    // Testimonials
    document.querySelectorAll('.testimonial-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 150}ms`;
    });

    // Footer
    document.querySelectorAll('.footer-col').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 100}ms`;
    });

    // Contact Cards
    document.querySelectorAll('.contact-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 80}ms`;
    });

    // Gallery Items
    document.querySelectorAll('.gallery-item').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${(index % 3) * 100}ms`;
    });

    // 2. IntersectionObserver for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // 3. Mobile Menu Builder (dynamic DOM injection)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const originalNavLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && originalNavLinks) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';

        const panel = document.createElement('div');
        panel.className = 'mobile-nav-panel';

        const mobileLinks = originalNavLinks.cloneNode(true);
        mobileLinks.className = 'mobile-nav-links';
        // Remove the desktop contact popup wrapper — replace with plain contact link
        const clonedContactWrap = mobileLinks.querySelector('.nav-contact-wrap');
        if (clonedContactWrap) {
            const mobileContactLink = document.createElement('a');
            mobileContactLink.href = 'tel:+254711758633';
            mobileContactLink.textContent = 'Contact';
            clonedContactWrap.replaceWith(mobileContactLink);
        }
        // Remove any leftover IDs to prevent duplicates
        mobileLinks.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

        const mobileBookBtn = document.createElement('button');
        mobileBookBtn.type = 'button';
        mobileBookBtn.className = 'btn btn-primary';
        mobileBookBtn.dataset.bookingPopup = '';
        mobileBookBtn.textContent = 'Book Service';

        panel.appendChild(mobileLinks);
        panel.appendChild(mobileBookBtn);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        const openMenu = () => document.body.classList.add('menu-open');
        const closeMenu = () => document.body.classList.remove('menu-open');

        mobileMenuBtn.addEventListener('click', () => {
            document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });

        panel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }

    // 4. Process Connector Draw Animation
    const processSteps = document.querySelector('.process-steps');
    if (processSteps && 'IntersectionObserver' in window) {
        const connectorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.step-connector').forEach((connector, index) => {
                        setTimeout(() => connector.classList.add('active'), index * 280 + 350);
                    });
                    connectorObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        connectorObserver.observe(processSteps);
    }

    // 5. Footer Divider Reveal
    const footer = document.querySelector('.footer');
    if (footer && 'IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('active');
                    footerObserver.unobserve(footer);
                }
            });
        }, { threshold: 0.1 });

        footerObserver.observe(footer);
    }

    // 6. Stat Count Up Animation
    const statValues = document.querySelectorAll('.stat-value');
    let hasCounted = false;

    if ('IntersectionObserver' in window) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    statValues.forEach(stat => {
                        const targetText = stat.innerText;
                        const hasPlus = targetText.includes('+');
                        const hasPercent = targetText.includes('%');
                        const hasHr = targetText.includes('hr');
                        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
                        
                        if (isNaN(targetNumber)) return;
                        
                        let start = 0;
                        const duration = 2000;
                        const frames = (duration / 1000) * 60; // 60fps
                        const increment = targetNumber / frames;
                        
                        const updateCounter = () => {
                            start += increment;
                            if (start < targetNumber) {
                                stat.innerText = Math.floor(start) + 
                                               (hasPlus ? '+' : '') + 
                                               (hasPercent ? '%' : '') + 
                                               (hasHr ? 'hr' : '');
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.innerText = targetText; // Ensure final exact text
                            }
                        };
                        updateCounter();
                    });
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats-bar');
        if (statsSection) {
            statObserver.observe(statsSection);
        }
    }
});
