# About / profile

About is the #about section: heading "Curious by nature. Methodical by practice.", a short profile of Jesus Bustillos-Molina, mailto jbustillosmolina@gmail.com, and capabilities Build / Evaluate / Secure / Investigate.

## Sub-features

- `about-heading` h2 Curious by nature. Methodical by practice.
- `about-bio` name, AI agent systems, cybersecurity practice, Textron / KSU / ISC2 / WGU copy.
- `about-mail` Start a conversation mailto:jbustillosmolina@gmail.com
- `capabilities` Build, Evaluate, Secure, Investigate.

## How to get to it (user POV)

- Choose About in the primary nav.
- Open https://jesusmbm.github.io/jbusty.github.io/#about
- Scroll past Work and the signal strip.

## Driving it with control-jbusty

Preconditions:

- doctor reports ok true on the target URL.
- You are proving the live recruiter path unless JBUSTY_MODE=local was launched by this CLI.

- **Jump to About.** Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #about /tmp/jbusty-verify-evidence-$RUN_ID/about.png`. JSON found includes "Curious by nature"; PNG shows the profile heading.
- **Read copy and mail.** Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs snapshot`. links include mailto:jbustillosmolina@gmail.com; headings or body include Build, Evaluate, Secure, Investigate.
- **Do not send mail.** Choosing Start a conversation would open a mail client. Use snapshot href assertions; do not click the mailto on live.
- **Proof.** about.png plus snapshot.json show the heading and the mailto href.

## Gotchas

- Apostrophes may be curly in dump-dom (I am / Im). Assert "Curious by nature" and the mailto href, which are stable.
- Capabilities are h3s inside .capability, not nav links.
- Mailto is a user-agent handoff; proving the href is the user-path proof, not sending email.
