import styles from './Projects.module.css'

const projects = [
  {
    title: 'Home SOC Lab',
    description:
      'Personal security operations lab for practicing threat detection, log analysis, and incident response using a SIEM and intentionally vulnerable machines.',
    tags: ['Splunk', 'VirtualBox', 'Kali Linux'],
    github: '#',
    live: null,
  },
  {
    title: 'Vulnerability Assessment Report',
    description:
      'Conducted a full vulnerability assessment on a target environment — enumeration, scanning, risk scoring, and a written remediation report following NIST guidelines.',
    tags: ['Nmap', 'Nessus', 'NIST CSF'],
    github: '#',
    live: null,
  },
  {
    title: 'Threat Hunting Playbook',
    description:
      'Developed detection rules and a structured playbook for hunting common adversary techniques mapped to MITRE ATT&CK, implemented in a SIEM environment.',
    tags: ['MITRE ATT&CK', 'Splunk', 'Python'],
    github: '#',
    live: null,
  },
]

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <p className="section-eyebrow">Work</p>
        <h2 className="section-heading">Things I&rsquo;ve built</h2>
        <div className={styles.grid}>
          {projects.map((p) => (
            <article key={p.title} className={styles.card}>
              <div className={styles.cardTop}>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <div className={styles.cardLinks}>
                  <a href={p.github} className={styles.iconLink} aria-label="GitHub repo">
                    <GitHubIcon />
                  </a>
                  {p.live && (
                    <a href={p.live} className={styles.iconLink} aria-label="Live demo">
                      <ExternalIcon />
                    </a>
                  )}
                </div>
              </div>
              <p className={styles.cardDesc}>{p.description}</p>
              <ul className={styles.tags}>
                {p.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
