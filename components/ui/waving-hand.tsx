'use client'

import { m, useReducedMotion } from 'motion/react'

export function WavingHand() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <m.span
      animate={shouldReduceMotion ? undefined : { rotate: [0, 14, -8, 14, -4, 10, 0] }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 2.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }
      }
      style={{ originX: 0.7, originY: 0.7, display: 'inline-block' }}
    >
      👋🏻
    </m.span>
  )
}
