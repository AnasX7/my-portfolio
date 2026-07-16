'use client'

import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'
import './scroll-reveal.css'

interface ScrollRevealProps {
  children: ReactNode
  baseOpacity?: number
  containerClassName?: string
  textClassName?: string
}

export default function ScrollReveal({
  children,
  baseOpacity = 0.1,
  containerClassName = '',
  textClassName = '',
}: ScrollRevealProps) {
  const shouldReduceMotion = useHydratedReducedMotion()

  return (
    <m.p
      initial={shouldReduceMotion ? false : { opacity: baseOpacity, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.35, margin: '0px 0px -48px' }}
      className={`scroll-reveal scroll-reveal-text ${containerClassName} ${textClassName}`}
    >
      {children}
    </m.p>
  )
}
