# Hero and primary navigation

The live header and #top hero let a visitor skip to main content, return home, open the primary nav, and jump to Work, About, or Contact — with the App.jsx hero copy and explore-work control, not the unused hero component.

## Sub-features

- `skip-link` moves to #main-content via .skip-link text "Skip to main content".
- `brand-home` is a.brand href #top aria-label "Jesus Bustillos-Molina, home" with visible text JBM and a degree mark.
- `menu-toggle` is .menu-toggle (aria-controls="nav-links", aria-label Open/Close navigation menu, text Menu/Close, aria-expanded).
- `primary-nav` is #nav-links aria-label "Primary navigation" with Work #work, About #about, Contact #contact.
- `hero-copy` is section#top.hero: kicker "AI systems · cybersecurity", h1 "I find the signal inside the noise.", availability "Available for AI systems and AI security work".
- `hero-footer` is the hero-footer paragraph "I design agent systems and study how they fail. Security practice is for the part that still has to hold under pressure."
- `explore-work` is a.circle-link href #work aria-label "Explore selected work".

## How to get to it (user POV)

- Load https://jesusmbm.github.io/jbusty.github.io/ (the first screen is #top).
- Follow Skip to main content.
- Choose the JBM brand to return to #top.
- Choose Menu, then Work, About, or Contact.
- Choose the explore-work circle control to reach #work.

## Driving it with control-jbusty

Preconditions:

- Live Pages is the target. Do not start a local server.
- node control-jbusty.mjs doctor reports ok true.
- Evidence directory /tmp/verify-jbusty-evidence/ exists or will be created.

- **Confirm identity.** Load the live home. Run `node control-jbusty.mjs doctor`. JSON ok is true; markers.found includes skip-link, #main-content, #top, #work, #about, #contact, brand-aria-label, h1-signal; markers.missing is []; id="hero" is not a found marker.
- **Snapshot the home DOM.** Observe skip link, brand, nav, and hero copy. Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/hero-nav.html`. JSON reports path and bytes; ids includes main-content, top, nav-links, work, about, contact. The HTML contains "Skip to main content", "Jesus Bustillos-Molina, home", "I find the signal", "I design agent systems", aria-label="Explore selected work", and hrefs #main-content, #top, #work, #about, #contact.
- **Screenshot the first screen.** Run `node control-jbusty.mjs screenshot --path /tmp/verify-jbusty-evidence/hero-nav.png`. JSON bytes is greater than 0; the PNG is 1280x800 and shows the portfolio hero, not a blank shell.
- **Jump to Work without activating controls.** A visitor chooses Work or the circle link. Run `node control-jbusty.mjs goto --url '#work' --path /tmp/verify-jbusty-evidence/hero-to-work.png`. JSON url ends with #work, id is work, found is true.
- **Jump to About and Contact.** Run `node control-jbusty.mjs goto --url '#about'` and `node control-jbusty.mjs goto --url '#contact'`. Each JSON found is true for about and contact.
- **Return home.** A visitor chooses JBM brand or would follow Back to top. Run `node control-jbusty.mjs goto --url '#top'`. JSON found is true for top.
- **Refuse live click.** A visitor would tap Menu. Run `node control-jbusty.mjs click .menu-toggle`. JSON ok is false, error is "click refused on live", exit code 2. Do not retry with a debugger protocol.

## Gotchas

- Leftover Hero.jsx / Nav.jsx use #hero and different copy. Dump-dom of live Pages must show #top.hero and "I find the signal", not id="hero".
- .menu-toggle exists in the DOM, but activating it on live is refused. Menu open/close is not in scope on the shared instance.
- goto #work confirms the id is in the document; it does not prove scroll position. Pair with a screenshot named for the hash.
- Brand visible text includes a degree mark after JBM. Assert the aria-label for identity.
- Chrome dump-dom must be launched with --timeout=30000 and stderr captured to a file; discarding stderr has hung this environment.
- Unquoted `--url #work` is a shell comment and fails with --url requires a value. Quote it: `--url '#work'`, or pass `goto work`.
- The 01 / Approach statement sits below this hero and is a separate feature (approach-statement.md). Do not treat it as missing hero copy.
