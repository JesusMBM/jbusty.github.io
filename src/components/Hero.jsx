import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.greeting}>
          <span className={styles.prompt}>$</span> echo &quot;hello, world&quot;
        </p>

        <h1 className={styles.name}>
          Jesus <span className="grad-text">Bustillos-Molina</span>
        </h1>

        <h2 className={styles.title}>
          I secure systems &amp; hunt threats.
        </h2>

        <p className={styles.bio}>
          Cybersecurity analyst with a BS in MIS from Kansas State University and an
          MS in Cybersecurity &amp; Information Assurance from WGU. ISC&sup2; CC certified,
          pursuing CompTIA CySA+ and PenTest+.
        </p>

        <div className={styles.ctas}>
          <a href="#projects" className={styles.ctaPrimary}>
            view my work <span aria-hidden="true">→</span>
          </a>
          <a href="#contact" className={styles.ctaSecondary}>get in touch</a>
        </div>
      </div>

      <div className={styles.terminal} aria-hidden="true">
        <div className={styles.termBar}>
          <span className={`${styles.dot} ${styles.dotR}`} />
          <span className={`${styles.dot} ${styles.dotY}`} />
          <span className={`${styles.dot} ${styles.dotG}`} />
          <span className={styles.termTitle}>jbm@portfolio: ~</span>
        </div>
        <div className={styles.termBody}>
          <p><span className={styles.tPrompt}>jbm@sec</span>:<span className={styles.tPath}>~</span>$ whoami</p>
          <p className={styles.tOut}>cybersecurity-analyst</p>
          <p><span className={styles.tPrompt}>jbm@sec</span>:<span className={styles.tPath}>~</span>$ cat ./focus.txt</p>
          <p className={styles.tOut}>threat detection · incident response</p>
          <p className={styles.tOut}>vulnerability assessment · blue + purple team</p>
          <p><span className={styles.tPrompt}>jbm@sec</span>:<span className={styles.tPath}>~</span>$ status --certs</p>
          <p className={styles.tOut}>
            <span className={styles.tOk}>[✓]</span> ISC&sup2; CC&nbsp;&nbsp;
            <span className={styles.tWip}>[~]</span> CySA+&nbsp;&nbsp;
            <span className={styles.tWip}>[~]</span> PenTest+
          </p>
          <p><span className={styles.tPrompt}>jbm@sec</span>:<span className={styles.tPath}>~</span>$ <span className={styles.blink}>▋</span></p>
        </div>
      </div>
    </section>
  )
}
