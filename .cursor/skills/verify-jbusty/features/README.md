# jbusty.github.io verification map

This directory is the maintained source for verifying the user-facing behavior of the jbusty portfolio SPA. Read the index before driving the app, then use the matching feature file as the recipe.

Live URL: `https://jesusmbm.github.io/jbusty.github.io/`
Title: `Jesus Bustillos-Molina — AI Systems / Cybersecurity`

## Baseline preconditions

- Default `JBUSTY_MODE=live` and `JBUSTY_URL=https://jesusmbm.github.io/jbusty.github.io/`.
- Chrome is `/usr/bin/google-chrome`. The CLI isolates `--user-data-dir`; do not reuse a desktop profile.
- Put `control-jbusty.mjs` on PATH or run it from `.cursor/skills/verify-jbusty`.
- Run `node control-jbusty.mjs doctor` and require HTTP 200, title `Jesus Bustillos-Molina`, dump-dom with `I find the signal`, `AI Agent Architecture`, and Work/About/Contact.
- Never `click` live production. Use `goto` for hash navigation.
- Never edit `src/` product code from a verification run.
- Do not git clone to satisfy live doctor.

## Driving conventions

- Start every recipe from the live home URL unless its preconditions say local preview.
- Prefer ARIA labels, ids, and accessible names (`a.brand`, `#nav-links`, `#work`) over coordinates.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through `control-jbusty.mjs` (`snapshot`, `screenshot`, `goto`, `wait-settle`).
- `--dry-run` on `click` / `launch` / `stop` must not spawn chrome or vite.
- Restore nothing: the site is a public static SPA. Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a JSON snapshot (landmarks) and a screenshot with the identity visible (title / brand / heading).
- Screenshot PATH must survive chrome child cleanup — confirm the file still exists after the CLI returns.
- Copies also land in `/tmp/jbusty-verify-evidence-proof/` (`JBUSTY_EVIDENCE_DIR`).
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with control-jbusty` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Hero and navigation](./hero-nav.md) covers skip link, brand, menu, primary nav, and the hero at `#top`.
- [Work / personal research](./work-research.md) covers the six project cards at `#work`.
- [About / profile](./about-profile.md) covers profile copy, mailto, and capabilities.
- [Contact and footer](./contact-footer.md) covers the talk CTA, GitHub, LinkedIn, and back to top.
