import styles from './About.module.css'

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <p className="section-eyebrow">About me</p>
        <h2 className="section-heading">Who I am</h2>
        <div className={styles.grid}>
          <div className={styles.text}>
            <p>
              Hello! I&rsquo;m Jesus, a cybersecurity analyst passionate about
              protecting systems, investigating threats, and making digital environments
              safer. I hold a BS in Management Information Systems from Kansas State
              University and an MS in Cybersecurity &amp; Information Assurance from
              Western Governors University.
            </p>
            <p>
              I&rsquo;m ISC&sup2; CC certified and actively working toward CompTIA
              CySA+ and PenTest+. My background blends business and technology through
              MIS, grounded in the deep security focus of my graduate program.
            </p>
            <p>
              I&rsquo;m always looking for new challenges — whether that&rsquo;s
              analyzing an incident, sharpening offensive skills in a lab, or
              exploring emerging threats in the security landscape.
            </p>
          </div>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>JBM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
