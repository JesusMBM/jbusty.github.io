# Work / personal research

Work lists six visual-research project cards that open external explainers in a new tab, numbered 01–06, under `#work`.

## Sub-features

- `work-heading` shows `02 / Personal research` and `Questions explored through visual research.`
- `work-01` is `AI Agent Architecture` → `https://jbm-agent-architecture.netlify.app`
- `work-02` is `AI Agents Escaping Sandboxes` → `https://jbm-agent-sandbox-review.netlify.app`
- `work-03` is `Open, But How Open?` → `https://jbm-open-models-explained.netlify.app`
- `work-04` is `The Hidden Cost of AI Agents` → `https://jbm-harness-economics.netlify.app`
- `work-05` is `Secure SDLC: STRIDE, PASTA & SSDF` → `https://jbm-secure-sdlc.netlify.app`
- `work-06` is `Hacking a Satellite—Safely Explained` → `https://jbm-satellite-cyber.netlify.app`

## How to get to it (user POV)

- Choose `Work` in `#nav-links`.
- Choose the hero circle link `Explore selected work` (`a.circle-link` `href=#work`).
- Scroll to the section labeled `02 / Personal research`.
- Choose a project card (`a.project`) to open the explainer in a new tab.

## Driving it with control-jbusty

Preconditions:

- Live Pages is healthy: `node control-jbusty.mjs doctor` exits 0.
- Do not click project URLs on production from this CLI (`click` is refused).
- External Netlify apps are out of scope for this skill except as href values.

- **Open Work.** Run `node control-jbusty.mjs goto work`. JSON `hash` is `#work`, `sectionPresent` is true.
- **List cards.** Run `node control-jbusty.mjs snapshot`. JSON `projects` has six entries `01`–`06` with `present: true` for each title above.
- **Href proof.** From the same dump-dom (snapshot/doctor), confirm each title is followed in-page by its netlify URL as listed in Sub-features. Record the six hrefs in the proof notes.
- **Do not follow off-site.** Do not `click a.project` on live. Off-site explainers are a different origin.
- **Proof.** Copy the goto screenshot to `/workspace/jbusty-verify-proof/work.png` (`cp /tmp/jbusty-verify-evidence-proof/work.png /workspace/jbusty-verify-proof/work.png`). Confirm the file remains after chrome child cleanup. The image should include the work heading or at least a project title when scrolled to `#work`.

## Gotchas

- Cards are `a.project` with `target=_blank` and visually hidden `(opens in a new tab)`. Assert titles and hrefs, not a same-origin navigation.
- Numbering is `01`–`06` in `div.project-number`. Do not assume DOM order equals CSS grid order without reading the numbers.
- Doctor already requires `AI Agent Architecture`; still snapshot all six before calling Work verified.
- Hash `#work` may screenshot the viewport after jump; if the PNG shows only the hero, rerun `goto work` and keep the evidence copy — do not crop from a home shot and relabel it.
