# Work / visual research

Section #work lists six visual-research project cards. Each card is a new-tab link to a separate Netlify origin. Verification proves the live DOM contains all six titles and hrefs; it does not open those tabs.

## Sub-features

- `work-heading` is #work section-index "02 / Personal research" and heading "Questions explored through visual research."
- `work-01` is "AI Agent Architecture" to https://jbm-agent-architecture.netlify.app
- `work-02` is "AI Agents Escaping Sandboxes" to https://jbm-agent-sandbox-review.netlify.app
- `work-03` is "Open, But How Open?" to https://jbm-open-models-explained.netlify.app
- `work-04` is "The Hidden Cost of AI Agents" to https://jbm-harness-economics.netlify.app
- `work-05` is "Secure SDLC: STRIDE, PASTA & SSDF" to https://jbm-secure-sdlc.netlify.app
- `work-06` is "Hacking a Satellite—Safely Explained" to https://jbm-satellite-cyber.netlify.app

## How to get to it (user POV)

- From the hero, choose Work in primary nav or the explore-work circle (#work).
- Load https://jesusmbm.github.io/jbusty.github.io/#work directly.
- Scan the six a.project cards. Choosing a card would open a new tab — do not do that during verification.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true.
- Do not goto or otherwise navigate chrome to any netlify.app URL.

- **Reach the section.** A visitor opens Work. Run `node control-jbusty.mjs goto --url '#work' --path /tmp/verify-jbusty-evidence/work.png`. JSON found is true, id is work.
- **Snapshot the cards.** Observe all six titles and hrefs. Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/work.html`. JSON ids includes work. The HTML (or the sibling .extract.txt) contains each title and each exact href listed above, target="_blank", heading text "Questions explored through visual research", and "02 / Personal research".
- **Proof.** All six title+href pairs are present in that dump-dom. Outbound pages are not loaded. A hash screenshot may still show the hero (see Gotchas); dump-dom is the Work proof.
- **Refuse following a card.** A visitor would choose card 01. Run `node control-jbusty.mjs goto --url 'https://jbm-agent-architecture.netlify.app'`. JSON ok is false (refusing outbound navigation). Run `node control-jbusty.mjs click a.project`. JSON error is "click refused on live", exit 2.

## Gotchas

- Unused Projects.jsx is an old #projects list. Live identity is #work with class project cards. Doctor and this recipe fail if only #projects is present.
- Card 06 title uses an em dash (Hacking a Satellite—Safely Explained). Assert that exact string.
- rel="noreferrer" plus target="_blank" is expected. Presence of hrefs is the proof; HTTP status of Netlify apps is out of scope.
- Never pass a project URL to chrome dump-dom. That leaves the portfolio origin and is not this feature.
- Quote `--url '#work'`. Unquoted `#work` is a shell comment.
- Headless `--screenshot` of a hash URL often still shows the hero. Dump-dom id found is the Work proof; do not relabel a hero PNG as work.png proof of scroll.
