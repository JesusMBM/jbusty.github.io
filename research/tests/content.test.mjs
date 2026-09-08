import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile,readdir } from 'node:fs/promises'
const files=(await readdir(new URL('../content/',import.meta.url))).filter(f=>f.endsWith('.json'))
test('All seven guides have checked source references, unique anchors, and complete teaching controls',async()=>{
 assert.equal(files.length,7)
 for(const f of files){const g=JSON.parse(await readFile(new URL('../content/'+f,import.meta.url),'utf8'))
  assert.ok(g.summary&&g.takeaways.length>=2&&g.glossary.length>=3,f)
  assert.match(g.reviewed,/^2026-09-0[48]$/)
  const sources=new Set(g.sources.map(s=>s.id));assert.equal(sources.size,g.sources.length,`${f}: duplicate source IDs`)
  for(const s of g.sources)assert.match(s.url,/^https:\/\//)
  const ids=g.sections.map(s=>s.id);assert.equal(new Set([...ids,'sources','glossary']).size,ids.length+2,`${f}: duplicate section anchor`)
  for(const section of g.sections)for(const b of section.blocks){for(const ref of b.sources||[])assert.ok(sources.has(ref),`${f}: missing source ${ref}`)
   if(b.type==='interactive'){assert.ok(['openness','lifecycle','decoys','cost','comparison','quiz'].includes(b.kind));if(b.kind==='lifecycle')assert.equal(b.data.items.length,6);if(b.kind==='openness')assert.equal(b.data.items.length,3);if(b.kind==='decoys')assert.equal(b.data.items.length,7);if(['cost','comparison'].includes(b.kind))assert.ok(b.data.models.length>=1)}
  }
 }
})
