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
              Hello! I&rsquo;m Jesus, a software engineer based in [Your Location].
              I enjoy creating things that live on the internet — whether that&rsquo;s
              websites, applications, or anything in between.
            </p>
            <p>
              My interest in software development started back when I [your origin story here].
              Since then I&rsquo;ve had the privilege of working on [projects/companies/teams]
              that have shaped the way I think about building software.
            </p>
            <p>
              When I&rsquo;m not coding, I&rsquo;m usually [your hobbies/interests].
              I&rsquo;m always looking for new challenges and opportunities to grow as
              an engineer.
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
