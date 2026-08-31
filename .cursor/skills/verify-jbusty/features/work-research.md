# Work / visual research

Work is the #work section: heading "Questions explored through visual research." and six project cards (a.project) that open original visual-research sites in new tabs.

## Sub-features

- `work-heading` h2 Questions explored through visual research.
- `card-01` AI Agent Architecture -> https://jbm-agent-architecture.netlify.app
- `card-02` AI Agents Escaping Sandboxes -> https://jbm-agent-sandbox-review.netlify.app
- `card-03` Open, But How Open? -> https://jbm-open-models-explained.netlify.app
- `card-04` The Hidden Cost of AI Agents -> https://jbm-harness-economics.netlify.app
- `card-05` Secure SDLC: STRIDE, PASTA & SSDF -> https://jbm-secure-sdlc.netlify.app
- `card-06` Hacking a Satellite—Safely Explained -> https://jbm-satellite-cyber.netlify.app

## How to get to it (user POV)

- Choose Work in the primary nav.
- Choose the hero circle-link (aria-label Explore selected work).
- Open https://jesusmbm.github.io/jbusty.github.io/#work
- Scroll from the hero past the approach statement.

## Driving it with control-jbusty

Preconditions:

- doctor reports ok true on the target URL.
- Evidence dir /tmp/jbusty-verify-evidence-$RUN_ID/ exists (screenshot/goto create it).

- **Jump to Work.** Navigate like a visitor using the hash. Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs goto #work /tmp/jbusty-verify-evidence-$RUN_ID/work.png`. JSON found["AI Agent Architecture"] is true; PNG is written.
- **List cards.** Read headings and outbound hrefs. Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs snapshot`. headings include the work h2 and six h3 titles; links include all six netlify.app URLs with target-new-tab copy.
- **Do not click cards on live.** Cards open new tabs (rel noreferrer). Run `node .cursor/skills/verify-jbusty/control-jbusty.mjs --dry-run click a.project` if you need to show the selector; executing click on live is refused.
- **Proof.** work.png plus snapshot.json both identify AI Agent Architecture and at least one other card title.

## Gotchas

- Titles live in h3; dump-dom may keep the br/em markup — assert the visible phrase, not a single innerText node.
- Cards are motion.a with class project; prefer a.project or the title text, not nth-child.
- Outbound sites are separate apps. This skill proves the portfolio lists them, not that each Netlify site is healthy.
- SPA hydration: if snapshot lacks AI Agent Architecture, run wait-settle and retry; do not curl index.html.
