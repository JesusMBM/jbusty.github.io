# Contact and footer

Section #contact ("03 / Contact", "Something worth figuring out?") is the close: a Let’s talk mailto, a one-line pitch, then a footer with copyright year, GitHub, LinkedIn, and Back to top.

## Sub-features

- `contact-heading` is eyebrow "03 / Contact" and h2 "Something worth figuring out?"
- `contact-mailto` is a.button.primary "Let’s talk" to mailto:jbustillosmolina@gmail.com.
- `contact-pitch` is "AI tools, practical security questions, and explanations that people can use."
- `footer-copy` is © current year plus Jesus Bustillos-Molina.
- `footer-github` is "GitHub ↗" to https://github.com/JesusMBM (new tab).
- `footer-linkedin` is "LinkedIn ↗" to https://www.linkedin.com/in/jesus-bm/ (new tab).
- `back-to-top` is "Back to top ↑", href #top.

## How to get to it (user POV)

- Choose Contact in the primary nav or Get in touch in the hero (#contact).
- Load https://jesusmbm.github.io/jbusty.github.io/#contact directly.
- Choose Let’s talk, GitHub, LinkedIn, or Back to top. Verification follows only #top via goto; it does not activate mailto or social links.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true (contact-mailto found).
- Click is refused on live. GitHub and LinkedIn are other origins — do not goto them.

- **Reach the section.** A visitor opens Contact. Run `node control-jbusty.mjs goto --url '#contact' --path /tmp/verify-jbusty-evidence/contact.png`. JSON found is true, id is contact.
- **Snapshot footer links.** Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/contact.html`. The extract LINKS show "Let’s talk ↗ -> mailto:jbustillosmolina@gmail.com", "GitHub ↗ -> https://github.com/JesusMBM", "LinkedIn ↗ -> https://www.linkedin.com/in/jesus-bm/", "Back to top ↑ -> #top"; HEADINGS show "h2: Something worth figuring out?"; the HTML has "© <current year> Jesus Bustillos-Molina".
- **Return to top without activating the link.** A visitor chooses Back to top. Run `node control-jbusty.mjs goto --url '#top'`. JSON found is true for top.
- **Refuse outbound.** Run `node control-jbusty.mjs goto --url 'https://github.com/JesusMBM'`. JSON ok is false, error "refusing outbound navigation".
- **Refuse live click.** Run `node control-jbusty.mjs click footer a`. JSON error is "click refused on live", exit 2.

## Gotchas

- "Open to AI systems work" and "Let's talk." are pre-redesign copy. Live text is "Something worth figuring out?" and "Let’s talk" (typographic apostrophe, no trailing period). Match "talk" plus the mailto href.
- Unused Contact.jsx is not the live footer. Assert #contact and "Something worth figuring out".
- Copyright year is produced from the current calendar year in App.jsx. Do not hard-code a stale year.
- GitHub and LinkedIn open in a new tab. Presence of those hrefs is the proof; do not dump-dom github.com or linkedin.com.
- Quote `--url '#contact'`. Unquoted `#contact` is a shell comment.
