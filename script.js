document.addEventListener('DOMContentLoaded', () => {

    const BOOKING_ENDPOINT = 'https://primary-production-bfd8.up.railway.app/webhook/mystiv-booking';

    // ─── 0. Reveal Observer (.reveal) ────────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObs.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('active'));
    }

    // ─── 1. Navbar Scroll ─────────────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar && (window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled'));
    });

    // ─── 2. Smooth Scrolling (only for plain anchor hrefs) ───────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target === '#' || target === '#booking' || target === '#contact') {
                if (target === '#booking' || target === '#contact') return;
                e.preventDefault(); return;
            }
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                // For the estimator, center it vertically in the viewport
                if (target === '#estimator') {
                    const elTop = el.getBoundingClientRect().top + window.pageYOffset;
                    const offset = Math.max(0, elTop - (window.innerHeight / 2 - el.offsetHeight / 2));
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
                }
            }
        });
    });

    // ─── 3. Pricing Data ──────────────────────────────────────────────────────

    const SERVICE_ADDONS = {
        garage: [
            { id: 'minor',       label: 'Minor Service',           price: 5000  },
            { id: 'major',       label: 'Major Service',           price: 15000 },
            { id: 'diag',        label: 'Computer Diagnostics',    price: 3000  },
            { id: 'engine',      label: 'Engine Repair',           price: 25000 },
            { id: 'brakes',      label: 'Brake Service',           price: 8000  },
            { id: 'suspension',  label: 'Suspension Repair',       price: 12000 },
            { id: 'steering',    label: 'Steering Repair',         price: 10000 },
            { id: 'alignment',   label: 'Wheel Alignment',         price: 2000  },
            { id: 'tires',       label: 'Tire Service',            price: 1500  },
            { id: 'battery',     label: 'Battery Check / Replace', price: 3500  },
            { id: 'ac',          label: 'AC Service / Repair',     price: 6000  },
            { id: 'cooling',     label: 'Cooling System Repair',   price: 8000  },
            { id: 'trans',       label: 'Transmission Service',    price: 20000 },
            { id: 'elec',        label: 'Electrical Repair',       price: 7000  },
            { id: 'prepurchase', label: 'Pre-Purchase Inspection', price: 5000  },
            { id: 'fleet',       label: 'Fleet Maintenance',       price: 10000 }
        ],
        bodyworks: [
            { id: 'panel',      label: 'Panel Beating',                price: 15000 },
            { id: 'accident',   label: 'Accident Repair',              price: 30000 },
            { id: 'dent',       label: 'Dent Removal',                 price: 5000  },
            { id: 'spray',      label: 'Spray Painting',               price: 12000 },
            { id: 'repaint',    label: 'Full Body Repaint',            price: 45000 },
            { id: 'bumper',     label: 'Bumper Repair',                price: 6000  },
            { id: 'chassis',    label: 'Chassis Straightening',        price: 25000 },
            { id: 'weld',       label: 'Welding / Fabrication',        price: 10000 },
            { id: 'rust',       label: 'Rust Treatment',               price: 8000  },
            { id: 'glass',      label: 'Glass Replacement',            price: 7000  },
            { id: 'heavybody',  label: 'Heavy Commercial Body Repair', price: 50000 },
            { id: 'cabin',      label: 'Commercial Cabin Repair',      price: 20000 },
            { id: 'branding',   label: 'Branding Surface Preparation', price: 8000  }
        ],
        fabrication: [
            { id: 'metalfab',    label: 'Metal Fabrication',           price: 15000 },
            { id: 'structweld',  label: 'Structural Welding',          price: 12000 },
            { id: 'bullbar',     label: 'Bull Bar Fabrication',        price: 25000 },
            { id: 'chassisrein', label: 'Chassis Reinforcement',       price: 20000 },
            { id: 'trailer',     label: 'Trailer / Truck Body Repair', price: 35000 },
            { id: 'customheavy', label: 'Custom Heavy Vehicle Works',  price: 40000 }
        ],
        carwash: [
            { id: 'extwash',    label: 'Exterior Wash',             price: 500   },
            { id: 'intclean',   label: 'Interior Cleaning',         price: 800   },
            { id: 'fullwash',   label: 'Full Car Wash',             price: 1200  },
            { id: 'engwash',    label: 'Engine Wash',               price: 2000  },
            { id: 'under',      label: 'Undercarriage Wash',        price: 1000  },
            { id: 'rim',        label: 'Tire / Rim Cleaning',       price: 500   },
            { id: 'detail',     label: 'Detailing',                 price: 5000  },
            { id: 'intdetail',  label: 'Interior Detailing',        price: 4000  },
            { id: 'extdetail',  label: 'Exterior Detailing',        price: 4500  },
            { id: 'paintcorr',  label: 'Paint Correction',          price: 15000 },
            { id: 'wax',        label: 'Wax / Sealant Application', price: 3000  },
            { id: 'ceramic',    label: 'Ceramic Coating',           price: 25000 },
            { id: 'headlight',  label: 'Headlight Restoration',     price: 2500  },
            { id: 'upholstery', label: 'Seat / Upholstery Cleaning',price: 3500  },
            { id: 'odor',       label: 'Odor Removal',              price: 2000  }
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
            { id: 'softdrink', label: 'Soft Drinks',         price: 150  },
            { id: 'tea',       label: 'Tea / Coffee',        price: 100  },
            { id: 'snacks',    label: 'Snacks',              price: 200  },
            { id: 'meals',     label: 'Meals / Food Service',price: 500  },
            { id: 'lounge',    label: 'Lounge / Waiting Area',price: 0   },
            { id: 'events',    label: 'Event / Group Hosting',price: 5000 }
        ]
    };

    const BOOKING_ADDONS = {
        'Garage':      ['Minor Service','Major Service','Computer Diagnostics','Engine Repair','Brake Service','Suspension Repair','Steering Repair','Wheel Alignment','Tire Service','Battery Check','AC Service','Cooling System Repair','Transmission Service','Electrical Repair','Pre-Purchase Inspection','Fleet Maintenance'],
        'Body Work':   ['Panel Beating','Accident Repair','Dent Removal','Spray Painting','Full Body Repaint','Bumper Repair','Chassis Straightening','Welding / Fabrication','Rust Treatment','Glass Replacement','Commercial Body Repair','Cabin Repair','Branding Surface Preparation'],
        'Fabrication': ['Metal Fabrication','Structural Welding','Bull Bar Fabrication','Chassis Reinforcement','Trailer / Body Repair','Custom Heavy Works'],
        'Car Wash':    ['Exterior Wash','Interior Cleaning','Full Car Wash','Engine Wash','Undercarriage Wash','Tire / Rim Cleaning','Detailing','Interior Detailing','Exterior Detailing','Paint Correction','Wax / Sealant Application','Ceramic Coating','Headlight Restoration','Upholstery Cleaning','Odor Removal'],
        'Recovery':    ['Breakdown Recovery','Accident Recovery','Vehicle Towing','Workshop Delivery','Heavy Vehicle Recovery','Emergency Response'],
        'Bar':         ['Soft Drinks','Tea / Coffee','Snacks','Meals / Food Service','Lounge / Waiting Area','Event / Group Hosting']
    };

    const SERVICE_PREFILL_MAP = {
        'Garage Services':     'Garage',
        'Body Works':          'Body Work',
        'Fabrication':         'Fabrication',
        'Carwash & Detailing': 'Car Wash',
        'Recovery Services':   'Recovery',
        'Bar & Service':       'Bar'
    };

    // ─── 4. Booking Popup Modal ───────────────────────────────────────────────
    const bookingModal   = document.getElementById('bookingModal');
    const modalClose     = document.getElementById('modalClose');
    const popupForm      = document.getElementById('popupBookingForm');

    function openBookingModal(prefillService) {
        if (!bookingModal) return;
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (prefillService) {
            const mapped = SERVICE_PREFILL_MAP[prefillService] || prefillService;
            const pill = bookingModal.querySelector(`.popup-primary-pill[data-val="${mapped}"]`);
            if (pill) { pill.click(); }
        }
    }

    function closeBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', e => { if (e.target === bookingModal) closeBookingModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBookingModal(); });
    }

    // Wire all booking-trigger buttons/links (delegation catches dynamically injected elements)
    document.addEventListener('click', e => {
        const el = e.target.closest('[data-booking-popup]');
        if (el) {
            e.preventDefault();
            openBookingModal(el.dataset.bookingPopup || el.dataset.service || '');
            return;
        }
        const anchor = e.target.closest('a[href="#booking"]');
        if (anchor) {
            e.preventDefault();
            openBookingModal(anchor.dataset.service || '');
        }
    });

    // Popup primary service pills
    const popupPills = document.querySelectorAll('.popup-primary-pill');
    const popupSpecificWrap = document.getElementById('popupSpecificWrap');
    const popupServiceList  = document.getElementById('popupServiceList');
    const popupConfirmBtn   = document.getElementById('popupConfirmBtn');
    const popupSummary      = document.getElementById('popupSummary');
    let popupSelectedServices = [];
    let popupPrimaryValue = '';

    function buildPopupServiceList(primaryVal) {
        if (!popupServiceList) return;
        const items = BOOKING_ADDONS[primaryVal] || [];
        popupServiceList.innerHTML = items.map(s =>
            `<label class="popup-service-check"><span class="popup-check-ico"></span>${s}</label>`
        ).join('');
        popupSelectedServices = [];
        if (popupConfirmBtn) popupConfirmBtn.classList.remove('show');
        if (popupSummary) popupSummary.classList.remove('show');
        if (popupSpecificWrap) popupSpecificWrap.classList.add('show');

        popupServiceList.querySelectorAll('.popup-service-check').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('sel');
                const label = item.textContent.trim();
                if (item.classList.contains('sel')) {
                    popupSelectedServices.push(label);
                } else {
                    popupSelectedServices = popupSelectedServices.filter(s => s !== label);
                }
                if (popupConfirmBtn) {
                    popupSelectedServices.length > 0
                        ? popupConfirmBtn.classList.add('show')
                        : popupConfirmBtn.classList.remove('show');
                }
            });
        });
    }

    popupPills.forEach(pill => {
        pill.addEventListener('click', () => {
            popupPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            popupPrimaryValue = pill.dataset.val;
            buildPopupServiceList(popupPrimaryValue);
            if (popupSummary) popupSummary.classList.remove('show');
            if (popupConfirmBtn) popupConfirmBtn.classList.remove('show');
        });
    });

    if (popupConfirmBtn) {
        popupConfirmBtn.addEventListener('click', () => {
            if (popupSelectedServices.length === 0) return;
            if (popupSpecificWrap) popupSpecificWrap.classList.remove('show');
            popupConfirmBtn.classList.remove('show');
            if (popupSummary) {
                popupSummary.innerHTML = `<strong>${popupPrimaryValue}</strong> — ${popupSelectedServices.join(', ')}<small>Tap to change selection</small>`;
                popupSummary.classList.add('show');
            }
        });
    }

    if (popupSummary) {
        popupSummary.addEventListener('click', () => {
            popupSummary.classList.remove('show');
            if (popupSpecificWrap) popupSpecificWrap.classList.add('show');
            if (popupConfirmBtn && popupSelectedServices.length > 0) popupConfirmBtn.classList.add('show');
        });
    }

    // Popup form submit
    if (popupForm) {
        popupForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = popupForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const serviceStr = popupPrimaryValue
                ? (popupSelectedServices.length ? `${popupPrimaryValue} — ${popupSelectedServices.join(', ')}` : popupPrimaryValue)
                : '';

            const data = {
                'Full Name':         (document.getElementById('popupName')    || {}).value || '',
                'Phone Number':      (document.getElementById('popupPhone')   || {}).value || '',
                'Vehicle':           (document.getElementById('popupVehicle') || {}).value || '',
                'Service Requested': serviceStr,
                'Preferred Date':    (document.getElementById('popupDate')    || {}).value || '',
                'Preferred Time':    (document.getElementById('popupTime')    || {}).value || '',
                'Email Address':     '',
                'Additional Notes':  '',
                'Submission Source': 'Quick Booking Popup',
                'Status':            'New'
            };

            let ok = false;
            try {
                const res = await fetch(BOOKING_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                ok = res.ok;
            } catch (err) { console.warn('Popup form error:', err); }

            btn.textContent = orig;
            btn.disabled = false;

            const msgEl = document.getElementById('popupFormMsg');
            if (msgEl) {
                msgEl.style.display = 'block';
                msgEl.className = ok ? 'success-message' : 'error-message';
                msgEl.textContent = ok
                    ? '✓ Booking sent! We\'ll call you shortly.'
                    : '✗ Failed. Please call +254 711 758 633.';
                if (ok) { popupForm.reset(); popupPills.forEach(p => p.classList.remove('active')); if (popupSpecificWrap) popupSpecificWrap.classList.remove('show'); if (popupSummary) popupSummary.classList.remove('show'); popupSelectedServices = []; popupPrimaryValue = ''; }
                setTimeout(() => { msgEl.style.display = 'none'; if (ok) closeBookingModal(); }, 4000);
            }
        });
    }

    // ─── 5. Contact Popup ─────────────────────────────────────────────────────
    const contactPopup   = document.getElementById('contactPopup');
    const contactTrigger = document.getElementById('contactNavTrigger');

    if (contactTrigger && contactPopup) {
        contactTrigger.addEventListener('click', e => {
            e.preventDefault();
            contactPopup.classList.toggle('active');
        });
        document.addEventListener('click', e => {
            if (!contactTrigger.contains(e.target) && !contactPopup.contains(e.target)) {
                contactPopup.classList.remove('active');
            }
        });
    }

    // ─── 6. Estimator (Auto-Calc) ─────────────────────────────────────────────
    const addonsWrap    = document.getElementById('est-addons-wrap');
    const liveValue     = document.getElementById('estLiveValue');
    const serviceRadios = document.querySelectorAll('input[name="service"]');

    function calcEstimate() {
        let total = 0;
        document.querySelectorAll('input[name="addon"]:checked').forEach(cb => {
            total += parseFloat(cb.dataset.price) || 0;
        });
        total = Math.round(total);
        if (liveValue) {
            const start = parseInt(liveValue.textContent.replace(/[^0-9]/g, '')) || 0;
            if (start === total) return;
            const dur = 500, startT = performance.now();
            const tick = now => {
                const p = Math.min((now - startT) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                liveValue.textContent = `KES ${Math.floor(start + (total - start) * ease).toLocaleString()}`;
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
    }

    function buildAddons(serviceKey) {
        if (!addonsWrap) return;
        const items = SERVICE_ADDONS[serviceKey] || [];
        addonsWrap.innerHTML = items.map(item =>
            `<label class="est-check">
                <input type="checkbox" name="addon" value="${item.id}" data-price="${item.price}">
                <span class="check-box"></span>
                ${item.label}<span class="addon-price"> KES ${item.price.toLocaleString()}</span>
            </label>`
        ).join('');
        addonsWrap.querySelectorAll('input[name="addon"]').forEach(cb => cb.addEventListener('change', calcEstimate));
        calcEstimate();
    }

    const defaultService = document.querySelector('input[name="service"]:checked');
    if (defaultService) buildAddons(defaultService.value);

    serviceRadios.forEach(radio => radio.addEventListener('change', () => { buildAddons(radio.value); }));

    // ─── 7. Hero Image + Text Carousel ───────────────────────────────────────
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots   = document.querySelectorAll('.c-dot');
    const heroTextSlides = document.querySelectorAll('.hero-text-slide');
    let heroCurrent = 0;
    let heroTimer;

    if (carouselSlides.length > 1) {
        const goTo = n => {
            carouselSlides[heroCurrent].classList.remove('active');
            if (carouselDots[heroCurrent]) carouselDots[heroCurrent].classList.remove('active');
            heroCurrent = (n + carouselSlides.length) % carouselSlides.length;
            carouselSlides[heroCurrent].classList.add('active');
            if (carouselDots[heroCurrent]) carouselDots[heroCurrent].classList.add('active');
            // Text slides change 1 second after image
            setTimeout(() => {
                heroTextSlides.forEach((s, i) => s.classList.toggle('active', i === heroCurrent));
            }, 1000);
        };
        const startTimer = () => { heroTimer = setInterval(() => goTo(heroCurrent + 1), 5000); };
        const stopTimer  = () => clearInterval(heroTimer);
        startTimer();
        carouselDots.forEach((dot, i) => dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); }));
        const carouselEl = document.querySelector('.hero-carousel');
        if (carouselEl) {
            carouselEl.addEventListener('mouseenter', stopTimer);
            carouselEl.addEventListener('mouseleave', startTimer);
        }
    }

    // ─── 8. Booking Form — Specific Service Checkboxes ───────────────────────
    const primarySelect = document.getElementById('bookServicePrimary');
    const specificWrap  = document.getElementById('specificServiceWrap');
    const specificList  = document.getElementById('specificServiceList');
    const confirmBtn    = document.getElementById('confirmServiceBtn');
    const confirmedLbl  = document.getElementById('confirmedServiceLabel');
    let selectedSpecific = [];

    function buildSpecificList(primaryVal) {
        if (!specificList) return;
        const items = BOOKING_ADDONS[primaryVal] || [];
        specificList.innerHTML = items.map(s =>
            `<label class="svc-chk-item"><span class="svc-chk-box"></span>${s}</label>`
        ).join('');
        selectedSpecific = [];
        if (confirmBtn) confirmBtn.classList.remove('show');
        if (confirmedLbl) { confirmedLbl.classList.remove('show'); confirmedLbl.innerHTML = ''; }
        if (specificWrap) specificWrap.style.display = 'block';

        specificList.querySelectorAll('.svc-chk-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('on');
                const label = item.textContent.trim();
                if (item.classList.contains('on')) {
                    selectedSpecific.push(label);
                } else {
                    selectedSpecific = selectedSpecific.filter(s => s !== label);
                }
                if (confirmBtn) {
                    selectedSpecific.length > 0 ? confirmBtn.classList.add('show') : confirmBtn.classList.remove('show');
                }
            });
        });
    }

    if (primarySelect) {
        primarySelect.addEventListener('change', () => {
            const val = primarySelect.value;
            if (val) buildSpecificList(val);
            else {
                if (specificWrap) specificWrap.style.display = 'none';
                selectedSpecific = [];
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!selectedSpecific.length) return;
            if (specificList) specificList.style.display = 'none';
            confirmBtn.classList.remove('show');
            if (confirmedLbl) {
                confirmedLbl.innerHTML = `<span>${selectedSpecific.join(', ')}</span><span class="hint">Tap to change</span>`;
                confirmedLbl.classList.add('show');
            }
        });
    }

    if (confirmedLbl) {
        confirmedLbl.addEventListener('click', () => {
            confirmedLbl.classList.remove('show');
            if (specificList) specificList.style.display = '';
            if (confirmBtn && selectedSpecific.length) confirmBtn.classList.add('show');
        });
    }

    // Wire services section Book Now buttons to prefill and open popup
    document.querySelectorAll('[data-service]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openBookingModal(btn.dataset.service);
            if (primarySelect) {
                const mapped = SERVICE_PREFILL_MAP[btn.dataset.service] || btn.dataset.service;
                primarySelect.value = mapped;
                if (mapped) buildSpecificList(mapped);
            }
        });
    });

    // ─── 9. Main Booking Form Submit ─────────────────────────────────────────
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Processing...';
            btn.disabled = true;

            const primary = (document.getElementById('bookServicePrimary') || {}).value || '';
            const serviceStr = primary
                ? (selectedSpecific.length ? `${primary} — ${selectedSpecific.join(', ')}` : primary)
                : '';

            const data = {
                'Full Name':         (document.getElementById('bookName')    || {}).value || '',
                'Phone Number':      (document.getElementById('bookPhone')   || {}).value || '',
                'Email Address':     (document.getElementById('bookEmail')   || {}).value || '',
                'Vehicle':           (document.getElementById('bookVehicle') || {}).value || '',
                'Service Requested': serviceStr,
                'Preferred Date':    (document.getElementById('bookDate')    || {}).value || '',
                'Preferred Time':    (document.getElementById('bookTime')    || {}).value || '',
                'Additional Notes':  (document.getElementById('bookNotes')   || {}).value || '',
                'Submission Source': 'Bottom Booking Form',
                'Status':            'New'
            };

            let ok = false;
            try {
                const res = await fetch(BOOKING_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                ok = res.ok;
                if (!res.ok) console.warn('Submission error:', res.status);
            } catch (err) { console.warn('Booking error:', err); }

            btn.textContent = orig;
            btn.disabled = false;

            const formSuccess = document.getElementById('formSuccess');
            const formError   = document.getElementById('formError');
            if (ok) {
                bookingForm.reset();
                if (specificWrap) specificWrap.style.display = 'none';
                if (confirmedLbl) confirmedLbl.classList.remove('show');
                selectedSpecific = [];
                if (formSuccess) { formSuccess.style.display = 'block'; setTimeout(() => { formSuccess.style.display = 'none'; }, 5000); }
            } else {
                if (formError) { formError.style.display = 'block'; setTimeout(() => { formError.style.display = 'none'; }, 6000); }
            }
        });
    }

    // Testimonials are now a CSS marquee — no JS needed.

    // ─── 11. Page Hero Text Carousel (services & gallery pages) ─────────────
    const pageHeroSlides = document.querySelectorAll('.page-hero-slide');
    const pageHeroDots   = document.querySelectorAll('.page-hero-dot');
    if (pageHeroSlides.length > 1) {
        let phCurrent = 0;
        const goToPage = n => {
            pageHeroSlides[phCurrent].classList.remove('active');
            if (pageHeroDots[phCurrent]) pageHeroDots[phCurrent].classList.remove('active');
            phCurrent = (n + pageHeroSlides.length) % pageHeroSlides.length;
            pageHeroSlides[phCurrent].classList.add('active');
            if (pageHeroDots[phCurrent]) pageHeroDots[phCurrent].classList.add('active');
        };
        setInterval(() => goToPage(phCurrent + 1), 5000);
        pageHeroDots.forEach((d, i) => d.addEventListener('click', () => goToPage(i)));
    }

    // ─── 12. Chat ─────────────────────────────────────────────────────────────
    const chatToggle    = document.getElementById('chatToggle');
    const chatInterface = document.getElementById('chatInterface');
    const closeChat     = document.getElementById('closeChat');
    const chatInput     = document.getElementById('chatInput');
    const sendMessage   = document.getElementById('sendMessage');
    const chatBody      = document.getElementById('chatBody');

    if (chatToggle && chatInterface) {
        chatToggle.addEventListener('click', e => {
            e.preventDefault();
            chatInterface.classList.toggle('active');
            if (chatInterface.classList.contains('active') && chatInput) chatInput.focus();
        });
        if (closeChat) closeChat.addEventListener('click', () => chatInterface.classList.remove('active'));

        const addMsg = (msg, sender) => {
            if (!msg.trim()) return;
            const d = document.createElement('div');
            d.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
            d.innerHTML = `<p style="margin:0">${msg}</p>`;
            chatBody.appendChild(d);
            chatBody.scrollTop = chatBody.scrollHeight;
            if (sender === 'user') {
                setTimeout(() => addMsg("Thanks for reaching out! A service advisor will be with you shortly.", 'bot'), 1000);
            }
        };

        if (sendMessage) sendMessage.addEventListener('click', () => { addMsg(chatInput.value, 'user'); chatInput.value = ''; });
        if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') { addMsg(chatInput.value, 'user'); chatInput.value = ''; } });
    }
});
