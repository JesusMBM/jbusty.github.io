---
name: verify-jbusty
description: Drive and prove the jbusty.github.io portfolio (React 19 + Vite 8 SPA on GitHub Pages) the way a user does — skip link, nav, hero, work, about, contact — via control-jbusty.mjs against live Pages or a local vite preview.
---

# Verify jbusty.github.io

Project-local verification skill for [https://jesusmbm.github.io/jbusty.github.io/](https://jesusmbm.github.io/jbusty.github.io/). The site is a single-page React 19 + Vite 8 app (`base: /jbusty.github.io/`). Agents read this cold: drive the real UI, do not edit `src/` product code, do not click live production.

Default mode is **live Pages**. Local preview is optional.

## Launch

Live (default, no server to start):

```bash
export JBUSTY_MODE=live
export JBUSTY_URL=https://jesusmbm.github.io/jbusty.github.io/
# Ready when: node control-jbusty.mjs doctor exits 0
```

Local preview (only from a jbusty-portfolio checkout; this skill must not git clone):

```bash
export JBUSTY_MODE=local
export JBUSTY_ROOT=/path/to/jbusty.github.io   # optional if cwd is the repo
node .cursor/skills/verify-jbusty/control-jbusty.mjs launch
# Serves http://127.0.0.1:4173/jbusty.github.io/  (vite preview, pid file)
# Ready when: doctor against that URL exits 0
```

Teardown local only:

```bash
node .cursor/skills/verify-jbusty/control-jbusty.mjs stop
# kills ONLY the pid written by launch; never pkill chrome/vite by name
```

`--dry-run` on `launch` / `stop` / `click` prints JSON of what would happen and does not start or kill anything.

## Doctor

Read-only. Run first whenever anything looks off.

```bash
cd .cursor/skills/verify-jbusty
node control-jbusty.mjs doctor
```

Pass means:

- HTTP 200 on `JBUSTY_URL`
- `<title>` contains `Jesus Bustillos-Molina`
- headless dump-dom contains `I find the signal` AND `AI Agent Architecture` AND `Work` / `About` / `Contact`

JSON on stdout. Failures go to stderr with what to do instead, non-zero exit.

Chrome must use an isolated `--user-data-dir` (the CLI does). Reusing a logged-in desktop profile hangs dump-dom.

## Drive

Harness: `control-jbusty.mjs` (Node, JSON default). Chrome: `/usr/bin/google-chrome`.

Stable handles (prefer these over coordinates):

| Handle | Selector / target |
| --- | --- |
| Skip link | `a.skip-link` `href=#main-content` |
| Brand | `a.brand` `href=#top` aria-label `Jesus Bustillos-Molina, home` |
| Menu | `button.menu-toggle` `aria-controls=nav-links` |
| Nav | `#nav-links` links Work `#work`, About `#about`, Contact `#contact` |
| Hero | `#top` — "Available for AI systems and AI security work", kicker `AI SYSTEMS / CYBERSECURITY`, h1 `I find the signal inside the noise.` |
| Work | `#work` — six `a.project` cards (see features/work-research.md) |
| About | `#about` — "Curious by nature. Methodical by practice.", mailto `jbustillosmolina@gmail.com`, capabilities Build / Evaluate / Secure / Investigate |
| Contact | `#contact` — mailto, GitHub `https://github.com/JesusMBM`, LinkedIn `https://www.linkedin.com/in/jesus-bm/`, Back to top `#top` |

Commands:

```bash
node control-jbusty.mjs info
node control-jbusty.mjs snapshot
node control-jbusty.mjs screenshot /tmp/jbusty-verify-evidence-proof/home.png
node control-jbusty.mjs goto work          # also #work, about, contact, top
node control-jbusty.mjs wait-settle
node control-jbusty.mjs click 'button.menu-toggle' --dry-run
```

`click` **refuses** when `JBUSTY_MODE=live` or the URL is GitHub Pages. Use `goto HASH` for in-page nav on production.

## Evidence

Proof lives **outside** chrome user-data dirs so it survives child-process cleanup:

- Requested screenshot PATH (caller-owned)
- Copy: `/tmp/jbusty-verify-evidence-proof/` (`JBUSTY_EVIDENCE_DIR`)
- Optional durable copy: `/workspace/jbusty-verify-proof/`

Standards:

- Exercise the real user path (hash nav, rendered DOM), not internal React setters.
- Capture the action and the resulting state (`goto work` + screenshot + snapshot landmarks).
- Title is `Jesus Bustillos-Molina — AI Systems / Cybersecurity`.
- Mocks are not used; live Pages or local preview is the app.
- `--dry-run` must not spawn chrome, vite, or kill a pid — confirm by observing no new pid file / no new PNG.

## Cleanup

- `stop` kills only the launch pid file process.
- Chrome invocations use a temp `--user-data-dir` that is deleted after the shot/dump. That cleanup must not touch evidence paths.
- After cleanup, confirm PNGs still exist at the named PATH and under `/tmp/jbusty-verify-evidence-proof/`.

## Helpers

`control-jbusty.mjs` is executable via `node` (run from this directory):

```bash
cd .cursor/skills/verify-jbusty
node control-jbusty.mjs --help
node control-jbusty.mjs doctor
node control-jbusty.mjs snapshot
node control-jbusty.mjs screenshot /workspace/jbusty-verify-proof/home.png
node control-jbusty.mjs goto work
# then copy evidence: cp "$JBUSTY_EVIDENCE_DIR/work.png" /workspace/jbusty-verify-proof/work.png
```

JSON stdout is the default. Keep `JBUSTY_MODE=live` unless you are on a local checkout.

Maintenance: `/maintain-verification-skill` when the map drifts.
