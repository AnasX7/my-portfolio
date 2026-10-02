'use client'

import { useEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { m, useScroll, useTransform, type MotionStyle, type MotionValue } from 'motion/react'
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
  const outside = side === 'left' ? '-110%' : '110%'
  const x = useTransform(localProgress, [0, 0.25, 0.56, 0.9], [outside, '0%', '0%', outside])
  const y = useTransform(localProgress, [0, 1], ['14%', '-14%'])
  const rotate = useTransform(localProgress, [0, 1], side === 'left' ? [-12, 8] : [12, -8])
  const opacity = useTransform(localProgress, [0, 0.2, 0.58, 0.88], [0, 0.9, 0.9, 0])

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
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    )
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return enabled ? <Journey target={target} /> : null
}
