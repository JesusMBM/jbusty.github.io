import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.greeting}>Hi, my name is</p>
        <h1 className={styles.name}>Jesus Bustillos-Molina.</h1>
        <h2 className={styles.title}>I secure systems and hunt threats.</h2>
        <p className={styles.bio}>
          Cybersecurity analyst with a BS in MIS from Kansas State University and
          an MS in Cybersecurity &amp; Information Assurance from WGU. ISC&sup2; CC
          certified, pursuing CompTIA CySA+ and PenTest+.
        </p>
        <div className={styles.ctas}>
          <a href="#projects" className={styles.ctaPrimary}>View my work</a>
          <a href="#contact" className={styles.ctaSecondary}>Get in touch</a>
        </div>
      </div>
    </section>
  )
}
