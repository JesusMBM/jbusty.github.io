import styles from './About.module.css'
import useReveal from '../hooks/useReveal'

const education = [
  {
    degree: 'MS, Cybersecurity & Information Assurance',
    school: 'Western Governors University',
    color: 'var(--ctp-mauve)',
  },
  {
    degree: 'BS, Management Information Systems',
    school: 'Kansas State University',
    color: 'var(--ctp-blue)',
  },
]

const certs = [
  { name: 'ISC² Certified in Cybersecurity (CC)', status: 'earned' },
  { name: 'CompTIA CySA+', status: 'progress' },
  { name: 'CompTIA PenTest+', status: 'progress' },
]

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <p className="section-eyebrow reveal">whoami</p>
        <h2 className="section-heading reveal">About me</h2>

        <div className={styles.grid}>
          <div className={`${styles.text} reveal`}>
            <p>
              Hello! I&rsquo;m Jesus, a cybersecurity analyst passionate about
              protecting systems, investigating threats, and making digital
              environments safer.
            </p>
            <p>
              My background blends business and technology through MIS, grounded in
              the deep security focus of my graduate program. I&rsquo;m ISC&sup2; CC
              certified and actively building toward CySA+ and PenTest+.
            </p>
            <p>
              I&rsquo;m always chasing the next challenge — analyzing an incident,
              sharpening offensive skills in a lab, or exploring emerging threats
              across the security landscape.
            </p>

            <div className={styles.certs}>
              <h3 className={styles.subhead}>// certifications</h3>
              <ul>
                {certs.map((c) => (
                  <li key={c.name} className={styles.cert}>
                    <span
                      className={`${styles.badge} ${
                        c.status === 'earned' ? styles.earned : styles.progress
                      }`}
                    >
                      {c.status === 'earned' ? '✓' : '~'}
                    </span>
                    <span className={styles.certName}>{c.name}</span>
                    {c.status === 'progress' && (
                      <span className={styles.wip}>in progress</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className={`${styles.side} reveal`}>
            <h3 className={styles.subhead}>// education</h3>
            <div className={styles.timeline}>
              {education.map((e) => (
                <div key={e.degree} className={styles.eduItem}>
                  <span
                    className={styles.eduDot}
                    style={{ background: e.color, boxShadow: `0 0 12px ${e.color}` }}
                  />
                  <p className={styles.degree}>{e.degree}</p>
                  <p className={styles.school}>{e.school}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
