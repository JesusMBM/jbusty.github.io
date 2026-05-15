# Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full visual overhaul — Catppuccin Mocha palette, JetBrains Mono site-wide, GSAP ScrollTrigger animations across all sections.

**Architecture:** Replace CSS tokens in `index.css`, load JetBrains Mono for all weights, install GSAP + @gsap/react, then add animations per-component using the `useGSAP` hook with ScrollTrigger. Each component manages its own animations and cleans up via useGSAP's automatic cleanup.

**Tech Stack:** React 19, Vite, GSAP 3, @gsap/react, CSS Modules, Google Fonts (JetBrains Mono)

---

## File Map

| File | Change |
|---|---|
| `package.json` | Add `gsap`, `@gsap/react` |
| `index.html` | Update Google Fonts URL — add JetBrains Mono weights 600, 700 |
| `src/index.css` | New Catppuccin Mocha tokens, JetBrains Mono everywhere, scrollbar, selection, dot pattern |
| `src/App.jsx` | Register GSAP plugins, page load fade-in |
| `src/main.jsx` | Set `body { opacity: 0 }` before mount |
| `src/components/Nav.jsx` | Logo `[JBM]`, numbered links, active section via ScrollTrigger |
| `src/components/Nav.module.css` | Updated logo and link styles |
| `src/components/Hero.jsx` | `>_` prompt, orb background, letter-by-letter name animation |
| `src/components/Hero.module.css` | Orb styles, prompt styles, updated CTAs |
| `src/components/About.jsx` | Eyebrow `// about me`, blinking cursor, scroll reveal |
| `src/components/About.module.css` | Cursor animation |
| `src/components/Projects.jsx` | Eyebrow `// projects`, stagger animation, glow hover |
| `src/components/Projects.module.css` | Glow hover, updated card border |
| `src/components/Skills.jsx` | Eyebrow `// skills`, wave stagger |
| `src/components/Skills.module.css` | Updated category card styles |
| `src/components/Contact.jsx` | Eyebrow `// contact`, sequential reveal, glow CTA |
| `src/components/Contact.module.css` | Glow email button |

---

## Task 1: Install GSAP and update fonts

**Files:**
- Modify: `package.json`
- Modify: `index.html`

- [ ] **Step 1: Install GSAP**

```bash
cd /Users/jesusbustillos-molina/jbusty.github.io
npm install gsap @gsap/react
```

Expected output: `added N packages`

- [ ] **Step 2: Update Google Fonts URL in `index.html`**

Replace the existing `<link>` for fonts with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts at `http://localhost:5173` with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json index.html
git commit -m "feat: install gsap and add JetBrains Mono full weights"
```

---

## Task 2: Catppuccin Mocha color system + global CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace entire `src/index.css` with the following**

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {
  --bg: #1e1e2e;
  --bg-2: #181825;
  --bg-3: #313244;
  --text: #cdd6f4;
  --text-bright: #bac2de;
  --text-muted: #6c7086;
  --accent: #cba6f7;
  --accent-2: #89b4fa;
  --accent-3: #94e2d5;
  --pink: #f38ba8;
  --accent-dim: rgba(203, 166, 247, 0.1);
  --border: rgba(255, 255, 255, 0.08);
  --font-sans: 'JetBrains Mono', monospace;
  --font-mono: 'JetBrains Mono', monospace;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, rgba(203, 166, 247, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-2);
}

::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 3px;
}

a {
  color: inherit;
  text-decoration: none;
}

img { display: block; max-width: 100%; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

section { padding: 112px 0; }

.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent);
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  opacity: 0.85;
}

.section-heading {
  font-size: clamp(1.6rem, 4vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--text-bright);
  margin-bottom: 56px;
}

@media (max-width: 640px) {
  section { padding: 80px 0; }
}
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173`. Background should be dark purple `#1e1e2e`, text should be lavender, and a faint dot grid should be visible across the page.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: apply Catppuccin Mocha color system and global styles"
```

---

## Task 3: Page load fade-in

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `src/App.jsx` with**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function App() {
  useGSAP(() => {
    gsap.from('body', { opacity: 0, duration: 0.8, ease: 'power2.out' })
  })

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Verify**

Refresh `http://localhost:5173`. Page should fade in smoothly over ~0.8s.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add GSAP page load fade-in"
```

---

## Task 4: Update Nav

**Files:**
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/Nav.module.css`

