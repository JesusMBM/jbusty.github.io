---
name: verify-jbusty
description: Drive Jesus Bustillos-Molina's portfolio (jbusty.github.io) the way a visitor does: live GitHub Pages or local Vite, via control-jbusty.mjs. Use to prove homepage, nav, work cards, about, and contact actually render.
---

# Verify jbusty

Agent-facing control skill for the live portfolio at https://jesusmbm.github.io/jbusty.github.io/ (Vite base `/jbusty.github.io/`). The page is a React 19 SPA: index.html is a shell; the real UI hydrates in the browser. Drive the rendered DOM, not the shell.

Default verification target is LIVE GitHub Pages (what recruiters see). Use launch / JBUSTY_MODE=local only when proving an unreleased branch.

Helper binary (executable): `.cursor/skills/verify-jbusty/control-jbusty.mjs`

JSON on stdout. Errors on stderr with the next action. Never kill chrome or node by process name.

## Launch

Live (default — no server to start):

```bash
node .cursor/skills/verify-jbusty/control-jbusty.mjs info
node .cursor/skills/verify-jbusty/control-jbusty.mjs doctor
```

Ready when doctor JSON has ok true, httpStatus 200, and checks for title, hero h1, work card, and nav Work/About/Contact.

Local (unreleased branch only). Set JBUSTY_MODE=local and run control-jbusty.mjs launch, then wait-settle.
launch installs deps and starts Vite on 127.0.0.1 port 4173 with --strictPort from the jbusty-portfolio package root.
Local URL is http://127.0.0.1:4173/jbusty.github.io/
Pid and port are written to /tmp/jbusty-verify-$RUN_ID.

Teardown: JBUSTY_MODE=local control-jbusty.mjs stop
stop kills only the recorded pid. Evidence in /tmp/jbusty-verify-evidence-$RUN_ID/ is left in place.

## Doctor

Read-only health check. Run this first whenever anything looks off.

    node .cursor/skills/verify-jbusty/control-jbusty.mjs doctor

Requires HTTP 200, title containing Jesus Bustillos-Molina, rendered DOM containing "I find the signal" AND "AI Agent Architecture" AND nav Work/About/Contact.
Reports url, mode (live|local), httpStatus, title, checks[]. Non-zero exit if any check fails.

    node .cursor/skills/verify-jbusty/control-jbusty.mjs wait-settle

Retries until dump-dom contains the hero h1 text.

## Drive

Stable handles: a.skip-link (#main-content), a.brand (#top, aria-label Jesus Bustillos-Molina, home), button.menu-toggle (aria-controls nav-links), nav#nav-links (Work #work, About #about, Contact #contact), section#top hero, a.project work cards (six, new tabs), section#about, section#contact.

Read-only against live Pages (preferred):

    node .cursor/skills/verify-jbusty/control-jbusty.mjs snapshot
    node .cursor/skills/verify-jbusty/control-jbusty.mjs screenshot /tmp/jbusty-verify-evidence-$RUN_ID/home.png
    node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #work /tmp/jbusty-verify-evidence-$RUN_ID/work.png
    node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #about /tmp/jbusty-verify-evidence-$RUN_ID/about.png
    node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #contact /tmp/jbusty-verify-evidence-$RUN_ID/contact.png
    node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #top /tmp/jbusty-verify-evidence-$RUN_ID/top.png

Mutating actions (click, eval) are refused on live production. They only run against a local instance this CLI launched:

    JBUSTY_MODE=local node .cursor/skills/verify-jbusty/control-jbusty.mjs --dry-run click .menu-toggle
    JBUSTY_MODE=local node .cursor/skills/verify-jbusty/control-jbusty.mjs click .menu-toggle
    JBUSTY_MODE=local node .cursor/skills/verify-jbusty/control-jbusty.mjs snapshot

--dry-run prints side-effecting actions (click, eval, launch, stop) without doing them.
Hashes a visitor uses: #top #work #about #contact (skip target #main-content).

## Evidence

Directory: /tmp/jbusty-verify-evidence-$RUN_ID/ (env JBUSTY_RUN_ID, default proof). This directory MUST survive cleanup.

Proof standards: real user path (Pages or local Vite), not internal setters; capture the action AND the resulting state; screenshots (1280x800 PNG) plus snapshot JSON (headings, links, aria-labels, landmarks). No mocks — public static SPA.

Homepage proof artifacts: home.png (live hero), work.png (after goto #work; dump-dom or snapshot must include AI Agent Architecture), snapshot.json.

## Cleanup

    JBUSTY_MODE=local JBUSTY_RUN_ID=$RUN_ID node .cursor/skills/verify-jbusty/control-jbusty.mjs stop

Kills only the pid in /tmp/jbusty-verify-$RUN_ID. Headless Chrome children used for dump-dom/screenshot exit when the command finishes. If one is stranded, kill that pid from the command output — never pkill chrome or pkill node.
Do not delete /tmp/jbusty-verify-evidence-$RUN_ID/.

## Helpers

    node .cursor/skills/verify-jbusty/control-jbusty.mjs --help
    node .cursor/skills/verify-jbusty/control-jbusty.mjs doctor --help
    node .cursor/skills/verify-jbusty/control-jbusty.mjs info

Env: JBUSTY_URL overrides target (default live https://jesusmbm.github.io/jbusty.github.io/). JBUSTY_MODE=live|local (default live). CHROME_PATH defaults to /usr/bin/google-chrome. JBUSTY_ROOT is the checkout for launch.

Chrome recipes used by the helper (no extra browser deps): dump-dom with --headless --disable-gpu --no-sandbox --virtual-time-budget=8000; screenshot with --window-size=1280,800.

Feature map: .cursor/skills/verify-jbusty/features/ (hero-nav, work-research, about-profile, contact-footer). Keep it honest with /maintain-verification-skill.
