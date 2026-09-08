import { readFile, writeFile, readdir, mkdir, copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const files = (await readdir(`${root}/research/content`)).filter(f=>f.endsWith('.json')).sort()
const guides = await Promise.all(files.map(async f=>JSON.parse(await readFile(`${root}/research/content/${f}`,'utf8'))))
const portfolio='https://jesusmbm.github.io/jbusty.github.io/'
const url=slug=>slug==='honeyquest'?`${portfolio}honeyquest/`:`https://${slug}.netlify.app/`
function refs(ids=[],sources){return ids.length?`<p class="references">Sources: ${ids.map(id=>{const s=sources.find(s=>s.id===id);if(!s)throw Error(`Missing source ${id}`);return `<a href="${escape(s.url)}">${escape(s.short || s.title)}</a>`}).join(' · ')}</p>`:''}
function block(b,sources){
 if(b.type==='p') return `<p>${escape(b.text)}</p>${refs(b.sources,sources)}`
 if(b.type==='list') return `<${b.ordered?'ol':'ul'}>${b.items.map(s=>`<li>${escape(s)}</li>`).join('')}</${b.ordered?'ol':'ul'}>${refs(b.sources,sources)}`
 if(b.type==='callout')return `<aside class="callout"><strong>${escape(b.title)}</strong><p>${escape(b.text)}</p></aside>${refs(b.sources,sources)}`
 if(b.type==='table')return `<div class="table-scroll" tabindex="0" role="region" aria-label="${escape(b.caption)}"><table><caption>${escape(b.caption)}</caption><thead><tr>${b.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${escape(cell)}</th>`:`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${refs(b.sources,sources)}`
 if(b.type==='flow')return `<figure class="flow"><figcaption>${escape(b.title)}</figcaption><ol>${b.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><p>${escape(b.note||'Conceptual example.')}</p></figure>${refs(b.sources,sources)}`
 if(b.type==='cards')return `<div class="cards">${b.items.map(i=>`<article><h3>${escape(i.title)}</h3><p>${escape(i.text)}</p></article>`).join('')}</div>${refs(b.sources,sources)}`
 if(b.type==='interactive')return `<div class="interactive" data-interactive="${escape(b.kind)}"><h3>${escape(b.title)}</h3><p>${escape(b.description||'')}</p><div class="interactive-body"></div><noscript><p>Turn on JavaScript to use this exercise. The explanation and source tables on this page are available without it.</p></noscript><script type="application/json" class="interactive-data">${JSON.stringify(b.data).replace(/</g,'\\u003c')}</script></div>${refs(b.sources,sources)}`
 if(b.type==='video')return `<div class="video"><iframe src="${escape(b.embed)}" title="${escape(b.title)}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p><a href="${escape(b.url)}">${escape(b.title)} — open the video</a></p></div>${refs(b.sources,sources)}`
 throw Error(`Unknown block type ${b.type}`)
}
for(const [index,g] of guides.entries()){
 const out=`${root}/${g.slug==='honeyquest'?'public/honeyquest':`connected-sites/${g.slug}`}`;await mkdir(out,{recursive:true})
 const words=JSON.stringify(g.sections).split(/\s+/).length, minutes=Math.max(3,Math.ceil(words/200))
 const next=guides[(index+1)%guides.length]
 const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#254f40"><meta name="description" content="${escape(g.summary)}"><link rel="canonical" href="${url(g.slug)}"><title>${escape(g.title)} — Jesus Bustillos-Molina</title><link rel="stylesheet" href="./guide.css"></head>
<body data-research="${escape(g.slug)}"><a class="skip" href="#main">Skip to the guide</a>
<header class="site-header"><a class="brand" href="${portfolio}"><b>JBM</b><span>← Portfolio</span></a><details class="research-menu"><summary>All guides</summary><nav aria-label="Research guides">${guides.map(p=>`<a data-guide="${escape(p.slug)}" href="${url(p.slug)}" ${p.slug===g.slug?'aria-current="page"':''}>${escape(p.title)}</a>`).join('')}</nav></details></header>
<main id="main"><section class="guide-hero" id="top"><p class="eyebrow">${escape(g.category)}</p><h1>${escape(g.title)}</h1><p class="summary">${escape(g.summary)}</p><p class="byline">By Jesus Bustillos-Molina · Reviewed <time datetime="${escape(g.reviewed)}">${escape(g.reviewedLabel)}</time> · About ${minutes} minutes</p><div class="takeaways"><h2>Start here</h2><ul>${g.takeaways.map(t=>`<li>${escape(t)}</li>`).join('')}</ul></div></section>
<div class="reading-layout"><aside class="contents"><details open><summary>On this page</summary><nav aria-label="On this page">${g.sections.map(s=>`<a href="#${escape(s.id)}">${escape(s.title)}</a>`).join('')}<a href="#glossary">Words explained</a><a href="#sources">Sources and review notes</a></nav></details></aside><article class="guide-body">${g.sections.map((s,i)=>`<section id="${escape(s.id)}">${(s.aliases||[]).map(id=>`<span id="${escape(id)}" class="anchor-alias" aria-hidden="true"></span>`).join('')}<p class="section-number">${String(i+1).padStart(2,'0')} / ${escape(g.category)}</p><h2>${escape(s.title)}</h2>${s.blocks.map(b=>block(b,g.sources)).join('')}</section>`).join('')}
<section id="glossary"><h2>Words explained</h2><dl class="glossary">${g.glossary.map(([term,definition])=>`<div><dt>${escape(term)}</dt><dd>${escape(definition)}</dd></div>`).join('')}</dl></section>
<section id="sources"><h2>Sources and review notes</h2><p>${escape(g.reviewNote)}</p><ol class="source-list">${g.sources.map(s=>`<li id="source-${escape(s.id)}"><a href="${escape(s.url)}">${escape(s.title)}</a><p>${escape(s.note||'')}${s.published?` Published or revised: ${escape(s.published)}.`:''} Checked: ${escape(s.checked || g.reviewed)}.</p></li>`).join('')}</ol></section></article></div></main>
<footer><p>JBM / Research explained</p><div><a href="${portfolio}#work">Back to all research</a><a data-guide="${escape(next.slug)}" href="${url(next.slug)}">Next: ${escape(next.title)} →</a></div></footer><script type="module" src="./guide.js"></script></body></html>`
 await writeFile(`${out}/index.html`,html)
 for(const f of ['guide.css','guide.js','calculations.mjs'])await copyFile(`${root}/research/assets/${f}`,`${out}/${f}`)
}
console.log(`Generated ${guides.length} complete, source-backed guides.`)
