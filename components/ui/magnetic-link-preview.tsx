'use client'

import { Magnetic } from './magnetic'
import { LinkPreview } from './link-preview'
import { Button } from './button'
import { LucideIcon } from 'lucide-react'

interface MagneticLinkPreviewProps {
  url: string
  children: React.ReactNode
  icon?: LucideIcon
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
    <Magnetic
      intensity={intensity}
      springOptions={{ bounce }}
      actionArea='global'
      range={range}>
      <Button asChild variant='animated' className={className}>
        <LinkPreview url={url}>
          {children}
          {Icon && (
            <Icon className='icon text-[#b5b5b5a4] w-4 h-4 transition-transform duration-300' />
          )}
        </LinkPreview>
      </Button>
    </Magnetic>
  )
}
