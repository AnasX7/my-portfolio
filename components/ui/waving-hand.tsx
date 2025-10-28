'use client'

import { motion } from 'motion/react'

export function WavingHand() {
  return (
    <motion.span
      animate={{
        rotate: [0, 14, -8, 14, -4, 10, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      style={{ originX: 0.7, originY: 0.7, display: 'inline-block' }}>
      👋🏻
    </motion.span>
  )
}
