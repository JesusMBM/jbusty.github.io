import { useEffect, useRef, useState } from 'react'
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
    title: 'Secure SDLC: STRIDE, PASTA & SSDF',
    type: 'Software security research',
    description: 'An original, plain-language visual guide to building security into the software lifecycle and using threat models to make risk visible before release.',
    tools: ['Secure SDLC', 'STRIDE', 'PASTA', 'NIST SSDF'],
    status: 'Visual research',
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
  {
    number: '04',
    title: 'AI Agent Architecture',
    type: 'AI systems research',
    description: 'A dense visual guide to the loops, tools, context, graph workflows, evaluation, and safety layers that turn a language model into an agent system.',
    tools: ['Agent Loops', 'Graph Workflows', 'Evaluation', 'Safety'],
    status: 'Visual research',
    url: 'https://jbm-agent-architecture.netlify.app',
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
  const menuButtonRef = useRef(null)
  const navRef = useRef(null)
  const reduce = useReducedMotion()
  const [pageVisible, setPageVisible] = useState(true)
  const canAnimate = !reduce && pageVisible
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, springs.snappy)
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, canAnimate ? -110 : 0])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.14], [1, canAnimate ? 0.18 : 1])
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, canAnimate ? 270 : 0])

  useEffect(() => {
    const updateVisibility = () => {
      const visible = document.visibilityState !== 'hidden'
      setPageVisible(visible)
      document.documentElement.classList.toggle('motion-paused', !visible)
    }
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility)
      document.documentElement.classList.remove('motion-paused')
    }
  }, [])

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

  useEffect(() => {
    if (!menuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const focusable = [...navRef.current.querySelectorAll('a[href]')]
    document.body.style.overflow = 'hidden'
    focusable[0]?.focus()

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }

      if (event.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.header className="nav" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? motionTokens.duration.fast : motionTokens.duration.slow, ease: motionTokens.easing.smooth }}>
        <a className="brand" href="#top" aria-label="Jesus Bustillos-Molina, home">JBM<span>°</span></a>
        <button ref={menuButtonRef} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="nav-links" aria-label={`${menuOpen ? 'Close' : 'Open'} navigation menu`}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav ref={navRef} id="nav-links" className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </motion.header>

      <main id="main-content" tabIndex="-1">
        <section id="top" className="hero section-shell">
          <motion.div
            className="ambient-scan"
            animate={canAnimate ? { x: ['-15vw', '115vw'] } : { x: 0 }}
            transition={{ duration: motionTokens.duration.ambient, ease: motionTokens.easing.linear, repeat: Infinity }}
            aria-hidden="true"
          />
          <div className="hero-meta reveal" data-reveal>
            <span className="availability"><i /> Available for security opportunities</span>
            <span>CYBERSECURITY / AI SYSTEMS</span>
          </div>
          <motion.div className="hero-copy" style={canAnimate ? { y: heroY, opacity: heroOpacity } : undefined} initial={false}>
            <p className="kicker">Cybersecurity analyst</p>
            <h1>I find the signal<br />inside the <em>noise.</em></h1>
          </motion.div>
          <div className="hero-footer reveal" data-reveal>
            <p>I investigate threats, build resilient systems, and turn technical findings into clear action.</p>
            <a className="circle-link" href="#work" aria-label="Explore selected work"><Arrow /></a>
          </div>
          <motion.div className="hero-orbit" style={canAnimate ? { rotate: orbitRotate } : undefined} aria-hidden="true">
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
            <h2>Questions explored<br /><em>through visual research.</em></h2>
          </div>
          <div className="project-list">
            {projects.map(project => (
              <motion.a className="project reveal" data-reveal key={project.number} href={project.url} target="_blank" rel="noreferrer" whileHover={canAnimate ? { x: 12, scale: 1.003 } : undefined} transition={springs.snappy}>
                <div className="project-number">{project.number}</div>
                <div className="project-main">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}<span className="sr-only"> (opens in a new tab)</span></h3>
                  <p className="project-description">{project.description}</p>
                  <ul>{project.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
                </div>
                <div className="project-side">
                  <span className="project-status"><i /> {project.status}</span>
                  <span className="project-arrow" aria-hidden="true"><Arrow diagonal /></span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <div className="signal-strip" aria-hidden="true">
          <motion.div
            animate={canAnimate ? { x: ['0%', '-50%'] } : { x: 0 }}
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
            <motion.div className="capability reveal" data-reveal key={title} whileHover={canAnimate ? { x: 10 } : undefined} transition={springs.snappy}>
                <span>0{index + 1}</span><h3>{title}</h3><p>{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact section-shell">
          <div className="contact-label reveal" data-reveal><i /> Open to what’s next</div>
          <div className="contact-copy reveal" data-reveal>
            <p>Have a problem worth investigating?</p>
          <motion.a href="mailto:jbustillosmolina@gmail.com" whileHover={canAnimate ? { x: 8 } : undefined} whileTap={canAnimate ? { scale: motionTokens.scale.press } : undefined} transition={springs.snappy}>Let’s talk.<Arrow diagonal /></motion.a>
          </div>
          <footer>
            <span>© {new Date().getFullYear()} Jesus Bustillos-Molina</span>
          <div><a href="https://github.com/JesusMBM" target="_blank" rel="noreferrer">GitHub<span className="sr-only"> (opens in a new tab)</span></a><a href="https://www.linkedin.com/in/jesus-bm/" target="_blank" rel="noreferrer">LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></div>
            <a href="#top">Back to top ↑</a>
          </footer>
        </section>
      </main>
    </>
  )
}

export default App
