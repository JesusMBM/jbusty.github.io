import styles from './Skills.module.css'
import useReveal from '../hooks/useReveal'

const categories = [
  {
    name: 'Security Tools',
    color: 'var(--ctp-mauve)',
    items: ['Wireshark', 'Nmap', 'Burp Suite', 'Metasploit', 'Nessus'],
  },
  {
    name: 'SIEM & Monitoring',
    color: 'var(--ctp-blue)',
    items: ['Splunk', 'Microsoft Sentinel', 'ELK Stack', 'Chronicle'],
  },
  {
    name: 'Frameworks',
    color: 'var(--ctp-teal)',
    items: ['NIST CSF', 'MITRE ATT&CK', 'ISO 27001', 'OWASP'],
  },
  {
    name: 'Scripting & OS',
    color: 'var(--ctp-peach)',
    items: ['Python', 'PowerShell', 'Bash', 'Linux', 'Windows'],
  },
]

export default function Skills() {
  const ref = useReveal()

  return (
    <section id="skills" ref={ref}>
      <div className="container">
        <p className="section-eyebrow reveal">cat ./skills.json</p>
        <h2 className="section-heading reveal">Tools &amp; Technologies</h2>

        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`${styles.category} reveal`}
              style={{ '--cat': cat.color, transitionDelay: `${i * 70}ms` }}
            >
              <div className={styles.head}>
                <span className={styles.glyph} aria-hidden="true" />
                <h3 className={styles.catName}>{cat.name}</h3>
              </div>
              <ul className={styles.list}>
                {cat.items.map((item) => (
                  <li key={item} className={styles.item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
