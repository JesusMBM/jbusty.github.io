import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Nav.module.css'

const links = [
  { href: '#about', label: 'About', num: '01' },
  { href: '#projects', label: 'Projects', num: '02' },
  { href: '#skills', label: 'Skills', num: '03' },
  { href: '#contact', label: 'Contact', num: '04' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(() => {
    gsap.from(navRef.current.querySelectorAll('[data-nav-item]'), {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.5,
    })

    const triggers = links
      .map(({ href }) => {
        const el = document.getElementById(href.slice(1))
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(href),
          onEnterBack: () => setActive(href),
        })
      })
      .filter(Boolean)

    ScrollTrigger.refresh()

    return () => triggers.forEach(t => t.kill())
  }, { scope: navRef })

  return (
    <nav ref={navRef} aria-label="Primary navigation" className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo} data-nav-item>
          <span className={styles.logoAccent}>[</span>JBM<span className={styles.logoAccent}>]</span>
        </a>
        <ul className={styles.links}>
          {links.map(({ href, label, num }) => (
            <li key={href} data-nav-item>
              <a
                href={href}
                aria-current={active === href ? 'page' : undefined}
                className={`${styles.link} ${active === href ? styles.active : ''}`}
              >
                <span className={styles.linkNum}>{num}.</span> {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
