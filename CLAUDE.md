# Mystiv Auto Center — Claude Code Project Guide
> Version: 1.4 | Last Updated: March 16, 2026

This file is the single source of truth for Claude Code when working on this project.
Place it at the root of the `mystiv4.0/` directory.

---

## Project Overview

Mystiv Auto Center is a premium automotive service brand (Meru/Nairobi, Kenya).
This is a **static HTML/CSS/JS** multi-page marketing + booking site.
No build tools, no framework, no backend. Pure vanilla.

---

## File Structure

```
mystiv4.0/
├── CLAUDE.md               ← YOU ARE HERE (project memory for Claude Code)
├── index.html              Main page (hero, services, estimator, booking, footer)
├── services.html           Services detail page
├── gallery.html            Gallery page
├── style.css               Base design system (tokens, typography, layout)
├── glassmorphism.css       Visual upgrade layer (glass, motion, shadows)
├── glassmorphism.js        Animation & interaction runtime
├── script.js               Core page logic (navbar, estimator, form, chat)
└── images/
    ├── logo.png
    └── Hero.png
```

---

## Design System — DO NOT MODIFY THESE TOKENS

All CSS custom properties live in `style.css`. Claude must never change these values.

| Token | Value | Usage |
|---|---|---|
| `--color-brand` | `#E8380D` | Primary CTA, accents, badges |
| `--color-bg-dark` | `#111111` | Dark sections, footer, hero overlay |
| `--color-bg-light` | `#F5F5F5` | Page background, light sections |
| `--color-bg-card` | `#FFFFFF` | Cards, forms, estimator panels |
| `--color-border` | `#E0E0E0` | Borders, separators |
| `--color-text-primary` | `#111111` | Headings, labels |
| `--color-text-secondary` | `#555555` | Body copy, descriptions |
| `--color-text-on-dark` | `#FFFFFF` | Text on dark backgrounds |
| `--color-text-muted-dark` | `#AAAAAA` | Secondary text on dark |

**Fonts:** `Barlow Condensed 800` (headlines) + `Inter 400/600/700/800` (body)
**Gradient text:** `.text-gradient` class — applied to key headline spans only.

---

## Known Bugs to Fix (Priority Order)

### BUG-1 — Contact card class mismatch ⚠️ HIGH
- **Problem:** Contact cards in `index.html` use `class="info-card"` but `glassmorphism.css` targets `.contact-card`
- **Fix:** In `glassmorphism.css`, add `.info-card` alongside every `.contact-card` selector, OR rename the HTML classes to `.contact-card`
- **Preferred fix:** Update CSS selectors — don't touch the HTML structure

### BUG-2 — Duplicate booking form listener ⚠️ HIGH
- **Problem:** Both `script.js` and `glassmorphism.js → initBookingForm()` attach submit listeners to `#bookingForm`
- **Fix:** Remove `initBookingForm()` entirely from `glassmorphism.js`. The `script.js` handler is the canonical one.

### BUG-3 — Dead estimator code in script.js ⚠️ MEDIUM
- **Problem:** `script.js` references `#serviceType` and `#complexity` — these IDs do not exist in `index.html`
- **Fix:** Delete the dead handler block entirely from `script.js`. The active estimator uses `#calc-btn` + radio buttons.

### BUG-4 — glassmorphism.js targets `#priceDisplay` ⚠️ LOW
- **Problem:** `glassmorphism.js → initPricingEstimator()` targets `#priceDisplay` which doesn't exist
- **Fix:** Remove or comment out `initPricingEstimator()` in `glassmorphism.js`. It is dormant and harmless but should be cleaned up.

---

## Pending Features to Build

### FEAT-1 — Real form backend
- **What:** Connect `#bookingForm` to a real submission endpoint
- **Recommended approach:** EmailJS (no backend required, free tier available)
- **Current state:** Simulated with 1.2s timeout in `script.js → handleBookingSubmit()`
- **Files to edit:** `script.js`, `index.html` (add EmailJS CDN script tag)
- **Implementation notes:**
  - Keep existing success/error UI states — just replace the `setTimeout` mock
  - Add field-level error styling (see FEAT-6)

### FEAT-2 — Real gallery images
- **What:** Replace 6 placeholder tiles in `gallery.html` with actual photos
- **Current state:** `.gallery-item` tiles are text-only with gradient backgrounds
- **Files to edit:** `gallery.html`, `images/` directory
- **Implementation notes:**
  - Use `<img>` tags inside `.gallery-item` with `object-fit: cover` and `width/height: 100%`
  - Add `loading="lazy"` on all gallery images
  - Keep the `.reveal-up` animation — it already applies to `.gallery-item`
  - Suggested image filenames: `gallery-engine.jpg`, `gallery-diagnostic.jpg`, etc.

### FEAT-3 — services.html content
- **What:** Build out full service detail cards on `services.html`
- **Current state:** Page structure exists but content not reviewed/completed
- **Files to edit:** `services.html`
- **Design reference:** Use same `.service-card` component pattern from `index.html`

### FEAT-4 — Contact information (real data)
- **What:** Replace all placeholder contact details with real business info
- **Discrepancy to resolve first:** Footer col 4 shows Meru contact; booking section shows Nairobi contact — align to one canonical address
- **Files to edit:** `index.html` (both booking section + footer), `services.html`, `gallery.html`
- **Fields to update:**
  - Phone: `+254 20 123 4567` / `+254 700 000 000`
  - Email: `service@mystiv.com` / `support@mystiv.com`
  - Address: `Nairobi West, Lang'ata Road, Opposite T-Mall`
  - WhatsApp: `wa.me/254700123456`
  - Footer contact: `+254 700 123 456` / `hello@mystiv.co.ke` / `Meru, Kenya`

