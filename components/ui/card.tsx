'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { m } from 'motion/react'

const Card = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof m.div>>(
  ({ className, ...props }, ref) => {
    return (
      <m.div
        ref={ref}
        data-slot='card'
        className={cn(
          'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm group',
          className,
        )}
        variants={{
          hidden: { opacity: 0, scale: 0.92, y: 12 },
          show: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 data-slot='card-title' className={cn('leading-none font-semibold', className)} {...props} />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='card-content' className={cn('px-6', className)} {...props} />
}

function CardDecorator() {
  return (
    <>
      <span className='border-primary absolute -top-px -left-px block size-2 border-t-2 border-l-2 transition-all duration-300 ease-in-out group-hover:-top-2 group-hover:-left-2'></span>
      <span className='border-primary absolute -top-px -right-px block size-2 border-t-2 border-r-2 transition-all duration-300 ease-in-out group-hover:-top-2 group-hover:-right-2'></span>
      <span className='border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 transition-all duration-300 ease-in-out group-hover:-bottom-2 group-hover:-left-2'></span>
      <span className='border-primary absolute -right-px -bottom-px block size-2 border-r-2 border-b-2 transition-all duration-300 ease-in-out group-hover:-right-2 group-hover:-bottom-2'></span>
    </>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardDecorator }
