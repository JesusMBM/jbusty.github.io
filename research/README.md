# Research guides

The seven JSON files in `content/` are the editable source for the connected guides. `generate.mjs` produces complete static HTML for six existing Netlify sites and the portfolio's Honeyquest route. The pages work as readable articles without JavaScript; interactive teaching tools use `assets/guide.js` and `assets/calculations.mjs`.

Each factual block names its source IDs. Every guide includes the real source-review date, limitations, definitions, and original source URLs. Editing a page does not automatically advance its source-review date. Pricing is a dated snapshot; nothing on these pages represents a continuously refreshed feed. Recheck provider rate cards, thresholds, cache rules, and limits before updating pricing dates.

Run `npm run build` to regenerate and package all pages. Run `npm run test:research` for calculator regression checks. The existing portfolio deployment includes copies of the guides under `research/<slug>/`; each `connected-sites/<slug>` directory is also a standalone static deployment for its existing Netlify site.

The old compiled snapshots have been replaced by authored content. The research findings are distinguished from invented teaching examples. No claim is made that model cost is a quality score or that a simulated exercise predicts a real attack.
