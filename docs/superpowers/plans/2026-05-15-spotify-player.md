# Spotify Player Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed, collapsible Spotify iframe embed widget to the bottom-right corner of the portfolio site.

**Architecture:** Two new files (`SpotifyPlayer.jsx` + `SpotifyPlayer.module.css`) plus one line added to `App.jsx`. All elements stay in the DOM always; GSAP manages show/hide so refs remain stable. The iframe loads once on page mount (acceptable for a portfolio).

**Tech Stack:** React 19, GSAP 3 + @gsap/react, CSS Modules, Spotify embed iframe (no auth/backend)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/SpotifyPlayer.jsx` | Create | Component state, GSAP animations, iframe |
| `src/components/SpotifyPlayer.module.css` | Create | Fixed positioning, card, toggle button, eq-bar animation |
| `src/App.jsx` | Modify | Import and render `<SpotifyPlayer />` |

---

### Task 1: SpotifyPlayer styles

**Files:**
- Create: `src/components/SpotifyPlayer.module.css`

- [ ] **Step 1: Create the CSS file**

```css
.wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  width: 300px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 1.1rem;
  line-height: 1;
  padding: 2px 6px;
  z-index: 1;
  transition: color 0.15s;
}

.close:hover {
  color: var(--text-bright);
}

.toggle {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.toggle:hover {
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(203, 166, 247, 0.3);
}

.eqBars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 16px;
}

.bar {
  width: 3px;
  background: var(--accent);
  border-radius: 2px;
  animation: eq 0.8s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.15s);
}

@keyframes eq {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls src/components/SpotifyPlayer.module.css
```

Expected: file listed

---

### Task 2: SpotifyPlayer component

**Files:**
- Create: `src/components/SpotifyPlayer.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './SpotifyPlayer.module.css'

const EMBED_URL =
  'https://open.spotify.com/embed/playlist/4FuLyaBxcwkCWC6o53J6FR?utm_source=generator&theme=0'

function EqBars() {
  return (
    <div className={styles.eqBars} aria-hidden="true">
      <span className={styles.bar} style={{ '--i': 0 }} />
      <span className={styles.bar} style={{ '--i': 1 }} />
      <span className={styles.bar} style={{ '--i': 2 }} />
    </div>
  )
}

export default function SpotifyPlayer() {
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const buttonRef = useRef(null)

  useGSAP(() => {
    gsap.set(cardRef.current, {
      scaleY: 0,
      opacity: 0,
      pointerEvents: 'none',
      transformOrigin: 'bottom right',
    })
    gsap.from(buttonRef.current, {
      x: 80,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 2,
    })
  }, { scope: wrapperRef })

  const handleOpen = () => {
    gsap.to(buttonRef.current, { opacity: 0, scale: 0.8, duration: 0.2 })
    gsap.to(cardRef.current, {
      scaleY: 1,
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.35,
      ease: 'back.out(1.4)',
      transformOrigin: 'bottom right',
    })
  }

  const handleClose = () => {
    gsap.to(cardRef.current, {
      scaleY: 0,
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.25,
      ease: 'power2.in',
      transformOrigin: 'bottom right',
    })
    gsap.to(buttonRef.current, { opacity: 1, scale: 1, duration: 0.3, delay: 0.15 })
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={cardRef} className={styles.card}>
        <button onClick={handleClose} className={styles.close} aria-label="Close player">
          ×
        </button>
        <iframe
          src={EMBED_URL}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify playlist"
        />
      </div>
      <button
        ref={buttonRef}
        className={styles.toggle}
        onClick={handleOpen}
        aria-label="Open Spotify player"
      >
        <EqBars />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls src/components/SpotifyPlayer.jsx
```

Expected: file listed

---

### Task 3: Wire into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the import**

In `src/App.jsx`, after the `import Cursor` line, add:

```jsx
import SpotifyPlayer from './components/SpotifyPlayer'
```

- [ ] **Step 2: Render the component**

In the JSX return, after `<Cursor />`, add `<SpotifyPlayer />`:

```jsx
export default function App() {
  return (
    <>
      <Cursor />
      <SpotifyPlayer />
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

- [ ] **Step 3: Run the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser and verify:

1. After ~2 seconds, a pill button with three pulsing bars slides in from the bottom-right
2. Clicking the button: pill fades out, card expands from bottom-right with the Spotify iframe
3. Clicking `×`: card collapses back, pill fades back in
4. The widget is visible in all sections as you scroll

- [ ] **Step 4: Commit**

```bash
git add src/components/SpotifyPlayer.jsx src/components/SpotifyPlayer.module.css src/App.jsx
git commit -m "feat: add collapsible Spotify mini-player widget"
```

- [ ] **Step 5: Push to GitHub**

```bash
git push origin main
```

Expected: GitHub Actions deploy workflow triggers automatically.
