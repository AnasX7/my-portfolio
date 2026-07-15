'use client'

import { cn } from '@/lib/utils'
import { m, MotionProps, useInView } from 'motion/react'
import { useRef } from 'react'
import type { CSSProperties } from 'react'

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  start?: boolean
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  start = true,
  ...props
}: AnimatedSpanProps) => (
  <m.div
    initial={{ opacity: 0, y: -5 }}
    animate={start ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.3, delay: delay / 1000 }}
    className={cn('grid text-sm font-normal tracking-tight', className)}
    {...props}
  >
    {children}
  </m.div>
)

interface TypingAnimationProps extends MotionProps {
  children: string
  className?: string
  duration?: number
  delay?: number
  start?: boolean
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  start = true,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== 'string') {
    throw new Error('TypingAnimation: children must be a string.')
  }

  return (
    <m.span
      className={cn('typing-text text-sm font-normal tracking-tight', className)}
      data-start={start}
      style={
        {
          '--typing-duration': `${Math.max(children.length, 1) * duration}ms`,
          '--typing-steps': Math.max(children.length, 1),
          '--typing-delay': `${delay}ms`,
          '--typing-width': `${children.length}ch`,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </m.span>
  )
}

interface TerminalProps {
  children: (start: boolean) => React.ReactNode
  className?: string
}

export const Terminal = ({ children, className }: TerminalProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className={cn(
        'z-0 h-full max-h-100 w-full max-w-lg rounded-xl border border-border bg-card',
        className,
      )}
    >
      <div className='border-border flex flex-col gap-y-2 border-b p-4'>
        <div className='flex flex-row gap-x-2'>
          <div className='size-2 rounded-full bg-red-500'></div>
          <div className='size-2 rounded-full bg-yellow-500'></div>
          <div className='size-2 rounded-full bg-green-500'></div>
        </div>
      </div>
      <pre className='p-4'>
        <code className='grid gap-y-1 overflow-auto'>{children(isInView)}</code>
      </pre>
    </m.div>
  )
}
