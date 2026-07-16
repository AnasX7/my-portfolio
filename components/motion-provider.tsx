'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

type MotionProviderProps = {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  const shouldReduceMotion = useHydratedReducedMotion()

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
