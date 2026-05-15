import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './About.module.css'

const paragraphs = [
  "Hello! I’m Jesus, a cybersecurity analyst passionate about protecting systems, investigating threats, and making digital environments safer. I hold a BS in Management Information Systems from Kansas State University and an MS in Cybersecurity & Information Assurance from Western Governors University.",
  "I’m ISC² CC certified and actively working toward CompTIA CySA+ and PenTest+. My background blends business and technology through MIS, grounded in the deep security focus of my graduate program.",
  "I’m always looking for new challenges — whether that’s analyzing an incident, sharpening offensive skills in a lab, or exploring emerging threats in the security landscape.",
]

function WordSplit({ text }) {
  return (
    <>
      {text.split(' ').map((word, i, arr) => (
        <span key={i} className={styles.word}>
          {word}{i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

export default function About() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from(sectionRef.current.querySelector('.section-eyebrow'), {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })
    gsap.from(sectionRef.current.querySelector('.section-heading'), {
      clipPath: 'inset(0 0 100% 0)',
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
    gsap.from(sectionRef.current.querySelectorAll(`.${styles.word}`), {
      opacity: 0,
      y: 14,
      stagger: 0.018,
      duration: 0.45,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
    })
    gsap.from(sectionRef.current.querySelector(`.${styles.avatarWrap}`), {
      opacity: 0,
      x: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
    })
  }, { scope: sectionRef })

  return (
    <section id="about" ref={sectionRef}>
      <div className="container">
        <p className="section-eyebrow">// about me</p>
        <h2 className="section-heading">
          Who I am<span className={styles.cursor} aria-hidden="true" />
        </h2>
        <div className={styles.grid}>
          <div className={styles.text}>
            {paragraphs.map((p, i) => (
              <p key={i}>
                <WordSplit text={p} />
              </p>
            ))}
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