- [ ] **Step 1: Replace `src/components/Nav.jsx` with**

```jsx
import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Nav.module.css'

const links = [
  { href: '#about', label: 'About', num: '01' },
  { href: '#projects', label: 'Projects', num: '02' },
  { href: '#skills', label: 'Skills', num: '03' },
  { href: '#contact', label: 'Contact', num: '04' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(() => {
    gsap.from(navRef.current.querySelectorAll('[data-nav-item]'), {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.5,
    })

    links.forEach(({ href }) => {
      const id = href.replace('#', '')
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(href),
        onEnterBack: () => setActive(href),
      })
    })
  }, { scope: navRef })

  return (
    <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo} data-nav-item>
          <span className={styles.logoAccent}>[</span>JBM<span className={styles.logoAccent}>]</span>
        </a>
        <ul className={styles.links}>
          {links.map(({ href, label, num }) => (
            <li key={href} data-nav-item>
              <a
                href={href}
                className={`${styles.link} ${active === href ? styles.active : ''}`}
              >
                <span className={styles.linkNum}>{num}.</span> {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Replace `src/components/Nav.module.css` with**

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.3s, border-color 0.3s;
  border-bottom: 1px solid transparent;
}

.nav.scrolled {
  background: rgba(30, 30, 46, 0.85);
  backdrop-filter: blur(16px);
  border-bottom-color: var(--border);
}

.inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.logo {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-bright);
  letter-spacing: -0.02em;
}

.logoAccent {
  color: var(--accent);
}

.links {
  list-style: none;
  display: flex;
  gap: 32px;
}

.link {
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: color 0.2s;
  font-weight: 400;
}

.linkNum {
  color: var(--accent);
  margin-right: 2px;
}

.link:hover,
.link.active {
  color: var(--accent);
}

@media (max-width: 480px) {
  .links { gap: 16px; }
  .linkNum { display: none; }
}
```

- [ ] **Step 3: Verify**

Reload and check: `[JBM]` logo in brackets, numbered nav links, links fade down on load, active section link turns mauve as you scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.jsx src/components/Nav.module.css
git commit -m "feat: update nav with numbered links, active tracking, and entrance animation"
```

---

## Task 5: Update Hero

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.module.css`

- [ ] **Step 1: Replace `src/components/Hero.jsx` with**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './Hero.module.css'

