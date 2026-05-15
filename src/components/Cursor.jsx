import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    let visible = false

    const onMove = (e) => {
      if (!visible) {
        gsap.set([dot, ring], { opacity: 1 })
        visible = true
      }
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' })
    }

    const onEnterLink = () => {
      gsap.to(ring, { scale: 1.8, borderColor: 'var(--accent)', duration: 0.25 })
      gsap.to(dot, { scale: 0, duration: 0.25 })
    }

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(203,166,247,0.6)', duration: 0.25 })
      gsap.to(dot, { scale: 1, duration: 0.25 })
    }

    window.addEventListener('mousemove', onMove)

    const links = document.querySelectorAll('a, button')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink)
        el.removeEventListener('mouseleave', onLeaveLink)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  )
}
