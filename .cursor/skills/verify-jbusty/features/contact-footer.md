# Contact / footer

Contact is the #contact section: open-to-work label, Lets talk mailto, footer with GitHub https://github.com/JesusMBM, LinkedIn https://www.linkedin.com/in/jesus-bm/, and Back to top #top.

## Sub-features

- `contact-label` Open to AI systems work.
- `contact-mail` Lets talk. mailto:jbustillosmolina@gmail.com
- `github` https://github.com/JesusMBM (new tab).
- `linkedin` https://www.linkedin.com/in/jesus-bm/ (new tab).
- `back-to-top` href #top.

## How to get to it (user POV)

- Choose Contact in the primary nav.
- Open https://jesusmbm.github.io/jbusty.github.io/#contact
- Scroll to the end of the page.

## Driving it with control-jbusty

Preconditions:

- doctor reports ok true on the target URL.
- Evidence dir /tmp/jbusty-verify-evidence-$RUN_ID/ is allowed to keep artifacts after stop.

- **Jump to Contact.** Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #contact /tmp/jbusty-verify-evidence-$RUN_ID/contact.png`. Screenshot written; dump-dom/snapshot include Lets talk or the mailto.
- **Assert footer links.** Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs snapshot`. links include mailto:jbustillosmolina@gmail.com, https://github.com/JesusMBM, https://www.linkedin.com/in/jesus-bm/, and Back to top #top.
- **Return home.** Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #top /tmp/jbusty-verify-evidence-$RUN_ID/top.png`. found includes "I find the signal".
- **Do not click outbound on live.** GitHub/LinkedIn/mailto leave the portfolio. Prove hrefs via snapshot; click is refused on production.

## Gotchas

- Lets talk may use a curly apostrophe in the DOM. Prefer the mailto href as the stable handle.
- GitHub and LinkedIn include sr-only "(opens in a new tab)" — strip tags before asserting visible text.
- Back to top is a same-page hash; goto #top is the harness equivalent of that user action.
- stop/cleanup must leave contact.png and snapshot.json in the evidence directory.
