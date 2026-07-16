'use client'

import { Magnetic } from './magnetic'
import { LinkPreview } from './link-preview'
import { AnimatedButtonContent, buttonVariants } from './button'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import { cn } from '@/lib/utils'

interface MagneticLinkPreviewProps {
  url: string
  children: React.ReactNode
  'aria-label'?: string
  icon?: IconSvgElement
  className?: string
  intensity?: number
  bounce?: number
  range?: number
  variant?: 'animated' | 'outline' | 'default' | 'ghost' | 'link'
}

export function MagneticLinkPreview({
  url,
  children,
  'aria-label': ariaLabel,
  icon: Icon,
  className,
  intensity = 0.2,
  bounce = 0.1,
  range = 250,
  variant = 'animated',
}: MagneticLinkPreviewProps) {
  return (
    <Magnetic intensity={intensity} springOptions={{ bounce }} actionArea='global' range={range}>
      <LinkPreview
        url={url}
        aria-label={ariaLabel}
        className={cn(buttonVariants({ variant }), className)}
      >
        {variant === 'animated' ? (
          <AnimatedButtonContent>
            {children}
            {Icon && (
              <HugeiconsIcon
                icon={Icon}
                className='icon text-muted-foreground size-4 transition-transform duration-300 dark:text-[#b5b5b5a4]'
              />
            )}
          </AnimatedButtonContent>
        ) : (
          <span className='flex items-center gap-2'>
            {children}
            {Icon && (
              <HugeiconsIcon
                icon={Icon}
                className='icon text-muted-foreground size-4 transition-transform duration-300 dark:text-[#b5b5b5a4]'
              />
            )}
          </span>
        )}
      </LinkPreview>
    </Magnetic>
  )
}
