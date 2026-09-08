import { useState } from 'react'
import { projects } from './projects'

function ProjectCard({ project, featured = false }) {
  return <a className={`research-card ${featured ? 'featured' : ''}`} href={project.url} target="_blank" rel="noreferrer">
    <div className="card-meta"><span>{project.number} / {project.type}</span><span aria-hidden="true">↗</span></div>
    <div><h3>{project.title}</h3><p>{project.description}</p></div>
    <div className="card-bottom"><span>{project.status}</span><span>Read research<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></span></div>
  </a>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-nav">
      <a className="wordmark" href="#top" aria-label="Jesus Bustillos-Molina home">JBM<span> / </span><span className="wordmark-caption">Independent research</span></a>
      <button className="menu-button" aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}> {menuOpen ? 'Close' : 'Menu'}</button>
      <nav id="navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Primary" onKeyDown={e => { if (e.key === 'Escape') { close(); document.querySelector('.menu-button')?.focus() } }}>
        <a href="#work" onClick={close}>Research</a><a href="#about" onClick={close}>About</a><a href="#contact" onClick={close}>Contact <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
    <main id="main">
      <section className="hero shell" id="top">
        <div className="hero-content"><p className="eyebrow">Jesus Bustillos-Molina</p><h1>AI systems,<br/><span>examined closely.</span></h1><p className="hero-description">I build and study AI agents: software that uses tools to work through a task. I explain how these systems work, what they cost, and how to make them safer.</p><div className="hero-actions"><a className="button primary" href="#work">Explore research <span aria-hidden="true">↓</span></a><a className="button" href="#contact">Get in touch</a></div></div>
        <figure className="system-map"><figcaption><span>01 / How an AI agent works</span><span>Conceptual model</span></figcaption><div className="system-boundary"><p>RULES &amp; PERMISSIONS</p><div className="system-context">Information <small>The task and relevant background</small></div><span className="flow-line" aria-hidden="true">↓</span><div className="system-loop">AI agent <small>Choose a step · act · check</small></div><span className="flow-line" aria-hidden="true">↓</span><div className="system-tools">Tools <small>Search, calculate, or use software</small></div></div><div className="system-evaluation">Checks <span>Did it do the right thing?</span></div><p className="figure-note">The model suggests a step. The surrounding software limits and checks its actions.</p></figure>
        <div className="hero-baseline"><span>AI systems / AI security / Cybersecurity</span><span>Wichita, Kansas</span></div>
      </section>
      <section id="work" className="research shell"><div className="section-head"><div><p className="eyebrow">01 / Selected research</p><h2>Understand the systems you use.</h2></div><p>Seven guides with everyday examples, explanations of technical terms, and links to the original evidence.</p></div><div className="research-grid">{projects.map((project,i)=><ProjectCard key={project.number} project={project} featured={i===0}/>)}</div></section>
      <section id="about" className="about shell"><div><p className="eyebrow">02 / About</p><h2>Curiosity, with<br/>a security mindset.</h2></div><div className="about-body"><p className="intro">I’m Jesus. I work in cybersecurity and build AI tools. I’m interested in what happens when software can plan steps, use other systems, and make decisions on our behalf.</p><p>I’m a Cyber Security Analyst at Textron Aviation in Wichita, where I have worked full time since June 2025. I investigate security weaknesses, help teams plan fixes, coordinate risk reviews, and develop security automation. That work shapes the questions I bring to AI: does it work, where can it fail, and which checks help?</p><dl className="credentials"><div><dt>Education</dt><dd>Bachelor of Science in Management Information Systems, Kansas State University · Data Analytics Certificate</dd></div><div><dt>Continuing study</dt><dd>Master of Science in Cybersecurity and Information Assurance, Western Governors University · In progress</dd></div><div><dt>Certification</dt><dd>ISC2 Certified in Cybersecurity (CC)</dd></div></dl></div><div className="capabilities">{[['Build','Create AI tools and automate tasks with Python, Azure OpenAI, and software workflows'],['Check','Test whether a system completes its task, at what cost, and with what mistakes'],['Protect','Limit what tools can access, record their actions, and check software before release'],['Investigate','Review activity records, find security weaknesses, and explain risk to decision-makers']].map(([title,body],i)=><div key={title}><span className="eyebrow">0{i+1}</span><h3>{title}</h3><p>{body}</p></div>)}</div></section>
      <section id="contact" className="contact shell"><p className="eyebrow">03 / Contact</p><div className="contact-top"><h2>Something worth<br/>figuring out?</h2><a className="button primary" href="mailto:jbustillosmolina@gmail.com">Let’s talk <span aria-hidden="true">↗</span></a></div><p>AI tools, practical security questions, and explanations that people can use.</p><footer><span>© {new Date().getFullYear()} Jesus Bustillos-Molina</span><div><a href="https://github.com/JesusMBM" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/jesus-bm/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="#top">Back to top ↑</a></div></footer></section>
    </main>
  </>
}
