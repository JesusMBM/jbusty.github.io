---
name: verify-jbusty
description: Drive the jbusty portfolio live GitHub Pages web UI at https://jesusmbm.github.io/jbusty.github.io/ to prove identity, hero/nav, Approach statement, work cards, about, and contact. Use when verifying the published site, capturing dump-dom/screenshots, or checking App.jsx selectors.
---

# Verify jbusty (live GitHub Pages)

Agent-facing control skill for the published Jesus Bustillos-Molina portfolio. The live surface is the Vite+React SPA in src/App.jsx, served at https://jesusmbm.github.io/jbusty.github.io/ (base path /jbusty.github.io/). Index.html is a shell; identity lives in the rendered DOM.

This skill drives the shared public Pages instance only.

Leftover unused files in src/components/ describe an old design. Do not treat those files as the live UI.

Doctor fails if dump-dom shows leftover component identity (element id hero, projects, skills) instead of App.jsx.

A package.json script named dev (vite) exists but this skill does not start a local server. Never mutate the shared instance.

Helper (executable): .cursor/skills/verify-jbusty/control-jbusty.mjs

Always one JSON object on stdout (except --help). Exit 0 on success, non-zero on failure. Chrome stderr is written under the evidence dir, never discarded.

## Launch

There is no local instance to start. Launch means: use the live URL.

- URL: https://jesusmbm.github.io/jbusty.github.io/ (trailing slash required)
- Ready: node control-jbusty.mjs doctor from this skill directory reports ok true
- Teardown: nothing to kill. Headless chrome is one-shot per command (timeout 30000 ms). If dump-dom hangs past that, cleanup signals only pids this run recorded.

```
cd .cursor/skills/verify-jbusty
node control-jbusty.mjs doctor
```

Shared instance: never activate mailto, never follow the six project cards to other origins.

## Doctor

Read-only. Run first whenever anything looks off.

```
node control-jbusty.mjs doctor
```

Checks:

1. HTTP GET of the live URL returns 200
2. Chrome dump-dom of the same URL
3. Identity markers present: .skip-link (href #main-content, text "Skip to main content"), #main-content, #top, #work, #about, #contact, brand aria-label "Jesus Bustillos-Molina, home", h1 contains "I find the signal"
4. Fail if dump-dom is leftover-component identity (id="hero", #projects, #skills) instead of App.jsx. id="top" with class hero is the live hero; id="hero" is not.

JSON fields: ok, url, status, title, markers.found, markers.missing, chromeVersion. Non-zero exit if ok is false.

## Drive

Stable handles from live App.jsx (not leftover components):

- a.skip-link — href #main-content, text Skip to main content
- a.brand — href #top, aria-label Jesus Bustillos-Molina, home, visible text JBM with a degree mark
- button.menu-toggle — aria-controls nav-links, aria-label Open/Close navigation menu, text Menu/Close, aria-expanded
- nav#nav-links — aria-label Primary navigation; Work #work, About #about, Contact #contact
- main#main-content — page landmark
- section#top.hero — kicker "AI systems · cybersecurity"; h1 "I find the signal inside the noise."; availability "Available for AI systems and AI security work"; hero-footer "I design agent systems..."; a.circle-link href #work aria-label "Explore selected work"
- section.statement — no id; section-index "01 / Approach"; copy "An agent is not a model" / "paying close attention". Snapshot only (do not invent #approach).
- section#work — section-index "02 / Personal research"; heading "Questions explored through visual research."; six a.project cards, new tab
- section#about — section-index "03 / Profile"; "Curious by nature. Methodical by practice."; name; Textron Aviation; mailto jbustillosmolina@gmail.com "Start a conversation"; capabilities Build / Evaluate / Secure / Investigate
- section#contact — "Open to AI systems work"; Let's talk mailto; footer copyright year; GitHub https://github.com/JesusMBM; LinkedIn https://www.linkedin.com/in/jesus-bm/; Back to top href #top

Commands (from the skill directory):

```
node control-jbusty.mjs doctor
node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/snapshot.html
node control-jbusty.mjs screenshot --path /tmp/verify-jbusty-evidence/screenshot.png
node control-jbusty.mjs goto --url '#work'
node control-jbusty.mjs goto --url '#about' --path /tmp/verify-jbusty-evidence/about.png
```

goto resolves hashes against the live base (`goto --url '#work'` or `goto work`). Quote `#work` in the shell; unquoted `#` is a comment. It dump-doms and confirms the target id exists. It refuses other origins (the six Netlify project URLs). The Approach block has no id — use snapshot, not goto.

The click command on live Pages always returns {ok:false, error:"click refused on live"} and exit 2. Do not activate menu, mailto, or project cards.

--url before the command overrides the live base. --dry-run prints planned chrome argv and URL without launching chrome.

## Evidence

Named directory: /tmp/verify-jbusty-evidence/ (override with $VERIFY_JBUSTY_EVIDENCE). Created automatically. Default snapshot/screenshot names land there if --path is omitted.

Proof standards:

- Exercise the real user path: live Pages in headless Chrome, not leftover component files, not a local Vite server, not internal setters.
- Capture the action and the resulting state: dump-dom / snapshot extract plus screenshot, not only a final PNG.
- Identity must match App.jsx markers above. A screenshot without those ids in dump-dom is not proof.
- This SPA is static. Proof is DOM contents (titles, hrefs, aria-labels) and PNG bytes. Mailto and outbound project tabs are asserted in the snapshot, never opened.
- Mocks: none. Public static site.
- --dry-run must not launch chrome. Confirm by observing no new chrome pid and no new dump-dom file.

Evidence survives cleanup. Do not delete this directory.

## Cleanup

```
node control-jbusty.mjs cleanup
```

Signals only chrome pids this CLI recorded for the run. Headless chrome is one-shot and should already be gone. Never match-kill by process name. Never delete /tmp/verify-jbusty-evidence/ or $VERIFY_JBUSTY_EVIDENCE.

## Helpers

Run from .cursor/skills/verify-jbusty/:

```
node control-jbusty.mjs --help
node control-jbusty.mjs --dry-run doctor
node control-jbusty.mjs doctor
node control-jbusty.mjs --dry-run snapshot --path /tmp/verify-jbusty-evidence/snapshot.html
node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/snapshot.html
node control-jbusty.mjs screenshot --path /tmp/verify-jbusty-evidence/screenshot.png
node control-jbusty.mjs goto --url '#work'
node control-jbusty.mjs --dry-run click .menu-toggle
node control-jbusty.mjs click .menu-toggle
node control-jbusty.mjs cleanup
```

Chrome binary: /usr/bin/google-chrome (override CHROME_PATH). Required flags: --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --timeout=30000 --virtual-time-budget=8000. Screenshot window 1280x800. Stderr always captured to a file under the evidence dir.

Feature map: features/ (hero-nav, approach-statement, work-research, about-profile, contact-footer). Drive one mapped feature end-to-end after doctor; the map lists the rest.