function SplitChars({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className={styles.char} aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const orbRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.6 })

    gsap.to(orbRef.current, {
      x: 80,
      y: 50,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    tl.from(containerRef.current.querySelector(`.${styles.greeting}`), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    })
    .from(containerRef.current.querySelectorAll(`.${styles.char}`), {
      opacity: 0,
      y: 40,
      stagger: 0.025,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2')
    .from(containerRef.current.querySelector(`.${styles.title}`), {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from(containerRef.current.querySelector(`.${styles.bio}`), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.3')
    .from(containerRef.current.querySelectorAll(`.${styles.ctas} a`), {
      opacity: 0,
      y: 16,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.2')
  }, { scope: containerRef })

  return (
    <section id="hero" className={styles.hero}>
      <div ref={orbRef} className={styles.orb} aria-hidden="true" />
      <div ref={containerRef} className={styles.content}>
        <p className={styles.greeting}>&gt;_ Hi, my name is</p>
        <h1>
          <SplitChars text="Jesus Bustillos-Molina." className={styles.name} />
        </h1>
        <h2 className={styles.title}>I secure systems and hunt threats.</h2>
        <p className={styles.bio}>
          Cybersecurity analyst with a BS in MIS from Kansas State University and
          an MS in Cybersecurity &amp; Information Assurance from WGU. ISC&sup2; CC
          certified, pursuing CompTIA CySA+ and PenTest+.
        </p>
        <div className={styles.ctas}>
          <a href="#projects" className={styles.ctaPrimary}>View my work</a>
          <a href="#contact" className={styles.ctaSecondary}>Get in touch</a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `src/components/Hero.module.css` with**

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.orb {
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(203, 166, 247, 0.18) 0%,
    rgba(137, 180, 250, 0.1) 45%,
    transparent 70%
  );
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
  filter: blur(70px);
  pointer-events: none;
  will-change: transform;
}

.content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  padding-top: 80px;
  position: relative;
  z-index: 1;
}

.greeting {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--accent);
  margin-bottom: 20px;
}

.name {
  display: block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text-bright);
  line-height: 1.05;
  margin-bottom: 8px;
}

.char {
  display: inline-block;
}

.title {
  font-size: clamp(1.8rem, 6vw, 3.5rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text-muted);
  line-height: 1.1;
  margin-bottom: 28px;
}

.bio {
  max-width: 540px;
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.85;
  margin-bottom: 48px;
}

.ctas {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.ctaPrimary,
.ctaSecondary {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 14px 28px;
  border-radius: 6px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.ctaPrimary {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--accent);
}

.ctaPrimary:hover {
  background: var(--accent);
  color: var(--bg);
  box-shadow: 0 0 24px rgba(203, 166, 247, 0.4);
}

.ctaSecondary {
  color: var(--text);
  border: 1px solid var(--border);
}

.ctaSecondary:hover {
  border-color: var(--text-muted);
  color: var(--text-bright);
}
```

- [ ] **Step 3: Verify**

Reload. Expect:
- Floating orb glow visible behind content
- `>_ Hi, my name is` greeting in mauve
- Name animates in letter by letter
- Title, bio, and CTAs fade up in sequence
- CTA hover glows mauve

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.module.css
git commit -m "feat: add hero animations, orb background, and terminal prompt"
```

---

## Task 6: Update About

**Files:**
- Modify: `src/components/About.jsx`
- Modify: `src/components/About.module.css`

- [ ] **Step 1: Replace `src/components/About.jsx` with**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="about" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow" data-reveal>// about me</p>
        <h2 className="section-heading" data-reveal>
          Who I am<span className={styles.cursor} aria-hidden="true" />
        </h2>
        <div className={styles.grid}>
          <div className={styles.text} data-reveal>
            <p>
              Hello! I&rsquo;m Jesus, a cybersecurity analyst passionate about
              protecting systems, investigating threats, and making digital environments
              safer. I hold a BS in Management Information Systems from Kansas State
              University and an MS in Cybersecurity &amp; Information Assurance from
              Western Governors University.
            </p>
            <p>
              I&rsquo;m ISC&sup2; CC certified and actively working toward CompTIA
              CySA+ and PenTest+. My background blends business and technology through
              MIS, grounded in the deep security focus of my graduate program.
            </p>
            <p>
              I&rsquo;m always looking for new challenges — whether that&rsquo;s
              analyzing an incident, sharpening offensive skills in a lab, or
              exploring emerging threats in the security landscape.
            </p>
          </div>
          <div className={styles.avatarWrap} data-reveal>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>JBM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `src/components/About.module.css` with**

```css
.grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 60px;
  align-items: start;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.9;
}

.cursor {
  display: inline-block;
  width: 3px;
  height: 1em;
  background: var(--accent);
  margin-left: 6px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.avatarWrap {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  border: 1px solid var(--accent);
  background: var(--bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 32px rgba(203, 166, 247, 0.12);
  transition: box-shadow 0.3s;
}

.avatar:hover {
  box-shadow: 0 0 48px rgba(203, 166, 247, 0.25);
}

.avatarInitials {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.05em;
}

@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
  .avatarWrap { order: -1; }
  .avatar { width: 140px; height: 140px; }
}
```

- [ ] **Step 3: Verify**

Scroll to About. Expect: content fades up in sequence, blinking cursor after heading, avatar glows on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.jsx src/components/About.module.css
git commit -m "feat: add about section scroll reveal and blinking cursor"
```

---

## Task 7: Update Projects

**Files:**
- Modify: `src/components/Projects.jsx`
- Modify: `src/components/Projects.module.css`

- [ ] **Step 1: Replace `src/components/Projects.jsx` with**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.css'

const projects = [
  {
    title: 'Home SOC Lab',
    description:
      'Personal security operations lab for practicing threat detection, log analysis, and incident response using a SIEM and intentionally vulnerable machines.',
    tags: ['Splunk', 'VirtualBox', 'Kali Linux'],
    github: '#',
    live: null,
  },
  {
    title: 'Vulnerability Assessment Report',
    description:
      'Conducted a full vulnerability assessment on a target environment — enumeration, scanning, risk scoring, and a written remediation report following NIST guidelines.',
    tags: ['Nmap', 'Nessus', 'NIST CSF'],
    github: '#',
    live: null,
  },
  {
    title: 'Threat Hunting Playbook',
    description:
      'Developed detection rules and a structured playbook for hunting common adversary techniques mapped to MITRE ATT&CK, implemented in a SIEM environment.',
    tags: ['MITRE ATT&CK', 'Splunk', 'Python'],
    github: '#',
    live: null,
  },
]

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Projects() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelector('.section-eyebrow'), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
    gsap.from(sectionRef.current.querySelector('.section-heading'), {
      opacity: 0,
      y: 24,
      duration: 0.5,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
    gsap.from(sectionRef.current.querySelectorAll('article'), {
      opacity: 0,
      y: 48,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef })

  return (
    <section id="projects" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow">// projects</p>
        <h2 className="section-heading">Things I&rsquo;ve built</h2>
        <div className={styles.grid}>
          {projects.map((p) => (
            <article key={p.title} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <div className={styles.cardLinks}>
                  <a href={p.github} className={styles.iconLink} aria-label="GitHub repo">
                    <GitHubIcon />
                  </a>
                  {p.live && (
                    <a href={p.live} className={styles.iconLink} aria-label="Live demo">
                      <ExternalIcon />
                    </a>
                  )}
                </div>
              </div>
              <p className={styles.cardDesc}>{p.description}</p>
              <ul className={styles.tags}>
                {p.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `src/components/Projects.module.css` with**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  backdrop-filter: blur(8px);
}

.card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 32px rgba(203, 166, 247, 0.15);
  transform: translateY(-6px);
}

.cardTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.cardTitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-bright);
  letter-spacing: -0.01em;
}

.cardLinks {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.iconLink {
  color: var(--text-muted);
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.iconLink:hover {
  color: var(--accent);
}

.cardDesc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.8;
  flex: 1;
}

.tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  background: var(--accent-dim);
  padding: 3px 10px;
  border-radius: 20px;
}
```

- [ ] **Step 3: Verify**

Scroll to Projects. Expect: eyebrow and heading fade in, cards stagger up, hover lifts card with mauve glow.

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.jsx src/components/Projects.module.css
git commit -m "feat: add project cards stagger animation and glow hover"
```

---

## Task 8: Update Skills

**Files:**
- Modify: `src/components/Skills.jsx`
- Modify: `src/components/Skills.module.css`

- [ ] **Step 1: Replace `src/components/Skills.jsx` with**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Skills.module.css'

const categories = [
  {
    name: 'Security Tools',
    items: ['Wireshark', 'Nmap', 'Burp Suite', 'Metasploit'],
  },
  {
    name: 'SIEM & Monitoring',
    items: ['Splunk', 'Microsoft Sentinel', 'ELK Stack', 'Chronicle'],
  },
  {
    name: 'Frameworks',
    items: ['NIST CSF', 'MITRE ATT&CK', 'ISO 27001', 'OWASP'],
  },
  {
    name: 'Scripting & OS',
    items: ['Python', 'PowerShell', 'Bash', 'Linux / Windows'],
  },
]

export default function Skills() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 32,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="skills" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow" data-reveal>// skills</p>
        <h2 className="section-heading" data-reveal>Tools &amp; Technologies</h2>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <div key={cat.name} className={styles.category} data-reveal>
              <h3 className={styles.catName}>{cat.name}</h3>
              <ul className={styles.list}>
                {cat.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.bullet} aria-hidden="true">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `src/components/Skills.module.css` with**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.category {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 28px;
  transition: border-color 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(8px);
}

.category:hover {
  border-color: var(--accent-2);
  box-shadow: 0 0 24px rgba(137, 180, 250, 0.12);
}

.catName {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  font-size: 0.875rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}

.item:hover {
  color: var(--text);
}

.bullet {
  color: var(--accent-2);
  font-size: 0.65rem;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Verify**

Scroll to Skills. Expect: categories wave-stagger in, hover glows blue.

- [ ] **Step 4: Commit**

```bash
git add src/components/Skills.jsx src/components/Skills.module.css
git commit -m "feat: add skills wave stagger animation"
```

---

## Task 9: Update Contact

**Files:**
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Contact.module.css`

- [ ] **Step 1: Replace `src/components/Contact.jsx` with**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  )
}

export default function Contact() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 32,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="contact" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow" data-reveal>// contact</p>
        <div className={styles.content}>
          <h2 className={styles.heading} data-reveal>Get in touch</h2>
          <p className={styles.body} data-reveal>
            I&rsquo;m currently open to new opportunities. Whether you have a question,
            a project idea, or just want to say hi — my inbox is always open.
          </p>
          <a href="mailto:jesusd18292@gmail.com" className={styles.emailBtn} data-reveal>
            Say hello
          </a>
          <div className={styles.socials} data-reveal>
            <a href="https://github.com/JesusMBM" className={styles.socialLink} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
            </a>
            <a href="https://linkedin.com/in/your-profile" className={styles.socialLink} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon />
            </a>
            <a href="mailto:jesusd18292@gmail.com" className={styles.socialLink} aria-label="Email">
              <EmailIcon />
            </a>
          </div>
        </div>
        <footer className={styles.footer} data-reveal>
          <p>Designed &amp; built by Jesus Bustillos-Molina</p>
        </footer>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `src/components/Contact.module.css` with**

```css
.content {
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.heading {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text-bright);
  margin-bottom: 20px;
}

.body {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.9;
  margin-bottom: 40px;
}

.emailBtn {
  display: inline-block;
  padding: 16px 36px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.25s;
  margin-bottom: 48px;
}

.emailBtn:hover {
  background: var(--accent);
  color: var(--bg);
  box-shadow: 0 0 32px rgba(203, 166, 247, 0.4);
}

.socials {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.socialLink {
  color: var(--text-muted);
  transition: color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
}

.socialLink:hover {
  color: var(--accent);
  transform: translateY(-3px);
}

.footer {
  text-align: center;
  margin-top: 80px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}
```

- [ ] **Step 3: Verify**

Scroll to Contact. Expect: elements reveal sequentially, email button glows mauve on hover, social icons lift on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.jsx src/components/Contact.module.css
git commit -m "feat: add contact section sequential reveal and glow CTA"
```

---

## Task 10: Final smoke test and push

- [ ] **Step 1: Run full dev build check**

```bash
npm run build
```

Expected: build completes with no errors, output in `dist/`.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173` and verify:
- Page fades in on load
- Nav has `[JBM]`, numbered links, slide-down entrance
- Hero shows `>_` prompt, name animates letter by letter, orb glows in background
- All sections reveal smoothly as you scroll
- Cards glow on hover
- Blinking cursor on About heading
- Custom mauve scrollbar visible
- Dot grid pattern visible on background
- Text selection color is mauve

- [ ] **Step 3: Push**

```bash
git push
```
