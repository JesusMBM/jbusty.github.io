# About / profile

Section #about ("02 / About", "Curiosity, with a security mindset.") is the profile: intro, Textron Aviation role, credentials (education, continuing study, certification), and four capabilities (Build, Check, Protect, Investigate). It has no links.

## Sub-features

- `about-heading` is #about eyebrow "02 / About" and h2 "Curiosity, with a security mindset."
- `about-intro` begins "I’m Jesus. I work in cybersecurity and build AI tools."
- `about-role` names Cyber Security Analyst at Textron Aviation in Wichita, full time since June 2025.
- `about-credentials` is dl.credentials: Education (Kansas State University, Management Information Systems), Continuing study (Western Governors University, M.S. Cybersecurity and Information Assurance, in progress), Certification (ISC2 Certified in Cybersecurity (CC)).
- `about-capabilities` lists h3 Build, Check, Protect, Investigate with eyebrows 01–04.

## How to get to it (user POV)

- Choose About in the primary nav (#about).
- Load https://jesusmbm.github.io/jbusty.github.io/#about directly.
- Scroll past the research cards.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true.

- **Reach the section.** A visitor opens About. Run `node control-jbusty.mjs goto --url '#about' --path /tmp/verify-jbusty-evidence/about.png`. JSON found is true, id is about.
- **Snapshot profile copy.** Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/about.html`. The HTML contains "02 / About", "a security mindset", "Textron Aviation", "Kansas State University", "Western Governors University", "ISC2 Certified in Cybersecurity (CC)"; the extract HEADINGS list h3 Build, Check, Protect, Investigate.
- **Proof.** Screenshot plus dump-dom show #about identity.
- **No outbound.** This section has no links. Do not click live.

## Gotchas

- Capabilities changed in the redesign: Build / Check / Protect / Investigate (not Evaluate / Secure). The "Start a conversation" mailto and "03 / Profile" label no longer exist.
- Unused About.jsx is not the live section. Assert #about and "a security mindset", not leftover selectors from that file.
- The intro uses a typographic apostrophe (I’m). Prefer ASCII-stable strings such as Textron Aviation and Kansas State University.
- The h2 contains a <br>; match "a security mindset" rather than the full heading in raw HTML.
- Quote `--url '#about'`. Unquoted `#about` is a shell comment.
