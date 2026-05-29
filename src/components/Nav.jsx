import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

const links = [
  { href: '#about', label: 'about', n: '01' },
  { href: '#projects', label: 'projects', n: '02' },
  { href: '#skills', label: 'skills', n: '03' },
  { href: '#contact', label: 'contact', n: '04' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#hero" className={styles.logo}>
          <span className={styles.bracket}>~/</span>jbm<span className={styles.cursor}>_</span>
        </a>

        <button
          className={styles.toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen3 : ''}`} />
        </button>

        <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          {links.map(({ href, label, n }) => (
            <li key={href}>
              <a href={href} className={styles.link} onClick={() => setOpen(false)}>
                <span className={styles.num}>{n}.</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
