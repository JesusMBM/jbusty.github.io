# Contact and footer

Contact is the close of the page at `#contact`: an invitation to talk, a mailto CTA, and a footer with GitHub, LinkedIn, copyright, and back to top.

## Sub-features

- `contact-label` shows `Open to AI systems work`.
- `contact-mailto` is `Let's talk.` → `mailto:jbustillosmolina@gmail.com`.
- `contact-github` is GitHub → `https://github.com/JesusMBM` (new tab).
- `contact-linkedin` is LinkedIn → `https://www.linkedin.com/in/jesus-bm/` (new tab).
- `contact-top` is `Back to top` → `#top`.

## How to get to it (user POV)

- Choose `Contact` in `#nav-links`.
- Choose `Let's talk.`
- Choose `GitHub` or `LinkedIn` in the footer.
- Choose `Back to top ↑`.

## Driving it with control-jbusty

Preconditions:

- `node control-jbusty.mjs doctor` exits 0 against live Pages.
- Do not click live production; do not send mail or open GitHub/LinkedIn as a click from this CLI.

- **Open Contact.** Run `node control-jbusty.mjs goto contact`. JSON `hash` is `#contact` and `sectionPresent` is true.
- **CTA.** Snapshot/DOM contains `Open to AI systems work` and `mailto:jbustillosmolina@gmail.com`.
- **GitHub.** Snapshot/DOM contains `https://github.com/JesusMBM`.
- **LinkedIn.** Snapshot/DOM contains `https://www.linkedin.com/in/jesus-bm/`.
- **Back to top.** Snapshot/DOM contains `href="#top"` with visible text `Back to top`. Run `node control-jbusty.mjs goto top` to follow that user path without clicking production.
- **Proof.** Screenshot `$JBUSTY_EVIDENCE_DIR/contact.png` still exists after chrome cleanup. Optional copy to `/workspace/jbusty-verify-proof/contact.png`.

## Gotchas

- Footer GitHub/LinkedIn use `target=_blank` and sr-only `(opens in a new tab)`. Assert hrefs, not a same-origin URL change.
- Apostrophe in `Let's talk.` may be a typographic apostrophe in the DOM. Match `Let` + `talk` if a strict ASCII search fails.
- `goto top` after contact is the user-visible back-to-top path; do not `click a[href='#top']` on live Pages.
