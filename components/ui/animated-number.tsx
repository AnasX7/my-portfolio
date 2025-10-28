'use client'

import { motion, useMotionValue, animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  className?: string
  delay?: number
}

export default function AnimatedNumber({
  value,
  className,
  delay = 0,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const [displayValue, setDisplayValue] = useState(0)
  const motionValue = useMotionValue(0)

  useEffect(() => {
    if (!isInView) return

    const controls = animate(motionValue, value, {
      duration: 1.5,
      delay: delay / 1000,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return controls.stop
  }, [isInView, value, motionValue, delay])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}>
      {displayValue}
    </motion.span>
  )
}
