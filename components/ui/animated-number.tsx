'use client'

import { motion, useMotionValue, animate } from 'motion/react'
import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  className?: string
}

export default function AnimatedNumber({
  value,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const motionValue = useMotionValue(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return controls.stop
  }, [value, motionValue])

  return <motion.span className={className}>{displayValue}</motion.span>
}
