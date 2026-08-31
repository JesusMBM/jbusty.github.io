# jbusty verification map

Maintained source for verifying the user-facing portfolio at https://jesusmbm.github.io/jbusty.github.io/. Read this index, then the feature file for the surface you are proving.

## Baseline preconditions

- Default target is LIVE Pages. Do not launch Vite unless proving an unreleased branch.
- Set JBUSTY_RUN_ID so pid and evidence dirs do not collide. Evidence: /tmp/jbusty-verify-evidence-$RUN_ID/
- Run: node .cursor/skills/verify-jbusty/control-jbusty.mjs doctor   and require ok true.
- Never drive a local instance this CLI did not launch. Never click live production.

## Driving conventions

- Prefer live Pages for recruiter-path proof. Hash routes: #top #work #about #contact.
- Prefer ARIA labels and hrefs over coordinates: a.brand, button.menu-toggle, nav#nav-links, a.project.
- Treat every command as literal. JSON on stdout is the assertion surface.
- Mutating commands (click, eval, launch, stop) accept --dry-run.

## Proof and skip reporting

- Capture action and resulting state (goto then screenshot + snapshot).
- work.png / snapshot must include AI Agent Architecture when proving Work.
- Cleanup must not delete evidence. Report unreachable paths; do not claim a skipped hash was verified via another.

## Features

- [Hero and navigation](./hero-nav.md) skip link, brand, menu, primary nav, hero copy.
- [Work / visual research](./work-research.md) six project cards and outbound research URLs.
- [About / profile](./about-profile.md) bio, mailto, capabilities.
- [Contact / footer](./contact-footer.md) mailto, GitHub, LinkedIn, back to top.
