# Connected research redesign

Astra supplied the portfolio design direction and source audit. The portfolio React source is redesigned in `src/`; Honeyquest retains its authored page in `public/honeyquest/`.

The six directories contain complete static sites generated from the authored JSON in `research/content/`. They replace the previous compiled deployment snapshots. Honeyquest is generated into `public/honeyquest/`.

The guides preserve the learning interactions: model access tabs, the cost calculator and sortable comparison, lifecycle-stage selector, and fictional decoy exercise. Source links, precise evidence limits, and glossaries are included throughout. Provider prices were reconfirmed September 8, 2026; other source-review dates remain accurately marked September 4. There is no live data feed.

`npm run build` regenerates all seven guides and includes the six Netlify-targeted guides under `dist/research/`. The portfolio now links to these local copies so a portfolio deployment publishes the revised reading experience together. Each static directory remains deployable to its original Netlify site below. Updating this repository does not itself publish those separate Netlify deployments.

| Directory | Existing Netlify site ID | Original live URL |
| --- | --- | --- |
| jbm-agent-architecture | 06244e41-63a3-4b91-87c7-b05c9841845f | https://jbm-agent-architecture.netlify.app |
| jbm-agent-sandbox-review | 8995ffe8-c128-46fe-811d-9ceff82a5eb1 | https://jbm-agent-sandbox-review.netlify.app |
| jbm-open-models-explained | d06691b1-2f68-49aa-b50d-9bbefb62a3d5 | https://jbm-open-models-explained.netlify.app |
| jbm-harness-economics | 51653fd7-15f3-4c18-8de8-f7474999d4df | https://jbm-harness-economics.netlify.app |
| jbm-secure-sdlc | eb59ef92-f440-4523-adfe-72afe009e880 | https://jbm-secure-sdlc.netlify.app |
| jbm-satellite-cyber | 4405fd87-7752-4041-b565-dccedc6c7543 | https://jbm-satellite-cyber.netlify.app |

Deploy a reviewed static directory to its matching existing Netlify site. Do not create replacement sites. Source updates belong in `research/content/` and the shared assets under `research/assets/`, followed by regeneration.

GitHub and LinkedIn are external destinations, not redesign targets. The independent Netlify origins need their own authorized deployment after review.
