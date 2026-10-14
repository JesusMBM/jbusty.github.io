# Selected research

Section #work ("01 / Selected research", "Understand the systems you use.") lists seven research cards. All seven open in a new tab and are same-origin on GitHub Pages: cards 01–06 under /jbusty.github.io/research/, card 07 (decoys / Honeyquest) at an absolute /honeyquest/ URL. Verification proves the live DOM contains all seven titles and hrefs; it does not open those tabs.

## Sub-features

- `work-heading` is #work eyebrow "01 / Selected research", h2 "Understand the systems you use.", intro "Seven guides with everyday examples...".
- `work-01` (featured) is "How AI agents work" to /jbusty.github.io/research/jbm-agent-architecture/
- `work-02` is "When AI agents cross security boundaries" to /jbusty.github.io/research/jbm-agent-sandbox-review/
- `work-03` is "What “open” means for an AI model" to /jbusty.github.io/research/jbm-open-models-explained/
- `work-04` is "What an AI agent actually costs" to /jbusty.github.io/research/jbm-harness-economics/
- `work-05` is "How teams build safer software" to /jbusty.github.io/research/jbm-secure-sdlc/
- `work-06` is "How satellite systems stay secure" to /jbusty.github.io/research/jbm-satellite-cyber/
- `work-07` is "Can decoys mislead AI attackers?" to https://jesusmbm.github.io/jbusty.github.io/honeyquest/
- `card-anatomy` each a.research-card has card-meta "NN / type", an h3 title, a description, a status label, and "Read research" with sr-only "(opens in a new tab)".

## How to get to it (user POV)

- From the hero, choose Research in primary nav or Explore research (#work).
- Load https://jesusmbm.github.io/jbusty.github.io/#work directly.
- Scan the seven cards. Choosing a card would open a new tab — do not do that during verification.

## Driving it with control-jbusty

Preconditions:

- node control-jbusty.mjs doctor reports ok true (research-cards-7 found; researchCards.count 7, researchCards.missing []).
- Do not goto or otherwise navigate chrome to any research card URL.

- **Reach the section.** A visitor opens Research. Run `node control-jbusty.mjs goto --url '#work' --path /tmp/verify-jbusty-evidence/work.png`. JSON found is true, id is work.
- **Snapshot the cards.** Observe all seven titles and hrefs. Run `node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/work.html`. JSON ids includes work. The sibling work.extract.txt RESEARCH CARDS block lists each title -> exact href above with [target=_blank]; EYEBROWS includes "01 / Selected research"; HEADINGS includes "h2: Understand the systems you use.".
- **Proof.** All seven title+href pairs are present in that dump-dom. Research pages are not loaded. A hash screenshot may still show the hero (see Gotchas); dump-dom is the proof.
- **Refuse following a card.** A visitor would choose card 01. Run `node control-jbusty.mjs goto --url 'https://jesusmbm.github.io/jbusty.github.io/research/jbm-agent-architecture/'`. JSON ok is false, error "refusing project-path navigation". Run `node control-jbusty.mjs click a.research-card`. JSON error is "click refused on live", exit 2.

## Gotchas

- Cards are no longer on Netlify. Any https://jbm-*.netlify.app href is pre-redesign identity and fails doctor (old-netlify-cards).
- Cards 01–06 hrefs are root-relative (/jbusty.github.io/research/...) in dump-dom because they come from Vite BASE_URL; card 07 is absolute. Match the exact strings above.
- Card 03 title uses typographic quotes: What “open” means for an AI model. Assert that exact string.
- Only card 01 has class featured (full-width, dark). It is still an a.research-card.
- rel="noreferrer" plus target="_blank" is expected. Presence of hrefs is the proof; HTTP status of research pages is out of scope for this recipe.
- Unused Projects.jsx is an old #projects list. Doctor fails if #projects appears.
- Quote `--url '#work'`. Unquoted `#work` is a shell comment.
- Headless `--screenshot` of a hash URL often still shows the hero. Dump-dom id found is the proof; do not relabel a hero PNG as work.png proof of scroll.
