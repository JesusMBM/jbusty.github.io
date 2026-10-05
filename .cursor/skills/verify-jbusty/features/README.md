# jbusty verification map

This directory is the maintained source for verifying the user-facing behavior of the live jbusty portfolio (redesigned App.jsx, PRs #11-#12). Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Target the live URL https://jesusmbm.github.io/jbusty.github.io/ (trailing slash). Do not start a local Vite server.
- Run node control-jbusty.mjs doctor from .cursor/skills/verify-jbusty/ and require ok true (HTTP 200 plus App.jsx identity: title, skip-link, #main, #top, #work, #about, #contact, wordmark-aria-label, primary-nav, h1-examined-closely, research-cards-7, contact-mailto; no oldIdentity).
- Never activate controls on live Pages. Menu, mailto, research cards, and social links are shared public surface.
- Drive only through control-jbusty.mjs (headless /usr/bin/google-chrome dump-dom / screenshot).
- Evidence lands in /tmp/verify-jbusty-evidence/ (or $VERIFY_JBUSTY_EVIDENCE). Cleanup must not delete it.
- Unused files in src/components/ describe an old id-hero / projects / skills design. The pre-redesign App.jsx (#main-content, "I find the signal", #approach, Netlify cards) is gone too. Neither is the live UI.

## Driving conventions

- Start every recipe from a passing doctor unless the feature file says otherwise.
- Prefer the live handles in each feature file (ids, aria-labels, hrefs) over coordinates or leftover component selectors.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through node control-jbusty.mjs (doctor, snapshot, screenshot, goto).
- Resolve in-page movement with `goto --url '#work'` (or `goto work`) and the same for #top, #main, #about, #contact. Quote hashes; unquoted # is a shell comment. Do not goto /jbusty.github.io/research/..., /honeyquest/, GitHub, or LinkedIn.
- Restore nothing: the live site is static. Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a dump-dom/snapshot extract and a screenshot with portfolio identity visible.
- Hash navigation proof includes JSON found true for the target id plus the dump-dom file.
- Research-card proof is the DOM containing all seven titles and hrefs (doctor research-cards-7 plus the RESEARCH CARDS block of the snapshot extract). Opening those hrefs is out of scope.
- Record the feature file used with every artifact (--path names under the evidence dir).
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.
- A click command that returns "click refused on live" is expected, not a feature pass.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with control-jbusty` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Hero and primary navigation](./hero-nav.md) covers the skip link, JBM wordmark, menu button, Research/About/Contact nav, the "AI systems, examined closely." hero, its two buttons, the agent system-map figure, and the hero baseline.
- [Selected research](./work-research.md) covers #work (01 / Selected research) and the seven same-origin research cards, titles, and new-tab URLs, proven from dump-dom without following them.
- [About / profile](./about-profile.md) covers 02 / About, bio, Textron Aviation, credentials, and capabilities Build / Check / Protect / Investigate.
- [Contact and footer](./contact-footer.md) covers 03 / Contact, Let’s talk mailto, GitHub, LinkedIn, Back to top, and copyright year.

The former Approach / statement feature (section #approach) was removed in the redesign; its recipe was deleted. Doctor treats id="approach" as old identity.
