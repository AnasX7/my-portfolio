'use client'

// Adapted from nilbuild/page-mascot (MIT); see assets/art/mascot/LICENSE.
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'
import { usePageVisible } from '@/hooks/use-page-visible'
import styles from './page-mascot.module.css'

const clockwise = [5, 8, 7, 6, 3, 0, 1, 2]
const sectorAngle = Math.PI / 4

function cell(frame: number) {
  return { backgroundPosition: `${(frame % 3) * 50}% ${Math.floor(frame / 3) * 50}%` }
}

export default function PageMascot() {
  const t = useTranslations('mascot')
  const button = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])
  const clicks = useRef(0)
  const [direction, setDirection] = useState(4)
  const [reaction, setReaction] = useState<number | null>(null)
  const reduceMotion = useHydratedReducedMotion()
  const inView = useInView(button, { margin: '200px' })
  const pageVisible = usePageVisible()

  useEffect(() => {
    if (
      reduceMotion ||
      !inView ||
      !pageVisible ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return

    let sector = -1
    let pointer: { x: number; y: number } | null = null
    const aim = () => {
      if (!pointer || !button.current) return
      const box = button.current.getBoundingClientRect()
      const dx = pointer.x - (box.left + box.width / 2)
      const dy = pointer.y - (box.top + box.height / 2)
      if (Math.hypot(dx, dy) < box.width / 2) {
        sector = -1
        setDirection(4)
        return
      }
      const angle = Math.atan2(dy, dx)
      const difference = angle - sector * sectorAngle
      // Hold a direction near its boundary so the head does not flicker between cells.
      if (
        sector !== -1 &&
        Math.abs(Math.atan2(Math.sin(difference), Math.cos(difference))) < sectorAngle / 2 + 0.12
      )
        return
      sector = (Math.round(angle / sectorAngle) + 8) % 8
      setDirection(clockwise[sector])
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      aim()
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', aim, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', aim)
    }
  }, [inView, pageVisible, reduceMotion])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const react = () => {
    timers.current.forEach(window.clearTimeout)
    setReaction(0)
    const expression = [1, 2, 8][clicks.current++ % 3]
    timers.current = [
      window.setTimeout(() => setReaction(expression), 120),
      window.setTimeout(() => setReaction(null), 700),
    ]
    if (!reduceMotion) {
      button.current?.animate?.(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.04, 0.96)', offset: 0.3 },
          { transform: 'scale(1)' },
        ],
        { duration: 320, easing: 'ease-out' },
      )
    }
  }

  return (
    <button
      ref={button}
      type='button'
      onClick={react}
      aria-label={t('react')}
      className={`${styles.mascot} focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      <span
        aria-hidden='true'
        className={styles.directions}
        style={{
          ...cell(reduceMotion ? 4 : direction),
          opacity: reaction === null ? 1 : 0,
          backgroundImage: inView ? undefined : 'none',
        }}
      />
      <span
        aria-hidden='true'
        className={styles.reactions}
        style={{
          ...cell(reaction ?? 0),
          opacity: reaction === null ? 0 : 1,
          backgroundImage: inView ? undefined : 'none',
        }}
      />
    </button>
  )
}
