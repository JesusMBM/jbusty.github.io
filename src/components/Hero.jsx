import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.css'

const SCRAMBLE_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ!@#$%^&*'

function scramble(el, finalText, delay = 0) {
  const totalFrames = 40
  let frame = 0
  let raf

  const step = () => {
    const progress = frame / totalFrames
    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (i < Math.floor(progress * finalText.length)) return char
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      })
      .join('')
    if (frame < totalFrames) { frame++; raf = requestAnimationFrame(step) }
    else el.textContent = finalText
  }

  const timeout = setTimeout(() => requestAnimationFrame(step), delay * 1000)
  return () => { clearTimeout(timeout); cancelAnimationFrame(raf) }
}

function SplitChars({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className={styles.char} aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

function useMagnetic(ref) {
  return {
    onMouseMove(e) {
      const el = ref.current
      const { left, top, width, height } = el.getBoundingClientRect()
      gsap.to(el, {
        x: (e.clientX - left - width / 2) * 0.38,
        y: (e.clientY - top - height / 2) * 0.38,
        duration: 0.4,
        ease: 'power2.out',
      })
    },
    onMouseLeave() {
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    },
  }
}

export default function Hero() {
  const containerRef = useRef(null)
  const orbRef = useRef(null)
  const orb2Ref = useRef(null)
  const greetingRef = useRef(null)
  const cta1Ref = useRef(null)
  const cta2Ref = useRef(null)

  useEffect(() => {
    if (!greetingRef.current) return
    return scramble(greetingRef.current, '>_ Hi, my name is', 1.2)
  }, [])

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.6 })

    // Idle float animations
    gsap.to(orbRef.current, {
      x: 80, y: 50, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut',
    })
    gsap.to(orb2Ref.current, {
      x: -60, y: 80, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
    })

    // Scroll parallax — orbs drift up faster than content
    gsap.to(orbRef.current, {
      y: -180,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    })
    gsap.to(orb2Ref.current, {
      y: -100,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    })
    gsap.to(containerRef.current, {
      y: -70,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    })

    // Entrance animations
    tl.from(containerRef.current.querySelector(`.${styles.greeting}`), {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out',
    })
    .from(containerRef.current.querySelectorAll(`.${styles.char}`), {
      opacity: 0, y: 60, rotation: -8, stagger: 0.025, duration: 0.6, ease: 'back.out(1.4)',
    }, '-=0.2')
    .from(containerRef.current.querySelector(`.${styles.title}`), {
      opacity: 0, y: 24, skewX: -4, duration: 0.6, ease: 'power3.out',
    }, '-=0.2')
    .from(containerRef.current.querySelector(`.${styles.bio}`), {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out',
    }, '-=0.3')
    .from(containerRef.current.querySelectorAll(`.${styles.ctas} a`), {
      opacity: 0, y: 16, scale: 0.9, stagger: 0.12, duration: 0.5, ease: 'back.out(1.7)',
    }, '-=0.2')
  }, { scope: containerRef })

  const handleNameEnter = () => {
    gsap.to(containerRef.current.querySelectorAll(`.${styles.char}`), {
      color: 'var(--accent)', stagger: { each: 0.02, from: 'random' }, duration: 0.3, ease: 'power2.out',
    })
  }
  const handleNameLeave = () => {
    gsap.to(containerRef.current.querySelectorAll(`.${styles.char}`), {
      color: 'var(--text-bright)', stagger: { each: 0.02, from: 'random' }, duration: 0.4, ease: 'power2.out',
    })
  }

  const mag1 = useMagnetic(cta1Ref)
  const mag2 = useMagnetic(cta2Ref)

  return (
    <section id="hero" className={styles.hero}>
      <div ref={orbRef} className={styles.orb} aria-hidden="true" />
      <div ref={orb2Ref} className={styles.orb2} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.gridLine} style={{ '--i': i }} />
        ))}
      </div>
      <div ref={containerRef} className={styles.content}>
        <p ref={greetingRef} className={styles.greeting}>&gt;_ Hi, my name is</p>
        <h1 onMouseEnter={handleNameEnter} onMouseLeave={handleNameLeave}>
          <SplitChars text="Jesus Bustillos-Molina." className={styles.name} />
        </h1>
        <h2 className={styles.title}>I secure systems and hunt threats.</h2>
        <p className={styles.bio}>
          Cybersecurity analyst with a BS in MIS from Kansas State University and
          an MS in Cybersecurity &amp; Information Assurance from WGU. ISC&sup2; CC
          certified, pursuing CompTIA CySA+ and PenTest+.
        </p>
        <div className={styles.ctas}>
          <a ref={cta1Ref} href="#projects" className={styles.ctaPrimary} {...mag1}>View my work</a>
          <a ref={cta2Ref} href="#contact" className={styles.ctaSecondary} {...mag2}>Get in touch</a>
        </div>
      </div>
    </section>
  )
}
