document.addEventListener('DOMContentLoaded', () => {

    // ─── 0. Reveal Observer (.reveal class — hero & info-cards) ─────────────
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('active'));
    }

    // ─── 1. Navbar Scroll ────────────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar && (window.scrollY > 50
            ? navbar.classList.add('scrolled')
            : navbar.classList.remove('scrolled'));
    });

    // ─── 2. Smooth Scrolling ─────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#') return;
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                const offset = 80;
                window.scrollTo({
                    top: el.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── 3. Pricing Data ─────────────────────────────────────────────────────
    const VEHICLE_MULTIPLIERS = {
        sedan: 1.0, hatchback: 1.0, coupe: 1.0, compact: 0.9,
        convertible: 1.1, wagon: 1.1, crossover: 1.2,
        suv: 1.3, minivan: 1.3, pickup: 1.4, ev: 1.4,
        sports: 1.5, van: 1.5, truck: 1.6, luxury: 1.8
    };

    const SERVICE_ADDONS = {
        garage: [
            { id: 'minor',       label: 'Minor Service',              price: 5000  },
            { id: 'major',       label: 'Major Service',              price: 15000 },
            { id: 'diag',        label: 'Computer Diagnostics',       price: 3000  },
            { id: 'engine',      label: 'Engine Repair',              price: 25000 },
            { id: 'brakes',      label: 'Brake Service',              price: 8000  },
            { id: 'suspension',  label: 'Suspension Repair',          price: 12000 },
            { id: 'steering',    label: 'Steering Repair',            price: 10000 },
            { id: 'alignment',   label: 'Wheel Alignment',            price: 2000  },
            { id: 'tires',       label: 'Tire Service',               price: 1500  },
            { id: 'battery',     label: 'Battery Check / Replace',    price: 3500  },
            { id: 'ac',          label: 'AC Service / Repair',        price: 6000  },
            { id: 'cooling',     label: 'Cooling System Repair',      price: 8000  },
            { id: 'trans',       label: 'Transmission Service',       price: 20000 },
            { id: 'elec',        label: 'Electrical Repair',          price: 7000  },
            { id: 'prepurchase', label: 'Pre-Purchase Inspection',    price: 5000  },
            { id: 'fleet',       label: 'Fleet Maintenance',          price: 10000 }
        ],
        bodyworks: [
            { id: 'panel',      label: 'Panel Beating',                   price: 15000 },
            { id: 'accident',   label: 'Accident Repair',                 price: 30000 },
            { id: 'dent',       label: 'Dent Removal',                    price: 5000  },
            { id: 'spray',      label: 'Spray Painting',                  price: 12000 },
            { id: 'repaint',    label: 'Full Body Repaint',               price: 45000 },
            { id: 'bumper',     label: 'Bumper Repair',                   price: 6000  },
            { id: 'chassis',    label: 'Chassis Straightening',           price: 25000 },
            { id: 'weld',       label: 'Welding / Fabrication',           price: 10000 },
            { id: 'rust',       label: 'Rust Treatment',                  price: 8000  },
            { id: 'glass',      label: 'Glass Replacement',               price: 7000  },
            { id: 'heavybody',  label: 'Heavy Commercial Body Repair',    price: 50000 },
            { id: 'cabin',      label: 'Commercial Cabin Repair',         price: 20000 },
            { id: 'branding',   label: 'Branding Surface Preparation',    price: 8000  }
        ],
        fabrication: [
            { id: 'metalfab',   label: 'Metal Fabrication',           price: 15000 },
            { id: 'structweld', label: 'Structural Welding',          price: 12000 },
            { id: 'bullbar',    label: 'Bull Bar Fabrication',        price: 25000 },
            { id: 'chassisrein',label: 'Chassis Reinforcement',       price: 20000 },
            { id: 'trailer',    label: 'Trailer / Truck Body Repair', price: 35000 },
            { id: 'customheavy',label: 'Custom Heavy Vehicle Works',  price: 40000 }
        ],
        carwash: [
            { id: 'extwash',    label: 'Exterior Wash',               price: 500   },
            { id: 'intclean',   label: 'Interior Cleaning',           price: 800   },
            { id: 'fullwash',   label: 'Full Car Wash',               price: 1200  },
            { id: 'engwash',    label: 'Engine Wash',                 price: 2000  },
            { id: 'under',      label: 'Undercarriage Wash',          price: 1000  },
            { id: 'rim',        label: 'Tire / Rim Cleaning',         price: 500   },
            { id: 'detail',     label: 'Detailing',                   price: 5000  },
            { id: 'intdetail',  label: 'Interior Detailing',          price: 4000  },
            { id: 'extdetail',  label: 'Exterior Detailing',          price: 4500  },
            { id: 'paintcorr',  label: 'Paint Correction',            price: 15000 },
            { id: 'wax',        label: 'Wax / Sealant Application',   price: 3000  },
            { id: 'ceramic',    label: 'Ceramic Coating',             price: 25000 },
            { id: 'headlight',  label: 'Headlight Restoration',       price: 2500  },
            { id: 'upholstery', label: 'Seat / Upholstery Cleaning',  price: 3500  },
            { id: 'odor',       label: 'Odor Removal',                price: 2000  }
        ],
        recovery: [
            { id: 'breakdown',  label: 'Breakdown Recovery',          price: 5000  },
            { id: 'accrecov',   label: 'Accident Recovery',           price: 8000  },
            { id: 'towing',     label: 'Vehicle Towing',              price: 4000  },
            { id: 'wshpdel',    label: 'Workshop Delivery Recovery',  price: 3500  },
            { id: 'heavyrecov', label: 'Heavy Vehicle Recovery',      price: 15000 },
            { id: 'emergency',  label: 'Emergency Response Support',  price: 7000  }
        ],
        bar: [
            { id: 'softdrink',  label: 'Soft Drinks',                 price: 150   },
            { id: 'tea',        label: 'Tea / Coffee',                price: 100   },
            { id: 'snacks',     label: 'Snacks',                      price: 200   },
            { id: 'meals',      label: 'Meals / Food Service',        price: 500   },
            { id: 'lounge',     label: 'Lounge / Waiting Area',       price: 0     },
            { id: 'events',     label: 'Event / Group Hosting',       price: 5000  }
        ]
    };

    // ─── 4. Estimator ────────────────────────────────────────────────────────
    const calcBtn      = document.getElementById('calc-btn');
    const resultPanel  = document.getElementById('est-result');
    const resultValue  = document.querySelector('.result-value');
    const addonsWrap   = document.getElementById('est-addons-wrap');
    const serviceRadios = document.querySelectorAll('input[name="service"]');

    function buildAddons(serviceKey) {
        if (!addonsWrap) return;
        const items = SERVICE_ADDONS[serviceKey] || [];
        addonsWrap.innerHTML = items.map(item => `
            <label class="est-check">
                <input type="checkbox" name="addon" value="${item.id}" data-price="${item.price}">
                <span class="check-box"></span>
                ${item.label}<span class="addon-price"> — KES ${item.price.toLocaleString()}</span>
            </label>`).join('');
    }

    // Init add-ons for default selected service
    const defaultService = document.querySelector('input[name="service"]:checked');
    if (defaultService) buildAddons(defaultService.value);

    serviceRadios.forEach(radio => {
        radio.addEventListener('change', () => buildAddons(radio.value));
    });

    if (calcBtn && resultPanel && resultValue) {
        calcBtn.addEventListener('click', () => {
            const vehicleSelect = document.getElementById('est-vehicle');
            const serviceInput  = document.querySelector('input[name="service"]:checked');

            if (!vehicleSelect || !serviceInput) {
                alert('Please select a vehicle type and service.');
                return;
            }

            const multiplier = VEHICLE_MULTIPLIERS[vehicleSelect.value] || 1.0;
            let total = 0;
            document.querySelectorAll('input[name="addon"]:checked').forEach(cb => {
                total += parseFloat(cb.dataset.price) || 0;
            });
            total = Math.round(total * multiplier);

            resultPanel.style.display = 'block';
            resultPanel.classList.remove('animate-in');
            void resultPanel.offsetWidth;
            resultPanel.classList.add('animate-in');

            const start = performance.now();
            const dur   = 800;
            const tick  = (now) => {
                const p = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                resultValue.textContent = `KES ${Math.floor(total * ease).toLocaleString()}`;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }

    // ─── 5. Hero Carousel ────────────────────────────────────────────────────
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots   = document.querySelectorAll('.c-dot');
    if (carouselSlides.length > 1) {
        let current = 0;
        let timer;

        const goTo = (n) => {
            carouselSlides[current].classList.remove('active');
            carouselDots[current] && carouselDots[current].classList.remove('active');
            current = (n + carouselSlides.length) % carouselSlides.length;
            carouselSlides[current].classList.add('active');
            carouselDots[current] && carouselDots[current].classList.add('active');
        };

        const startTimer = () => { timer = setInterval(() => goTo(current + 1), 5000); };
        const stopTimer  = () => clearInterval(timer);

        startTimer();

        carouselDots.forEach((dot, i) => {
            dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
        });

        const carouselEl = document.querySelector('.hero-carousel');
        if (carouselEl) {
            carouselEl.addEventListener('mouseenter', stopTimer);
            carouselEl.addEventListener('mouseleave', startTimer);
        }
    }

    // ─── 6. Book Now Prefill ─────────────────────────────────────────────────
    document.querySelectorAll('[data-service]').forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceField = document.getElementById('bookService');
            if (serviceField) {
                serviceField.value = btn.dataset.service;
            }
        });
    });

    // ─── 6. Booking Form ─────────────────────────────────────────────────────
    const bookingForm = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Processing...';
            btn.disabled = true;

            const data = {
                name:    (document.getElementById('bookName')    || {}).value || '',
                phone:   (document.getElementById('bookPhone')   || {}).value || '',
                email:   (document.getElementById('bookEmail')   || {}).value || '',
                vehicle: (document.getElementById('bookVehicle') || {}).value || '',
                service: (document.getElementById('bookService') || {}).value || '',
                date:    (document.getElementById('bookDate')    || {}).value || '',
                notes:   (document.getElementById('bookNotes')   || {}).value || ''
            };

            // ── Booking submission via Netlify Function ───────────────────────
            // The Airtable token lives in Netlify env vars (AIRTABLE_TOKEN).
            // Set it at: Netlify Dashboard → Site → Environment variables
            try {
                await fetch('/.netlify/functions/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'Full Name':          data.name,
                        'Phone Number':       data.phone,
                        'Email Address':      data.email,
                        'Vehicle':            data.vehicle,
                        'Service Requested':  data.service,
                        'Preferred Date':     data.date,
                        'Additional Notes':   data.notes
                    })
                });
            } catch (err) {
                console.warn('Booking submission failed:', err);
            }

            setTimeout(() => {
                btn.textContent = orig;
                btn.disabled = false;
                bookingForm.reset();
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
                }
            }, 1200);
        });
    }

    // ─── 7. Chat ──────────────────────────────────────────────────────────────
    const chatToggle   = document.getElementById('chatToggle');
    const chatInterface = document.getElementById('chatInterface');
    const closeChat    = document.getElementById('closeChat');
    const chatInput    = document.getElementById('chatInput');
    const sendMessage  = document.getElementById('sendMessage');
    const chatBody     = document.getElementById('chatBody');

    if (chatToggle && chatInterface) {
        chatToggle.addEventListener('click', (e) => {
            e.preventDefault();
            chatInterface.classList.toggle('active');
            if (chatInterface.classList.contains('active')) chatInput.focus();
        });
        closeChat.addEventListener('click', () => chatInterface.classList.remove('active'));

        const addMsg = (msg, sender) => {
            if (!msg.trim()) return;
            const d = document.createElement('div');
            d.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
            d.innerHTML = `<p style="margin:0">${msg}</p>`;
            chatBody.appendChild(d);
            chatBody.scrollTop = chatBody.scrollHeight;
            if (sender === 'user') {
                setTimeout(() => addMsg("Thanks for reaching out! One of our service advisors will be with you shortly.", 'bot'), 1000);
            }
        };

        sendMessage.addEventListener('click', () => { addMsg(chatInput.value, 'user'); chatInput.value = ''; });
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { addMsg(chatInput.value, 'user'); chatInput.value = ''; }
        });
    }
});
