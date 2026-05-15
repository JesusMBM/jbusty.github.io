# Visual Redesign — jbusty.github.io

**Date:** 2026-05-15
**Goal:** Full visual overhaul — Catppuccin Mocha palette, JetBrains Mono throughout, Apple-level GSAP scroll animations.

---

## 1. Color System

Replace all CSS custom properties in `src/index.css`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#1e1e2e` | Page background |
| `--bg-2` | `#181825` | Cards, nav background |
| `--bg-3` | `#313244` | Borders, surfaces |
| `--text` | `#cdd6f4` | Body text |
| `--text-muted` | `#6c7086` | Secondary/muted text |
| `--text-bright` | `#bac2de` | Headings |
| `--accent` | `#cba6f7` | Primary accent (mauve) |
| `--accent-2` | `#89b4fa` | Blue accent |
| `--accent-3` | `#94e2d5` | Teal (code elements) |
| `--pink` | `#f38ba8` | Highlights, hover states |
| `--accent-dim` | `rgba(203,166,247,0.1)` | Accent backgrounds |
| `--border` | `rgba(255,255,255,0.08)` | Subtle borders |

---

## 2. Typography

- **Font:** JetBrains Mono for the entire site — headings, body, nav, buttons, labels, everything
- Load via Google Fonts: `JetBrains Mono` weights 400, 500, 600, 700
- Remove `Inter` import
- `--font-sans` and `--font-mono` both point to `'JetBrains Mono', monospace`

---

## 3. Animation System

**Dependencies:**
- Add `gsap` and `@gsap/react` to `package.json`

**Global:**
- Page load: body fades from `opacity: 0` to `1` over 0.6s on mount
- Keep CSS `scroll-behavior: smooth` (GSAP ScrollSmoother is a paid plugin)
- All scroll animations use `ScrollTrigger` with `start: "top 80%"`

**Per-section animations:**

| Section | Animation |
|---|---|
| Hero | Name animates in letter-by-letter (manual char split: wrap each character in a `<span>`, stagger with GSAP). Title fades up with stagger. CTAs pop in last. Background gradient orb slowly drifts. |
| Nav | Logo + links slide down on load. Enhanced blur/darken on scroll (existing behavior kept, enhanced). Active section highlighted via ScrollTrigger. |
| About | Content block fades + slides up on scroll entry. Section heading gets a blinking terminal cursor after it. |
| Projects | Cards stagger in from below one by one. Hover lifts card + glows with mauve border. |
| Skills | Skill tags wave-stagger in on scroll entry. |
| Contact | Form elements slide in sequentially on scroll entry. CTA glows on hover. |

---

## 4. Layout & Visual Changes

### Hero
- Full-viewport dark section
- Animated background: large blurred gradient orb (mauve + blue), slowly drifting with GSAP
- Greeting prefixed with `>_` terminal prompt character
- Name: ~6–8rem JetBrains Mono, `--text-bright`
- Subtitle: mauve (`--accent`) color
- CTA buttons: sharp monospace look, mauve glow on hover

### Nav
- Logo changed from `<JBM/>` to `[JBM]` in mauve brackets
- Nav links numbered: `01. About`, `02. Projects`, `03. Skills`, `04. Contact`
- Active section tracking via ScrollTrigger

### Section Eyebrows
- Styled as code comments: `// about me`, `// projects`, `// skills`, `// contact`

### Cards (Projects, Skills)
- `1px` border using `--accent` or `--accent-2` that glows on hover
- `border-radius: 8px`
- Subtle `backdrop-filter: blur` on card backgrounds
- Increased internal padding

### Global Polish
- Custom scrollbar: thin, mauve thumb (`--accent`) on dark track (`--bg-2`)
- Text selection: mauve background with dark text
- Subtle dot/grid pattern at very low opacity on page background for depth
- Increased section padding and line-height for breathing room

---

## 5. File Scope

| File | Changes |
|---|---|
| `package.json` | Add `gsap`, `@gsap/react` |
| `index.html` | Add JetBrains Mono Google Fonts link |
| `src/index.css` | New color tokens, typography, scrollbar, selection, dot pattern, global spacing |
| `src/main.jsx` | GSAP page load animation |
| `src/App.jsx` | ScrollTrigger setup/cleanup |
| `src/components/Nav.jsx` + `Nav.module.css` | New logo style, numbered links, active tracking |
| `src/components/Hero.jsx` + `Hero.module.css` | Terminal prompt, gradient orb, letter animation |
| `src/components/About.jsx` + `About.module.css` | Scroll reveal, blinking cursor |
| `src/components/Projects.jsx` + `Projects.module.css` | Card stagger, glow hover |
| `src/components/Skills.jsx` + `Skills.module.css` | Wave stagger |
| `src/components/Contact.jsx` + `Contact.module.css` | Sequential reveal, glow CTA |
