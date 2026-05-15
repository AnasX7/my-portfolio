'use client'

import { m, useMotionValue, animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  className?: string
  delay?: number
}

export default function AnimatedNumber({ value, className, delay = 0 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const shouldReduceMotion = useReducedMotion()

  const [displayValue, setDisplayValue] = useState(0)
  const motionValue = useMotionValue(0)

  useEffect(() => {
    if (!isInView) return

    if (shouldReduceMotion) {
      return
    }

    const controls = animate(motionValue, value, {
      duration: 1.5,
      delay: delay / 1000,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return controls.stop
  }, [isInView, shouldReduceMotion, value, motionValue, delay])

  return (
    <m.span
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.4, delay: delay / 1000 }}
    >
      {shouldReduceMotion ? value : displayValue}
    </m.span>
  )
}
