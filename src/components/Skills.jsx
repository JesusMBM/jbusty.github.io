import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './Skills.module.css'

const row1 = ['Wireshark', 'Nmap', 'Burp Suite', 'Metasploit', 'Splunk', 'Microsoft Sentinel', 'ELK Stack', 'Chronicle']
const row2 = ['NIST CSF', 'MITRE ATT&CK', 'ISO 27001', 'OWASP', 'Python', 'PowerShell', 'Bash', 'Linux / Windows']

function MarqueeRow({ items, reverse }) {
  const doubled = [...items, ...items]
  return (
    <div className={styles.track}>
      <div className={`${styles.inner} ${reverse ? styles.reverse : ''}`}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.chip}>{item}</span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelector('.section-eyebrow'), {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
    gsap.from(sectionRef.current.querySelector('.section-heading'), {
      clipPath: 'inset(0 0 100% 0)',
      y: 16,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
    gsap.from(sectionRef.current.querySelector(`.${styles.marqueeWrapper}`), {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
    })
  }, { scope: sectionRef })

  return (
    <section id="skills" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow">// skills</p>
        <h2 className="section-heading">Tools &amp; Technologies</h2>
      </div>
      <div className={styles.marqueeWrapper}>
        <MarqueeRow items={row1} reverse={false} />
        <MarqueeRow items={row2} reverse={true} />
      </div>
    </section>
  )
}
