'use client'

import { Magnetic } from './magnetic'
import { LinkPreview } from './link-preview'
import { cn } from '@/lib/utils'
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
      <LinkPreview
        url={url}
        className={cn(
          'neumorphic-button hover:shadow-[0_0_20px_rgba(155, 135, 245, 0.5)] cursor-pointer relative w-full overflow-hidden rounded-2xl border-[2px] dark:border-white/10 bg-gradient-to-b from-white/10 to-white/5 text-black dark:text-white shadow-lg transition-all duration-300 dark:hover:border-[#ffffff]/30 sm:w-auto inline-flex justify-center items-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-fit px-6 sm:px-8 md:px-10 py-3 sm:py-4 gap-2',
          className
        )}>
        {children}
        {Icon && <Icon className='size-4' />}
      </LinkPreview>
    </Magnetic>
  )
}
