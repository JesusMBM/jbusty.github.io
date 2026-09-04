# Connected research redesign

Astra supplied the portfolio design direction and source audit. The portfolio React source is redesigned in `src/`; Honeyquest retains its authored page in `public/honeyquest/`.

The six directories here contain **snapshots of the existing public Netlify deploys**, retrieved on 2026-09-04, plus the shared research presentation. These are deployable static bundles, not recovered framework source. Original research content, citations, diagrams, calculators, and application JavaScript are retained. The satellite bundle references its original public hero image by an absolute URL so review pages can display it.

`research-theme.css` and `research-shell.js` are the shared authored files. They add the portfolio return link, an accessible research menu, next-article navigation, a consistent reading hierarchy, compact section spacing, and reduced-motion support. Each static directory includes copies for independent deployment. `npm run build` also packages all six under `dist/research/` for review; it does not deploy them.

| Directory | Existing Netlify site ID | Original live URL |
| --- | --- | --- |
| jbm-agent-architecture | 06244e41-63a3-4b91-87c7-b05c9841845f | https://jbm-agent-architecture.netlify.app |
| jbm-agent-sandbox-review | 8995ffe8-c128-46fe-811d-9ceff82a5eb1 | https://jbm-agent-sandbox-review.netlify.app |
| jbm-open-models-explained | d06691b1-2f68-49aa-b50d-9bbefb62a3d5 | https://jbm-open-models-explained.netlify.app |
| jbm-harness-economics | 51653fd7-15f3-4c18-8de8-f7474999d4df | https://jbm-harness-economics.netlify.app |
| jbm-secure-sdlc | eb59ef92-f440-4523-adfe-72afe009e880 | https://jbm-secure-sdlc.netlify.app |
| jbm-satellite-cyber | 4405fd87-7752-4041-b565-dccedc6c7543 | https://jbm-satellite-cyber.netlify.app |

Deploy a reviewed static directory to its matching existing Netlify site. Do not create replacement sites. Prefer integrating the shared files into the original framework sources once those source projects are available, so a later framework deployment preserves the redesign.

The portfolio keeps its original live project URLs. Review copies cross-link within `/research/`; Honeyquest links to its existing GitHub Pages route. Third-party references, GitHub, and LinkedIn are destinations, not redesign targets.
