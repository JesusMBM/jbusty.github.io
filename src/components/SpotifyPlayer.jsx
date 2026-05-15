import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './SpotifyPlayer.module.css'

const EMBED_URL =
  'https://open.spotify.com/embed/playlist/4FuLyaBxcwkCWC6o53J6FR?utm_source=generator&theme=0'

function EqBars() {
  return (
    <div className={styles.eqBars} aria-hidden="true">
      <span className={styles.bar} style={{ '--i': 0 }} />
      <span className={styles.bar} style={{ '--i': 1 }} />
      <span className={styles.bar} style={{ '--i': 2 }} />
    </div>
  )
}

export default function SpotifyPlayer() {
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const buttonRef = useRef(null)

  useGSAP(() => {
    gsap.set(cardRef.current, {
      scaleY: 0,
      opacity: 0,
      pointerEvents: 'none',
      transformOrigin: 'bottom right',
    })
    gsap.from(buttonRef.current, {
      x: 80,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 2,
    })
  }, { scope: wrapperRef })

  const handleOpen = () => {
    gsap.to(buttonRef.current, { opacity: 0, scale: 0.8, duration: 0.2 })
    gsap.to(cardRef.current, {
      scaleY: 1,
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.35,
      ease: 'back.out(1.4)',
      transformOrigin: 'bottom right',
    })
  }

  const handleClose = () => {
    gsap.to(cardRef.current, {
      scaleY: 0,
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.25,
      ease: 'power2.in',
      transformOrigin: 'bottom right',
    })
    gsap.to(buttonRef.current, { opacity: 1, scale: 1, duration: 0.3, delay: 0.15 })
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={cardRef} className={styles.card}>
        <button onClick={handleClose} className={styles.close} aria-label="Close player">
          ×
        </button>
        <iframe
          src={EMBED_URL}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify playlist"
        />
      </div>
      <button
        ref={buttonRef}
        className={styles.toggle}
        onClick={handleOpen}
        aria-label="Open Spotify player"
      >
        <EqBars />
      </button>
    </div>
  )
}
