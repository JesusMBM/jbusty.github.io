# Contact and footer

Section #contact is the close: availability, Let's talk mailto, then a footer with copyright year, GitHub, LinkedIn, and Back to top.

## Sub-features

- `contact-kicker` is "Open to AI systems work".
- `contact-mailto` is "Let's talk." to mailto:jbustillosmolina@gmail.com.
- `footer-copy` is copyright year plus Jesus Bustillos-Molina.
- `footer-github` is GitHub to https://github.com/JesusMBM (new tab).
- `footer-linkedin` is LinkedIn to https://www.linkedin.com/in/jesus-bm/ (new tab).
- `back-to-top` is "Back to top" with an up arrow, href #top.

## How to get to it (user POV)

- Choose Contact in the primary nav (#contact).
- Load https://jesusmbm.github.io/jbusty.github.io/#contact directly.
- Choose Let's talk, GitHub, LinkedIn, or Back to top. Verification follows only #top via goto; it does not activate mailto or outbound social links.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true.
- Click is refused on live. GitHub and LinkedIn are other origins — do not goto them.

- **Reach the section.** A visitor opens Contact. Run `node control-jbusty.mjs goto --url '#contact' --path /tmp/verify-jbusty-evidence/contact.png`. JSON found is true, id is contact.
- **Snapshot footer links.** Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/contact.html`. The HTML contains "Open to AI systems work", "talk." plus mailto:jbustillosmolina@gmail.com, https://github.com/JesusMBM, https://www.linkedin.com/in/jesus-bm/, "Back to top", href #top, and Jesus Bustillos-Molina next to a copyright mark and the current year.
- **Return to top without activating the link.** A visitor chooses Back to top. Run `node control-jbusty.mjs goto --url '#top'`. JSON found is true for top.
- **Proof.** Dump-dom has the mailto, both social hrefs, back-to-top hash, and copyright year. Screenshot shows the contact block.
- **Refuse live click.** Run `node control-jbusty.mjs click footer a`. JSON error is "click refused on live", exit 2.

## Gotchas

- Unused Contact.jsx is not the live footer. Assert #contact and "Open to AI systems work".
- Let's talk is authored with a Unicode apostrophe. Match "talk." plus the mailto href rather than a brittle ASCII-only full string.
- Copyright year is produced from the current calendar year in App.jsx. Do not hard-code a stale year in assertions.
- GitHub and LinkedIn open in a new tab. Presence of those hrefs is the proof; do not dump-dom github.com or linkedin.com.
- Quote `--url '#contact'`. Unquoted `#contact` is a shell comment.
