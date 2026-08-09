import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

const motionTokens = {
  duration: { instant: 0.08, fast: 0.18, normal: 0.35, slow: 0.6, crawl: 1, ambient: 14, marquee: 24 },
  easing: { smooth: [0.22, 1, 0.36, 1], sharp: [0.4, 0, 0.2, 1], linear: [0, 0, 1, 1] },
  distance: { sm: 8, md: 16, lg: 24, xl: 48 },
  scale: { subtle: 0.98, press: 0.95, pop: 1.04 },
}

const springs = {
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
}

const projects = [
  {
    number: '01',
    title: 'Building Security In',
    type: 'Secure software engineering',
    description: 'My applied-learning study of the Secure SDLC, STRIDE, PASTA, data-flow diagrams, security gates, and NIST SSDF.',
    tools: ['Secure SDLC', 'STRIDE', 'PASTA'],
    status: 'Research note',
    url: 'https://jbm-secure-sdlc.netlify.app',
  },
  {
    number: '02',
    title: 'Hacking a Satellite—Safely Explained',
    type: 'Space systems security',
    description: 'A visual investigation of how ground stations, radio links, software updates, supply chains, and credentials shape the security of satellites.',
    tools: ['Space Systems', 'Threat Modeling', 'NIST'],
    status: 'Visual investigation',
    url: 'https://jbm-satellite-cyber.netlify.app',
  },
  {
    number: '03',
    title: 'AI Agents Escaping Sandboxes',
    type: 'AI security review',
    description: 'My review of how agentic systems cross intended boundaries—and why permissions, tool mediation, and observability matter more than trusting model behavior.',
    tools: ['AI Security', 'Sandboxing', 'Threat Modeling'],
    status: 'Field note',
    url: 'https://jbm-agent-sandbox-review.netlify.app',
  },
]

const capabilities = [
  ['Observe', 'SIEM operations, packet analysis, log collection'],
  ['Investigate', 'Threat hunting, incident triage, vulnerability analysis'],
  ['Build', 'Python, PowerShell, detection rules, security labs'],
  ['Communicate', 'Risk reporting, remediation guidance, documentation'],
]

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function AnimatedText({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : motionTokens.distance.xl }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? motionTokens.duration.fast : motionTokens.duration.crawl, ease: motionTokens.easing.smooth, delay }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, springs.snappy)
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, reduce ? 0 : -110])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0.18])
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 270])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.header className="nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}>
        <a className="brand" href="#top" aria-label="Jesus Bustillos-Molina, home">JBM<span>°</span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="nav-links">
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="nav-links" className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </motion.header>

      <main id="top">
        <section className="hero section-shell">
          <motion.div
            className="ambient-scan"
            animate={reduce ? undefined : { x: ['-15vw', '115vw'] }}
            transition={{ duration: motionTokens.duration.ambient, ease: motionTokens.easing.linear, repeat: Infinity }}
            aria-hidden="true"
          />
          <div className="hero-meta reveal" data-reveal>
            <span className="availability"><i /> Available for security opportunities</span>
            <span>39.1836° N / 96.5717° W</span>
          </div>
          <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionTokens.duration.crawl, ease: motionTokens.easing.smooth }}>
            <p className="kicker">Cybersecurity analyst</p>
            <h1>I find the signal<br />inside the <em>noise.</em></h1>
          </motion.div>
          <div className="hero-footer reveal" data-reveal>
            <p>I investigate threats, build resilient systems, and turn technical findings into clear action.</p>
            <a className="circle-link" href="#work" aria-label="Explore selected work"><Arrow /></a>
          </div>
          <motion.div className="hero-orbit" style={{ rotate: orbitRotate }} aria-hidden="true">
            <span className="orbit-ring ring-one" />
            <span className="orbit-ring ring-two" />
            <span className="orbit-dot" />
            <span className="crosshair">+</span>
          </motion.div>
        </section>

        <section className="statement section-shell">
          <p className="section-index reveal" data-reveal>01 / Approach</p>
          <AnimatedText className="statement-copy"><p>Security is not a checklist. It is the practice of <span>paying close attention</span>—to systems, people, and the details others overlook.</p></AnimatedText>
        </section>

        <section id="work" className="work section-shell">
          <div className="section-heading reveal" data-reveal>
            <p className="section-index">02 / Personal research</p>
            <h2>Ideas studied deeply.<br /><em>Lessons applied visually.</em></h2>
          </div>
          <div className="project-list">
            {projects.map(project => (
              <motion.article className="project reveal" data-reveal key={project.number} whileHover={reduce ? undefined : { x: 12, scale: 1.003 }} transition={springs.snappy}>
                <div className="project-number">{project.number}</div>
                <div className="project-main">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.url ? <a href={project.url} target="_blank" rel="noreferrer">{project.title}</a> : project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul>{project.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
                </div>
                <div className="project-side">
                  <span className="project-status"><i /> {project.status}</span>
                  {project.url ? <a className="project-arrow" href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><Arrow diagonal /></a> : <span className="project-arrow"><Arrow diagonal /></span>}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <div className="signal-strip" aria-hidden="true">
          <motion.div
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: motionTokens.duration.marquee, ease: motionTokens.easing.linear, repeat: Infinity }}
          >
            <span>Observe · Investigate · Understand · Respond ·</span>
            <span>Observe · Investigate · Understand · Respond ·</span>
          </motion.div>
        </div>

        <section id="about" className="about section-shell">
          <div className="about-heading reveal" data-reveal>
            <p className="section-index">03 / Profile</p>
            <h2>Curious by nature.<br />Methodical by <em>practice.</em></h2>
          </div>
          <div className="about-grid">
            <div className="profile-mark reveal" data-reveal aria-hidden="true">
              <span>J</span><span>B</span><span>M</span>
            </div>
            <div className="about-copy reveal" data-reveal>
              <p>I’m Jesus Bustillos-Molina, a cybersecurity analyst with a foundation in both business systems and information security.</p>
              <p>With a BS in Management Information Systems, an MS in Cybersecurity &amp; Information Assurance, and an ISC² CC certification, I bring technical curiosity and practical communication to every investigation.</p>
              <a className="text-link" href="mailto:jbustillosmolina@gmail.com">Start a conversation <Arrow /></a>
            </div>
          </div>
          <div className="capabilities">
            {capabilities.map(([title, body], index) => (
              <motion.div className="capability reveal" data-reveal key={title} whileHover={reduce ? undefined : { x: 10 }} transition={springs.snappy}>
                <span>0{index + 1}</span><h3>{title}</h3><p>{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact section-shell">
          <div className="contact-label reveal" data-reveal><i /> Open to what’s next</div>
          <div className="contact-copy reveal" data-reveal>
            <p>Have a problem worth investigating?</p>
            <motion.a href="mailto:jbustillosmolina@gmail.com" whileHover={reduce ? undefined : { x: 8 }} whileTap={reduce ? undefined : { scale: motionTokens.scale.press }} transition={springs.snappy}>Let’s talk.<Arrow diagonal /></motion.a>
          </div>
          <footer>
            <span>© {new Date().getFullYear()} Jesus Bustillos-Molina</span>
            <div><a href="https://github.com/JesusMBM" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jesus-bm/" target="_blank" rel="noreferrer">LinkedIn</a></div>
            <a href="#top">Back to top ↑</a>
          </footer>
        </section>
      </main>
    </>
  )
}

export default App
