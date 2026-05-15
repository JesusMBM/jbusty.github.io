import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="about" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow" data-reveal>// about me</p>
        <h2 className="section-heading" data-reveal>
          Who I am<span className={styles.cursor} aria-hidden="true" />
        </h2>
        <div className={styles.grid}>
          <div className={styles.text} data-reveal>
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
          <div className={styles.avatarWrap} data-reveal>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>JBM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
