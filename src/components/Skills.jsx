import styles from './Skills.module.css'

const categories = [
  {
    name: 'Security Tools',
    items: ['Wireshark', 'Nmap', 'Burp Suite', 'Metasploit'],
  },
  {
    name: 'SIEM & Monitoring',
    items: ['Splunk', 'Microsoft Sentinel', 'ELK Stack', 'Chronicle'],
  },
  {
    name: 'Frameworks',
    items: ['NIST CSF', 'MITRE ATT&CK', 'ISO 27001', 'OWASP'],
  },
  {
    name: 'Scripting & OS',
    items: ['Python', 'PowerShell', 'Bash', 'Linux / Windows'],
  },
]

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <p className="section-eyebrow">Stack</p>
        <h2 className="section-heading">Tools &amp; Technologies</h2>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <div key={cat.name} className={styles.category}>
              <h3 className={styles.catName}>{cat.name}</h3>
              <ul className={styles.list}>
                {cat.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.bullet} aria-hidden="true">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
