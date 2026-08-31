# About / profile

About is the profile section at `#about`: name, practice summary, a mailto conversation link, and four capabilities (Build, Evaluate, Secure, Investigate).

## Sub-features

- `about-heading` shows `03 / Profile` and `Curious by nature. Methodical by practice.`
- `about-copy` identifies Jesus Bustillos-Molina and the AI-systems / cybersecurity practice.
- `about-mailto` offers `Start a conversation` to `mailto:jbustillosmolina@gmail.com`.
- `about-capabilities` lists Build, Evaluate, Secure, Investigate.

## How to get to it (user POV)

- Choose `About` in `#nav-links`.
- Scroll past Work and the `Build · Evaluate · Secure · Investigate` signal strip.
- Choose `Start a conversation` in the about copy (mailto).

## Driving it with control-jbusty

Preconditions:

- `node control-jbusty.mjs doctor` exits 0 against live Pages.
- Do not send email. Mailto is asserted as an href only.

- **Open About.** Run `node control-jbusty.mjs goto about`. JSON `hash` is `#about` and `sectionPresent` is true.
- **Heading.** Snapshot/DOM contains `Curious by nature` and `Methodical by`.
- **Mailto.** Snapshot/DOM contains `mailto:jbustillosmolina@gmail.com` on `a.text-link` (`Start a conversation`).
- **Capabilities.** Snapshot/DOM contains headings `Build`, `Evaluate`, `Secure`, and `Investigate` inside `.capabilities` / `.capability`.
- **Proof.** Screenshot from goto is `$JBUSTY_EVIDENCE_DIR/about.png`. Confirm it still exists after the CLI returns. Optional copy to `/workspace/jbusty-verify-proof/about.png`.

## Gotchas

- The marquee `Build · Evaluate · Secure · Investigate` is aria-hidden. Prove the four `.capability` headings, not only the marquee string.
- `click` of mailto on live is refused. Assert the href.
- Ampersand in `Cybersecurity & Information Assurance` may appear as `&amp;` in dump-dom. Match either.
