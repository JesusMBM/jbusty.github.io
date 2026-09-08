import { cp, mkdir } from 'node:fs/promises'
const sites = ['jbm-agent-architecture','jbm-agent-sandbox-review','jbm-open-models-explained','jbm-harness-economics','jbm-secure-sdlc','jbm-satellite-cyber']
for (const slug of sites) {
  const output = `dist/research/${slug}`
  await mkdir(output, { recursive: true })
  await cp(`connected-sites/${slug}`, output, { recursive: true })
}
console.log(`Packaged ${sites.length} updated research guides.`)
