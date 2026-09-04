import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
const sites = ['jbm-agent-architecture','jbm-agent-sandbox-review','jbm-open-models-explained','jbm-harness-economics','jbm-secure-sdlc','jbm-satellite-cyber']
for (const slug of sites) {
  const output = `dist/research/${slug}`
  await mkdir(output, { recursive: true })
  await cp(`connected-sites/${slug}`, output, { recursive: true })
  for (const file of ['research-theme.css','research-shell.js']) await cp(`connected-sites/${file}`, `${output}/${file}`)
  const html = await readFile(`${output}/index.html`, 'utf8')
  await writeFile(`${output}/index.html`, html.replace('data-research=', 'data-review="true" data-research='))
}
console.log(`Packaged ${sites.length} research review pages.`)
