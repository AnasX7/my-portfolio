'use client'

import { Magnetic } from './magnetic'
import { LinkPreview } from './link-preview'
import { AnimatedButtonContent, buttonVariants } from './button'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import type { VariantProps } from 'class-variance-authority'

interface MagneticLinkPreviewProps extends VariantProps<typeof buttonVariants> {
  url: string
  previewImage?: string
  children: React.ReactNode
  'aria-label'?: string
  icon?: IconSvgElement
  className?: string
  intensity?: number
  bounce?: number
  range?: number
}

export function MagneticLinkPreview({
  url,
  previewImage,
  children,
  'aria-label': ariaLabel,
  icon: Icon,
  className,
  intensity = 0.2,
  bounce = 0.1,
  range = 250,
  variant = 'secondary',
  size,
}: MagneticLinkPreviewProps) {
  return (
    <Magnetic intensity={intensity} springOptions={{ bounce }} actionArea='global' range={range}>
      <LinkPreview
        url={url}
        {...(previewImage
          ? { isStatic: true as const, imageSrc: previewImage }
          : { isStatic: false as const })}
        aria-label={ariaLabel}
        className={buttonVariants({ variant, size, className })}
      >
        {variant === 'primary' || variant === 'secondary' || variant === 'inverse' ? (
          <AnimatedButtonContent>
            {children}
            {Icon && (
              <HugeiconsIcon
                icon={Icon}
                className='icon size-4 transition-transform duration-300'
              />
            )}
          </AnimatedButtonContent>
        ) : (
          <span className='flex items-center gap-2'>
            {children}
            {Icon && (
              <HugeiconsIcon
                icon={Icon}
                className='icon size-4 transition-transform duration-300'
              />
            )}
          </span>
        )}
      </LinkPreview>
    </Magnetic>
  )
}
