import { cp, mkdir } from 'node:fs/promises'

const sites = [
  'jbm-agent-architecture',
  'jbm-agent-sandbox-review',
  'jbm-open-models-explained',
  'jbm-harness-economics',
  'jbm-secure-sdlc',
  'jbm-satellite-cyber',
]

for (const slug of sites) {
  const output = `dist/research/${slug}`
  await mkdir(output, { recursive: true })
  await cp(`connected-sites/${slug}`, output, { recursive: true })
}

// This standalone dossier lives in research/, rather than connected-sites/.
// Copy it into the Vite output so GitHub Pages actually deploys its index.html.
const frontierOutput = 'dist/research/jbm-ai-cybersecurity-frontier'
await mkdir(frontierOutput, { recursive: true })
await cp('research/jbm-ai-cybersecurity-frontier', frontierOutput, { recursive: true })

console.log(`Packaged ${sites.length} updated research guides and the AI cybersecurity frontier dossier.`)
