'use client'

import { Magnetic } from './magnetic'
import { LinkPreview } from './link-preview'
import { AnimatedButtonContent, buttonVariants } from './button'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'

interface MagneticLinkPreviewProps {
  url: string
  children: React.ReactNode
  icon?: IconSvgElement
  className?: string
  intensity?: number
  bounce?: number
  range?: number
}

export function MagneticLinkPreview({
  url,
  children,
  icon: Icon,
  className,
  intensity = 0.2,
  bounce = 0.1,
  range = 250,
}: MagneticLinkPreviewProps) {
  return (
    <Magnetic intensity={intensity} springOptions={{ bounce }} actionArea='global' range={range}>
      <LinkPreview url={url} className={buttonVariants({ variant: 'animated', className })}>
        <AnimatedButtonContent>
          {children}
          {Icon && (
            <HugeiconsIcon
              icon={Icon}
              className='icon text-muted-foreground size-4 transition-transform duration-300 dark:text-[#b5b5b5a4]'
            />
          )}
        </AnimatedButtonContent>
      </LinkPreview>
    </Magnetic>
  )
}
