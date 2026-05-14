import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.greeting}>Hi, my name is</p>
        <h1 className={styles.name}>Jesus Bustillos-Molina.</h1>
        <h2 className={styles.title}>I build things for the web.</h2>
        <p className={styles.bio}>
          I&rsquo;m a software engineer passionate about creating clean, efficient,
          and user-friendly digital experiences. Currently focused on building
          impactful products and exploring new technologies.
        </p>
        <div className={styles.ctas}>
          <a href="#projects" className={styles.ctaPrimary}>View my work</a>
          <a href="#contact" className={styles.ctaSecondary}>Get in touch</a>
        </div>
      </div>
    </section>
  )
}
