---
name: verify-jbusty
description: Drive the jbusty portfolio live GitHub Pages web UI at https://jesusmbm.github.io/jbusty.github.io/ to prove the redesigned identity (title, skip link, JBM wordmark, Research/About/Contact nav, "AI systems, examined closely." hero), the seven research cards, about, and contact. Use when verifying the published site, capturing dump-dom/screenshots, or checking App.jsx selectors.
---

# Verify jbusty (live GitHub Pages)

Agent-facing control skill for the published Jesus Bustillos-Molina portfolio. The live surface is the Vite+React SPA in src/App.jsx (cards from src/projects.js), served at https://jesusmbm.github.io/jbusty.github.io/ (base path /jbusty.github.io/). index.html is a shell that sets the title; identity lives in the rendered DOM.

This skill drives the shared public Pages instance only.

Leftover unused files in src/components/ (Hero, Nav, Projects, Skills, ...) describe an old design. Do not treat those files as the live UI. The pre-redesign App.jsx (#main-content, "I find the signal", #approach statement, Netlify project cards) is also gone.

Doctor fails if dump-dom shows any old identity: leftover component ids (hero, projects, skills), or pre-redesign markers (main-content, approach, "I find the signal", jbm-*.netlify.app card hrefs).

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

Shared instance: never activate mailto, never follow the seven research cards (same-origin /jbusty.github.io/research/... and /honeyquest/), never follow GitHub or LinkedIn.

## Doctor

Read-only. Run first whenever anything looks off.

```
node control-jbusty.mjs doctor
```

Checks:

1. HTTP GET of the live URL returns 200
2. Chrome dump-dom of the same URL
3. Identity markers present (markers.found ids in parentheses):
   - (title) title is exactly "Jesus Bustillos-Molina — AI Systems / Cybersecurity"
   - (skip-link) a.skip-link href #main, text "Skip to content"
   - (#main) main#main
   - (#top, #work, #about, #contact) section ids
   - (wordmark-aria-label) a.wordmark href #top, aria-label "Jesus Bustillos-Molina home"
   - (primary-nav) nav#navigation aria-label "Primary" containing #work, #about, #contact
   - (h1-examined-closely) h1 text "AI systems, examined closely."
   - (research-cards-7) exactly seven a.research-card with the expected title + href + target _blank (see features/work-research.md)
   - (contact-mailto) mailto:jbustillosmolina@gmail.com
4. Fail if any old identity is present (oldIdentity array): old-#hero-id, old-#projects, old-#skills, old-threat-hunt-copy, old-#main-content, old-#approach, old-signal-h1, old-netlify-cards.

JSON fields: ok, url, status, title, markers.found, markers.missing, researchCards.count, researchCards.missing, chromeVersion; oldIdentity, error and dumpPath on failure. Non-zero exit if ok is false. The failing dump is written to doctor.dump.html in the evidence dir.

## Drive

Stable handles from live App.jsx (not leftover components):

- a.skip-link — href #main, text "Skip to content"
- a.wordmark — href #top, aria-label "Jesus Bustillos-Molina home", visible text "JBM / Independent research"
- button.menu-button — aria-controls navigation, aria-expanded, text Menu/Close (visible only under 640px)
- nav#navigation.navigation — aria-label "Primary"; Research #work, About #about, Contact #contact
- main#main — page landmark
- section#top.hero — eyebrow "Jesus Bustillos-Molina"; h1 "AI systems, examined closely."; hero-description "I build and study AI agents..."; a.button.primary "Explore research" href #work; a.button "Get in touch" href #contact; figure.system-map "01 / How an AI agent works" (Information → AI agent → Tools, Checks); hero-baseline "AI systems / AI security / Cybersecurity" and "Wichita, Kansas"
- section#work.research — eyebrow "01 / Selected research"; h2 "Understand the systems you use."; seven a.research-card (first is .featured), all new tab, all same-origin
- section#about.about — eyebrow "02 / About"; h2 "Curiosity, with a security mindset."; Textron Aviation; dl.credentials (Education, Continuing study, Certification); capabilities Build / Check / Protect / Investigate
- section#contact.contact — eyebrow "03 / Contact"; h2 "Something worth figuring out?"; "Let’s talk" mailto; footer copyright year; GitHub https://github.com/JesusMBM; LinkedIn https://www.linkedin.com/in/jesus-bm/; Back to top href #top

Commands (from the skill directory):

```
node control-jbusty.mjs doctor
node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/snapshot.html
node control-jbusty.mjs screenshot --path /tmp/verify-jbusty-evidence/screenshot.png
node control-jbusty.mjs goto --url '#work'
node control-jbusty.mjs goto --url '#about' --path /tmp/verify-jbusty-evidence/about.png
```

goto resolves hashes against the live base (`goto --url '#work'` or `goto work`). Quote `#work` in the shell; unquoted `#` is a comment. It dump-doms and confirms the target id exists. It refuses other origins (GitHub, LinkedIn) and same-origin paths other than the SPA home, such as /jbusty.github.io/research/jbm-agent-architecture/ and /honeyquest/.

snapshot writes the HTML plus a sibling .extract.txt with TITLE, IDS, HEADINGS, EYEBROWS, RESEARCH CARDS (title -> href [target]) and LINKS.

The click command on live Pages always returns {ok:false, error:"click refused on live"} and exit 2. Do not activate menu, mailto, or research cards.

--url before the command overrides the live base. --dry-run prints planned chrome argv and URL without launching chrome.

## Evidence

Named directory: /tmp/verify-jbusty-evidence/ (override with $VERIFY_JBUSTY_EVIDENCE). Created automatically. Default snapshot/screenshot names land there if --path is omitted.

Proof standards:

- Exercise the real user path: live Pages in headless Chrome, not leftover component files, not a local Vite server, not internal setters.
- Capture the action and the resulting state: dump-dom / snapshot extract plus screenshot, not only a final PNG.
- Identity must match the App.jsx markers above. A screenshot without those ids in dump-dom is not proof.
- This SPA is static. Proof is DOM contents (titles, hrefs, aria-labels) and PNG bytes. Mailto, research, and social tabs are asserted in the snapshot, never opened.
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
node control-jbusty.mjs --dry-run click .menu-button
node control-jbusty.mjs click .menu-button
node control-jbusty.mjs cleanup
```

Chrome binary: /usr/bin/google-chrome (override CHROME_PATH). Required flags: --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --timeout=30000 --virtual-time-budget=8000. Screenshot window 1280x800. Stderr always captured to a file under the evidence dir.

Feature map: features/ (hero-nav, work-research, about-profile, contact-footer). Drive one mapped feature end-to-end after doctor; the map lists the rest.
