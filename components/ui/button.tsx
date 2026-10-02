import * as React from 'react'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const animatedStyles =
  'anim-btn cursor-pointer relative inline-flex items-center justify-center overflow-hidden transition-all duration-250 rounded-full border-none outline-none active:scale-95'

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary: `${animatedStyles} anim-btn-primary text-white`,
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: `${animatedStyles} text-foreground`,
        inverse: `${animatedStyles} anim-btn-inverse text-[#191919] dark:text-white`,
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-12 px-7 py-3 text-sm',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'min-h-14 px-8 py-3 text-base font-semibold',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

const buttonVariants = (...args: Parameters<typeof buttonStyles>) => cn(buttonStyles(...args))

function AnimatedButtonContent({ children }: { children: React.ReactNode }) {
  return (
    <span className='inner relative z-20 inline-flex w-full items-center justify-center gap-2 leading-relaxed transition-colors duration-200'>
      {children}
    </span>
  )
}

function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {!variant || variant === 'primary' || variant === 'secondary' || variant === 'inverse' ? (
        <AnimatedButtonContent>{children}</AnimatedButtonContent>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { AnimatedButtonContent, Button, buttonVariants }
