'use client'

import { AnimateView } from 'motion/react-animate-view'
import { m, useAnimate } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'
import SignatureJourney from '@/components/signature-journey'

const transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reducedMotion = useHydratedReducedMotion()
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (reducedMotion) return
    const animation = animate(scope.current, { opacity: [0.55, 1], y: [12, 0] }, transition)
    return () => animation.stop()
  }, [pathname, reducedMotion, animate, scope])

  return (
    <div ref={scope}>
      {children}
      {!pathname.endsWith('/privacy') && <SignatureJourney key={pathname} target={scope} />}
    </div>
  )
}

export function ProjectImageTransition({ name, children }: { name: string; children: ReactNode }) {
  const reducedMotion = useHydratedReducedMotion()

  if (reducedMotion) return children

  return (
    <AnimateView name={name} transition={transition}>
      {children}
    </AnimateView>
  )
}

export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useHydratedReducedMotion()

  return (
    <m.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={reducedMotion ? { duration: 0 } : transition}
    >
      {children}
    </m.div>
  )
}
