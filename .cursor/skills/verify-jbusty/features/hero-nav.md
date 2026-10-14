# Hero and primary navigation

The live header and #top hero let a visitor skip to content, return home via the JBM wordmark, open the primary nav (a Menu button on narrow screens), and jump to Research, About, or Contact — with the redesigned App.jsx hero ("AI systems, examined closely.") and its agent system-map figure, not the unused hero component or the pre-redesign "I find the signal" hero.

## Sub-features

- `skip-link` moves to main#main via a.skip-link text "Skip to content".
- `wordmark-home` is a.wordmark href #top aria-label "Jesus Bustillos-Molina home" with visible text "JBM / Independent research" (caption hidden under 900px).
- `menu-button` is button.menu-button (aria-controls="navigation", aria-expanded, text Menu/Close); only displayed under 640px.
- `primary-nav` is nav#navigation aria-label "Primary" with Research #work, About #about, Contact #contact.
- `hero-copy` is section#top.hero: eyebrow "Jesus Bustillos-Molina", h1 "AI systems, examined closely.", description beginning "I build and study AI agents".
- `hero-actions` are a.button.primary "Explore research" href #work and a.button "Get in touch" href #contact.
- `system-map` is figure.system-map captioned "01 / How an AI agent works" / "Conceptual model" with Information → AI agent → Tools inside "RULES & PERMISSIONS", then Checks.
- `hero-baseline` reads "AI systems / AI security / Cybersecurity" and "Wichita, Kansas".

## How to get to it (user POV)

- Load https://jesusmbm.github.io/jbusty.github.io/ (the first screen is #top).
- Follow Skip to content.
- Choose the JBM wordmark to return to #top.
- Choose Research, About, or Contact in the header (on a phone, choose Menu first).
- Choose Explore research (#work) or Get in touch (#contact).

## Driving it with control-jbusty

Preconditions:

- Live Pages is the target. Do not start a local server.
- node control-jbusty.mjs doctor reports ok true.
- Evidence directory /tmp/verify-jbusty-evidence/ exists or will be created.

- **Confirm identity.** Load the live home. Run `node control-jbusty.mjs doctor`. JSON ok is true; title is "Jesus Bustillos-Molina — AI Systems / Cybersecurity"; markers.found includes skip-link, #main, #top, wordmark-aria-label, primary-nav, h1-examined-closely; markers.missing is []; there is no oldIdentity key.
- **Snapshot the home DOM.** Observe skip link, wordmark, nav, and hero copy. Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/hero-nav.html`. JSON ids includes main, navigation, top, work, about, contact. The extract shows `h1: AI systems, examined closely.`, links "Skip to content -> #main", "JBM / Independent research -> #top [Jesus Bustillos-Molina home]", "Research -> #work", "About -> #about", "Contact ↗ -> #contact", "Explore research ↓ -> #work", "Get in touch -> #contact". The HTML contains "01 / How an AI agent works" and "Wichita, Kansas".
- **Screenshot the first screen.** Run `node control-jbusty.mjs screenshot --path /tmp/verify-jbusty-evidence/hero-nav.png`. JSON bytes is greater than 0; the PNG is 1280x800 and shows the "AI systems, examined closely." hero and the system-map figure, not a blank shell.
- **Jump to Research without activating controls.** A visitor chooses Research or Explore research. Run `node control-jbusty.mjs goto --url '#work' --path /tmp/verify-jbusty-evidence/hero-to-work.png`. JSON url ends with #work, id is work, found is true.
- **Skip to content.** Run `node control-jbusty.mjs goto --url '#main'`. JSON found is true for main.
- **Jump to About and Contact.** Run `node control-jbusty.mjs goto --url '#about'` and `node control-jbusty.mjs goto --url '#contact'`. Each JSON found is true.
- **Return home.** A visitor chooses the wordmark. Run `node control-jbusty.mjs goto --url '#top'`. JSON found is true for top.
- **Refuse live click.** A visitor would tap Menu. Run `node control-jbusty.mjs click .menu-button`. JSON ok is false, error is "click refused on live", exit code 2. Do not retry with a debugger protocol.

## Gotchas

- Leftover Hero.jsx / Nav.jsx use #hero and different copy; the pre-redesign App.jsx used #main-content, .brand, .menu-toggle, #nav-links and "I find the signal". Any of those in dump-dom is old identity and fails doctor.
- The skip link target is #main (not #main-content) and its text is "Skip to content" (not "Skip to main content").
- The h1 has a line break and a span: "AI systems,<br><span>examined closely.</span>". Assert on stripped text, not raw HTML.
- button.menu-button exists in the DOM at every width but is display:none above 640px; the 1280x800 screenshot shows inline nav. Activating it on live is refused.
- goto #work confirms the id is in the document; it does not prove scroll position. Pair with a screenshot named for the hash.
- Chrome dump-dom must be launched with --timeout=30000 and stderr captured to a file; discarding stderr has hung this environment.
- Unquoted `--url #work` is a shell comment and fails with --url requires a value. Quote it: `--url '#work'`, or pass `goto work`.
- There is no Approach section anymore. Do not report it missing; doctor fails if id="approach" reappears.
