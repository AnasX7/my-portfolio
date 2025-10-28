import * as React from 'react'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

function Card({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      data-slot='card'
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm group',
        className
      )}
      variants={{
        hidden: { opacity: 0, filter: 'blur(10px)', scale: 0.8, rotateX: 15 },
        show: { opacity: 1, filter: 'blur(0px)', scale: 1, rotateX: 0 },
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
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

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

function CardDecorator() {
  return (
    <>
      <span className='border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2 group-hover:-left-2 group-hover:-top-2 transition-all duration-300 ease-in-out'></span>
      <span className='border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2 group-hover:-right-2 group-hover:-top-2 transition-all duration-300 ease-in-out'></span>
      <span className='border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 group-hover:-left-2 group-hover:-bottom-2 transition-all duration-300 ease-in-out'></span>
      <span className='border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 group-hover:-right-2 group-hover:-bottom-2 transition-all duration-300 ease-in-out'></span>
    </>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardDecorator,
}
