# About / profile

Section #about is the profile: name, bio, Textron Aviation, a Start a conversation mailto, and four capabilities (Build, Evaluate, Secure, Investigate).

## Sub-features

- `about-heading` is #about section-index "03 / Profile" and heading "Curious by nature. Methodical by practice."
- `about-name` identifies Jesus Bustillos-Molina and Textron Aviation.
- `about-mailto` is "Start a conversation" to mailto:jbustillosmolina@gmail.com.
- `about-capabilities` lists Build, Evaluate, Secure, Investigate.

## How to get to it (user POV)

- Choose About in the primary nav (#about).
- Load https://jesusmbm.github.io/jbusty.github.io/#about directly.
- Choose Start a conversation to compose mail — do not activate that link during verification.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true.
- Click is refused; mailto is asserted in the DOM only.

- **Reach the section.** A visitor opens About. Run `node control-jbusty.mjs goto --url '#about' --path /tmp/verify-jbusty-evidence/about.png`. JSON found is true, id is about.
- **Snapshot profile copy.** Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/about.html`. The HTML contains "03 / Profile", "Curious by nature", "Jesus Bustillos-Molina", "Textron Aviation", "Start a conversation", mailto:jbustillosmolina@gmail.com, and the capability headings Build, Evaluate, Secure, Investigate.
- **Proof.** Screenshot plus dump-dom show #about identity. Mailto is present as an href, not opened.
- **Refuse mailto click.** Run `node control-jbusty.mjs click a.text-link`. JSON error is "click refused on live", exit 2.

## Gotchas

- Unused About.jsx is not the live section. Assert #about and "Curious by nature", not leftover selectors from that file.
- The live name line uses a typographic apostrophe in I'm. Prefer the ASCII-stable strings Jesus Bustillos-Molina and Textron Aviation.
- Capability labels also appear in a decorative marquee. Proof is the #about capability headings, visible in dump-dom as h3 text Build / Evaluate / Secure / Investigate.
- Quote `--url '#about'`. Unquoted `#about` is a shell comment.
