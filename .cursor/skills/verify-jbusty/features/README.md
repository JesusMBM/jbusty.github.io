# jbusty verification map

This directory is the maintained source for verifying the user-facing behavior of the live jbusty portfolio. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Target the live URL https://jesusmbm.github.io/jbusty.github.io/ (trailing slash). Do not start a local Vite server.
- Run node control-jbusty.mjs doctor from .cursor/skills/verify-jbusty/ and require ok true (HTTP 200 plus App.jsx identity: skip-link, #main-content, #top, #work, #about, #contact, brand aria-label, h1 contains "I find the signal").
- Never activate controls on live Pages. Menu, mailto, and outbound project tabs are shared public surface.
- Drive only through control-jbusty.mjs (headless /usr/bin/google-chrome dump-dom / screenshot).
- Evidence lands in /tmp/verify-jbusty-evidence/ (or $VERIFY_JBUSTY_EVIDENCE). Cleanup must not delete it.
- Unused files in src/components/ describe an old id-hero / projects / skills design. They are not the live UI.

## Driving conventions

- Start every recipe from a passing doctor unless the feature file says otherwise.
- Prefer the live handles in each feature file (ids, aria-labels, hrefs) over coordinates or leftover component selectors.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through node control-jbusty.mjs (doctor, snapshot, screenshot, goto).
- Resolve in-page movement with `goto --url '#work'` (or `goto work`) and the same for #top, #about, #contact, #main-content, and #approach. Quote hashes; unquoted # is a shell comment. Do not goto Netlify project URLs or /honeyquest/. Approach proof is primarily snapshot; #approach is optional.
- Restore nothing: the live site is static. Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a dump-dom/snapshot extract and a screenshot with portfolio identity visible.
- Hash navigation proof includes JSON found true for the target id plus the dump-dom file.
- Work-card proof is the DOM containing all seven titles and hrefs. Opening those hrefs is out of scope.
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

- [Hero and primary navigation](./hero-nav.md) covers skip link, brand home, menu toggle, Work/About/Contact, hero copy, hero-footer, and the explore-work circle link.
- [Approach / statement](./approach-statement.md) covers section #approach (01 / Approach) between hero and Work.
- [Work / visual research](./work-research.md) covers 02 / Personal research, the seven research cards, titles, and new-tab URLs, proven from dump-dom without following project links.
- [About / profile](./about-profile.md) covers 03 / Profile, bio, Textron Aviation, capabilities, and Start a conversation mailto.
- [Contact and footer](./contact-footer.md) covers Let's talk mailto, GitHub, LinkedIn, Back to top, and copyright year.
