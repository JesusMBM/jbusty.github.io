# Hero and navigation

The first screen a visitor sees: skip link, JBM brand home, menu toggle, Work/About/Contact nav, availability line, kicker, and the h1 "I find the signal inside the noise." plus a circle-link into Work.

## Sub-features

- `skip-link` moves keyboard users to #main-content.
- `brand-home` returns to #top via a.brand (aria-label Jesus Bustillos-Molina, home).
- `menu-toggle` opens/closes nav#nav-links (aria-expanded, aria-controls).
- `primary-nav` Work #work, About #about, Contact #contact.
- `hero-copy` availability, kickers, h1, circle-link to #work.

## How to get to it (user POV)

- Open https://jesusmbm.github.io/jbusty.github.io/ (document title Jesus Bustillos-Molina — AI Systems / Cybersecurity).
- Follow Skip to main content, or the JBM brand, or Menu then a nav link.
- Land on #top after Back to top from the footer.

## Driving it with control-jbusty

Preconditions:

- Live Pages is the default target (or a local instance after launch).
- doctor reports ok true for this URL.

- **Open home.** Load the portfolio. Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs doctor`. httpStatus 200, title contains Jesus Bustillos-Molina, checks include hero-h1.
- **Capture hero.** Screenshot the first screen. Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs screenshot /tmp/jbusty-verify-evidence-$RUN_ID/home.png`. JSON path/bytes; PNG shows the h1.
- **Map nav.** Read headings and links. Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs snapshot`. JSON links include Skip to main content, JBM brand #top, Work #work, About #about, Contact #contact.
- **Stay on top.** Re-assert the hash. Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #top /tmp/jbusty-verify-evidence-$RUN_ID/top.png`. found includes "I find the signal".
- **Menu (local only).** Open the drawer. Run `JBUSTY_MODE=local node .cursor/skills/verify-jbusty/control-jbusty.mjs --dry-run click .menu-toggle` then the same without --dry-run after launch. Live production click is refused. Snapshot after click shows aria-expanded true or nav.open.

## Gotchas

- index.html is a shell; doctor/snapshot must use dump-dom with virtual-time, not curl of the raw HTML.
- Menu click is refused on live Pages by design. Prove the open drawer only on a local launch.
- Brand text is JBM with a degree mark; assert the aria-label, not the glyph.
- Reduced-motion and offscreen tabs pause animation; copy still renders.
