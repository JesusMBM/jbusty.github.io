(() => {
  const projects = [
    ['jbm-agent-architecture','AI Agent Architecture'],
    ['jbm-agent-sandbox-review','AI Agents Escaping Sandboxes'],
    ['jbm-open-models-explained','Open, But How Open?'],
    ['jbm-harness-economics','The Hidden Cost of AI Agents'],
    ['jbm-secure-sdlc','Secure SDLC'],
    ['jbm-satellite-cyber','Satellite Security'],
    ['honeyquest','Honeyquest for LLMs']
  ];
  const portfolio = 'https://jesusmbm.github.io/jbusty.github.io/';
  const current = document.body.dataset.research;
  const reviewing = document.body.dataset.review === 'true';
  const link = (slug) => reviewing && slug !== 'honeyquest' ? '../' + slug + '/' : slug === 'honeyquest' ? portfolio + 'honeyquest/' : `https://${slug}.netlify.app/`;
  const header = document.createElement('div');
  header.className = 'jbm-header';
  header.setAttribute('role','banner');
  const home = document.createElement('a'); home.className='jbm-home';home.href=portfolio;
  const mark=document.createElement('b');mark.textContent='JBM';const back=document.createElement('span');back.textContent='← Portfolio';home.append(mark,back);
  const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='All research';
  const links=document.createElement('div');links.className='jbm-links';
  projects.forEach(([slug,title])=>{const a=document.createElement('a');a.href=link(slug);a.textContent=title;if(slug===current)a.setAttribute('aria-current','page');links.append(a)});
  details.append(summary,links);header.append(home,details);document.body.prepend(header);
  header.addEventListener('keydown',e=>{if(e.key==='Escape'){details.open=false;summary.focus()}});
  document.addEventListener('click',e=>{if(!header.contains(e.target))details.open=false});
  const footer=document.createElement('div');footer.className='jbm-footer';footer.setAttribute('role','contentinfo');
  const label=document.createElement('p');label.textContent='JBM / Independent research';const row=document.createElement('div');
  const all=document.createElement('a');all.href=portfolio+'#work';all.textContent='Back to all research';
  const next=projects[(projects.findIndex(([slug])=>slug===current)+1)%projects.length];const nextLink=document.createElement('a');nextLink.href=link(next[0]);nextLink.textContent='Read next: '+next[1]+' →';row.append(all,nextLink);footer.append(label,row);document.body.append(footer);
  const root=document.getElementById('root') || document.body;
  let adopted = false;
  const adopt=()=>{
    if (adopted) return;
    const original=root.querySelector(':scope > .site-header, :scope > header.nav, :scope > header:has(nav), :scope > nav, :scope > main > .site-header');
    if (!original || original.closest('.jbm-header')) return;
    adopted=true;
    const anchors=[...original.querySelectorAll('a[href^="#"]')];
    if(anchors.length){
      const article=document.createElement('details');article.className='jbm-article-menu';
      const title=document.createElement('summary');title.textContent='On this page';
      const items=document.createElement('div');items.className='jbm-links';
      anchors.forEach(source=>{const a=document.createElement('a');a.href=source.getAttribute('href');a.textContent=source.textContent;a.addEventListener('click',()=>{article.open=false;const target=document.getElementById(a.hash.slice(1));if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}});items.append(a)});
      article.append(title,items);header.insertBefore(article,details);
      article.addEventListener('toggle',()=>{if(article.open)details.open=false});
      details.addEventListener('toggle',()=>{if(details.open)article.open=false});
      document.addEventListener('click',e=>{if(!header.contains(e.target))article.open=false});
      article.addEventListener('keydown',e=>{if(e.key==='Escape'){article.open=false;title.focus();e.stopPropagation()}});
    }
    original.classList.add('jbm-original-nav');
  };
  adopt();const observer=new MutationObserver(adopt);observer.observe(root,{childList:true,subtree:true});window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
