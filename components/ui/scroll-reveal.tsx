'use client'

import { m, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Children, useRef, type ReactNode } from 'react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'
import './scroll-reveal.css'

interface ScrollRevealProps {
  children: ReactNode
  baseOpacity?: number
  containerClassName?: string
  textClassName?: string
}

interface RevealToken {
  content: ReactNode
  key: string
  revealIndex?: number
}

interface AnimatedTokenProps {
  baseOpacity: number
  children: ReactNode
  index: number
  progress: MotionValue<number>
  shouldReduceMotion: boolean
  tokenCount: number
}

function tokenize(children: ReactNode): RevealToken[] {
  let revealIndex = 0

  return Children.toArray(children).flatMap((child, childIndex) => {
    const parts = typeof child === 'string' ? child.split(/(\s+)/).filter(Boolean) : [child]

    return parts.map((part, partIndex) => {
      const token = {
        content: part,
        key: `${childIndex}-${partIndex}`,
      }

      if (typeof part === 'string' && /^\s+$/.test(part)) {
        return token
      }

      return { ...token, revealIndex: revealIndex++ }
    })
  })
}

function AnimatedToken({
  baseOpacity,
  children,
  index,
  progress,
  shouldReduceMotion,
  tokenCount,
}: AnimatedTokenProps) {
  const start = tokenCount <= 1 ? 0 : (index / (tokenCount - 1)) * 0.75
  const opacity = useTransform(progress, [start, Math.min(start + 0.25, 1)], [baseOpacity, 1])

  return (
    <m.span
      className='scroll-reveal-token inline-block'
      style={{ opacity: shouldReduceMotion ? 1 : opacity }}
    >
      {children}
    </m.span>
  )
}

export default function ScrollReveal({
  children,
  baseOpacity = 0.1,
  containerClassName = '',
  textClassName = '',
}: ScrollRevealProps) {
  const shouldReduceMotion = useHydratedReducedMotion()
  const containerRef = useRef<HTMLParagraphElement>(null)
  const tokens = tokenize(children)
  const tokenCount = tokens.reduce(
    (count, token) => count + (token.revealIndex === undefined ? 0 : 1),
    0,
  )
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 60%'],
  })

  return (
    <m.p
      ref={containerRef}
      className={`scroll-reveal scroll-reveal-text ${containerClassName} ${textClassName}`}
    >
      {tokens.map((token) =>
        token.revealIndex === undefined ? (
          token.content
        ) : (
          <AnimatedToken
            key={token.key}
            baseOpacity={baseOpacity}
            index={token.revealIndex}
            progress={scrollYProgress}
            shouldReduceMotion={shouldReduceMotion}
            tokenCount={tokenCount}
          >
            {token.content}
          </AnimatedToken>
        ),
      )}
    </m.p>
  )
}