### FEAT-5 — Social media links
- **What:** Replace all `href="#"` social links with real URLs
- **Location:** Footer col 1 social icons (Facebook, Instagram, YouTube, TikTok)
- **Files to edit:** `index.html`, `services.html`, `gallery.html`

### FEAT-6 — Form field error states
- **What:** Custom styled validation errors (not browser-native HTML5 popups)
- **Files to edit:** `style.css` or `glassmorphism.css`, `script.js`
- **Implementation notes:**
  - Add `.field-error` class to `.form-group` on invalid submit
  - Show error message in a `<span class="error-msg">` below each field
  - Clear errors on input focus
  - Use `--color-brand` (#E8380D) for error border/text to stay on-brand

### FEAT-7 — Favicon
- **What:** Add a favicon to all pages
- **Files to edit:** `index.html`, `services.html`, `gallery.html` (`<head>`)
- **Implementation:** `<link rel="icon" href="images/favicon.ico">` or SVG favicon

---

## Architecture Rules (Claude must follow these)

1. **No build tools.** No npm, webpack, vite, etc. Plain HTML/CSS/JS files only.
2. **No new external libraries** unless explicitly approved. GSAP and Google Fonts are already loaded.
3. **CSS changes go in the right file:**
   - Design tokens and base layout → `style.css`
   - Glass effects, animations, hover states → `glassmorphism.css`
   - Never add component-level styles to `glassmorphism.js`
4. **JS split:**
   - Navbar, estimator, form, chat → `script.js`
   - Reveal animations, glass interactions → `glassmorphism.js`
5. **All three pages share the same navbar and footer HTML.** If you change the navbar structure, change it in `index.html`, `services.html`, AND `gallery.html`.
6. **Two reveal systems run in parallel** — don't consolidate them:
   - `script.js` observer → `.reveal` class (hero, info-cards)
   - `glassmorphism.js` observer → `.reveal-up` / `.reveal-scale` (everything else)
7. **GSAP is only loaded on `index.html`.** Do not add GSAP calls to `services.html` or `gallery.html` without adding the CDN there too. Always guard with `typeof gsap !== 'undefined'`.
8. **Reduced motion must be respected.** Any new CSS animation must have a counterpart in the `@media (prefers-reduced-motion: reduce)` block in `glassmorphism.css`.

---

## Component Reference

### Glass Card Pattern
```css
/* Applied via glassmorphism.css — reference only */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.5);
box-shadow: var(--shadow-l1);
```

### Button Variants
- `.btn.btn-primary` — brand orange fill
- `.btn.btn-glass` — glass transparent
- `.btn.btn-outline` — outlined, brand color
- Size modifiers: `.btn-large`, `.btn-small`, `.btn-block`

### Shadow Tiers
- `--shadow-l1` — default card state
- `--shadow-l2` — featured/active card
- `--shadow-l3` — hover emphasis

### Reveal Animation Classes
- `.reveal` — watched by `script.js` observer
- `.reveal-up` — injected by `glassmorphism.js`, slides up + fades in
- `.reveal-scale` — injected by `glassmorphism.js`, scales in (estimator panel)

---

## Launch Checklist

```
[ ] BUG-1: Fix .info-card / .contact-card selector mismatch
[ ] BUG-2: Remove duplicate booking form listener from glassmorphism.js
[ ] BUG-3: Remove dead #serviceType / #complexity estimator handler from script.js
[ ] BUG-4: Remove dormant initPricingEstimator() from glassmorphism.js
[ ] FEAT-1: Connect booking form to real backend (EmailJS)
[ ] FEAT-2: Add real gallery images
[ ] FEAT-3: Complete services.html content
[ ] FEAT-4: Update all contact info (resolve Meru vs Nairobi discrepancy first)
[ ] FEAT-5: Add real social media URLs
[ ] FEAT-6: Custom form field error states
[ ] FEAT-7: Add favicon to all pages
[ ] Test mobile menu on iOS Safari (backdrop-filter)
[ ] Test form submission on mobile
[ ] Confirm GSAP CDN loads correctly (fallbacks are in place)
[ ] Verify logo.png and Hero.png are production-quality
[ ] WhatsApp number: update wa.me link with real number
```

---

## Suggested Claude Code Session Workflow

When starting a session, tell Claude Code:

> "Read CLAUDE.md first. Then work on [task]."

**Recommended task order:**
1. Fix BUG-1, BUG-2, BUG-3, BUG-4 first (clean foundation)
2. FEAT-4 + FEAT-5 (real contact/social data — quick wins)
3. FEAT-1 (form backend — highest business value)
4. FEAT-6 (error states — pairs with FEAT-1)
5. FEAT-2 (gallery images — needs actual photos from you)
6. FEAT-3 (services page content)
7. FEAT-7 (favicon — 5 minutes)

---

## Asking Claude Code for Help

**Good prompts:**
- "Fix BUG-1 as described in CLAUDE.md"
- "Implement FEAT-6 form error states using the brand color token"
- "Add EmailJS to the booking form — keep the existing UI, just replace the setTimeout mock"
- "Update the gallery.html to display real images — I'll provide the filenames"

**Avoid:**
- "Redesign the color scheme" — tokens are locked
- "Add React/Vue" — this is vanilla only
- "Change the font" — Barlow Condensed + Inter are brand-specified
