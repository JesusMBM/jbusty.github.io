import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './Hero.module.css'

function SplitChars({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className={styles.char} aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const containerRef = useRef(null)
  const orbRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.6 })

    gsap.to(orbRef.current, {
      x: 80,
      y: 50,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    tl.from(containerRef.current.querySelector(`.${styles.greeting}`), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    })
    .from(containerRef.current.querySelectorAll(`.${styles.char}`), {
      opacity: 0,
      y: 40,
      stagger: 0.025,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2')
    .from(containerRef.current.querySelector(`.${styles.title}`), {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from(containerRef.current.querySelector(`.${styles.bio}`), {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.3')
    .from(containerRef.current.querySelectorAll(`.${styles.ctas} a`), {
      opacity: 0,
      y: 16,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power3.out',
    }, '-=0.2')
  }, { scope: containerRef })

  return (
    <section id="hero" className={styles.hero}>
      <div ref={orbRef} className={styles.orb} aria-hidden="true" />
      <div ref={containerRef} className={styles.content}>
        <p className={styles.greeting}>&gt;_ Hi, my name is</p>
        <h1>
          <SplitChars text="Jesus Bustillos-Molina." className={styles.name} />
        </h1>
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
