import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 32,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="skills" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow" data-reveal>// skills</p>
        <h2 className="section-heading" data-reveal>Tools &amp; Technologies</h2>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <div key={cat.name} className={styles.category} data-reveal>
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
