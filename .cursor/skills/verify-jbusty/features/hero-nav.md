# Hero and navigation

The header and hero let a visitor skip to main content, return home, open section anchors (Work / About / Contact), and read the availability line plus the signal/noise headline.

## Sub-features

- `skip-link` moves focus to `#main-content` via `a.skip-link`.
- `brand-home` returns to `#top` via `a.brand` labeled `Jesus Bustillos-Molina, home`.
- `menu-toggle` opens or closes `#nav-links` (`button.menu-toggle`, `aria-controls=nav-links`).
- `nav-anchors` exposes Work `#work`, About `#about`, Contact `#contact` inside `#nav-links`.
- `hero-copy` shows availability, kicker `AI SYSTEMS / CYBERSECURITY`, and h1 `I find the signal inside the noise.`

## How to get to it (user POV)

- Load `https://jesusmbm.github.io/jbusty.github.io/` (home / `#top`).
- Choose the skip link `Skip to main content`.
- Choose the brand `JBM°` (accessible name `Jesus Bustillos-Molina, home`).
- Choose `Menu` / `Close` on narrow viewports, then a nav link.
- Choose Work, About, or Contact in the primary nav.

## Driving it with control-jbusty

Preconditions:

- `JBUSTY_MODE=live` and `JBUSTY_URL=https://jesusmbm.github.io/jbusty.github.io/`.
- `node control-jbusty.mjs doctor` exits 0.
- Do not click live production.

- **Open home.** Load the live URL. Run `node control-jbusty.mjs snapshot`. JSON `landmarks.skipLink`, `landmarks.brand`, `landmarks.menuToggle`, `landmarks.nav`, and `landmarks.hero` are true. Title contains `Jesus Bustillos-Molina`.
- **Hero copy.** Assert dump-dom from doctor/snapshot contains `Available for AI systems and AI security work`, `AI SYSTEMS / CYBERSECURITY`, and `I find the signal`.
- **Skip target.** Confirm snapshot/DOM includes `a.skip-link` with `href="#main-content"` and `main id="main-content"`.
- **Brand home.** Run `node control-jbusty.mjs goto top`. JSON `hash` is `#top` and `sectionPresent` is true.
- **Nav Work.** Run `node control-jbusty.mjs goto work`. JSON `hash` is `#work`. Screenshot lands at `$JBUSTY_EVIDENCE_DIR/work.png`.
- **Nav About.** Run `node control-jbusty.mjs goto about`. JSON `hash` is `#about`.
- **Nav Contact.** Run `node control-jbusty.mjs goto contact`. JSON `hash` is `#contact`.
- **Menu click (local only).** On live, `node control-jbusty.mjs click 'button.menu-toggle'` exits non-zero and stderr says to use `goto` instead. On local, use `--dry-run` first.
- **Proof.** Run `node control-jbusty.mjs screenshot /workspace/jbusty-verify-proof/home.png`. The PNG still exists after the CLI returns (chrome profile already deleted). Copy also at `/tmp/jbusty-verify-evidence-proof/home.png`.

## Gotchas

- Headless chrome hangs if it reuses a desktop `--user-data-dir`. Always isolate the profile (the CLI does).
- `click` on github.io is refused by design. Hash nav is `goto`, not click.
- The kicker paragraph is `AI systems · cybersecurity`; the meta span is `AI SYSTEMS / CYBERSECURITY`. Assert both if the recipe names both.
- Menu is a viewport concern: `button.menu-toggle` is always in the DOM; overlay class `nav-links open` is local-only to prove.
- Infinite ambient/marquee motion must not block dump-dom; `--virtual-time-budget=8000` is required.
