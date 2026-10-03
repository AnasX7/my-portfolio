'use client'

import { useEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import {
  easeInOut,
  m,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react'
import styles from './signature-journey.module.css'

const letters = ['a1', 'n', 'a2', 's'] as const

function Letter({
  letter,
  index,
  progress,
}: {
  letter: (typeof letters)[number]
  index: number
  progress: MotionValue<number>
}) {
  const side = index % 2 ? 'right' : 'left'
  const localProgress = useTransform(progress, [index / 4, (index + 1) / 4], [0, 1])
  const direction = side === 'left' ? -1 : 1
  const entrance = useTransform(localProgress, [0, 0.25], [110, 0])
  const exitAngle = useTransform(localProgress, [0.48, 0.94], [0, Math.PI / 2], { ease: easeInOut })
  const x = useTransform(
    () => `${direction * (entrance.get() + 110 * (1 - Math.cos(exitAngle.get())))}%`,
  )
  const y = useTransform(exitAngle, (angle) => `${40 * Math.sin(angle)}vh`)
  const rotate = useTransform(
    localProgress,
    [0, 0.48, 0.94],
    side === 'left' ? [-12, 0, 22] : [12, 0, -22],
  )
  const opacity = useTransform(localProgress, [0, 0.2, 0.76, 0.96], [0, 0.9, 0.9, 0])

  return (
    <div className={`${styles.lane} ${styles[side]}`} data-letter={letter}>
      <m.div
        className={styles.letter}
        style={
          {
            x,
            y,
            rotate,
            opacity,
            '--letter-light': `url('/brand/letter-${letter}-side-light.webp')`,
            '--letter-dark': `url('/brand/letter-${letter}-side-dark.webp')`,
          } as MotionStyle
        }
      />
    </div>
  )
}

function Journey({ target }: { target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end 0.5'] })

  return createPortal(
    <div className={styles.journey} aria-hidden='true'>
      {letters.map((letter, index) => (
        <Letter key={letter} letter={letter} index={index} progress={scrollYProgress} />
      ))}
    </div>,
    document.body,
  )
}

export default function SignatureJourney({ target }: { target: RefObject<HTMLElement | null> }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 1280px) and (prefers-reduced-motion: no-preference)',
    )
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return enabled ? <Journey target={target} /> : null
}
