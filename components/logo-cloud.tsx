import { CurvedInfiniteSlider } from '@/components/ui/curved-infinite-slider'
import Image from 'next/image'

import { cn } from '@/lib/utils'

type Logo = {
  src: string
  alt: string
  width?: number
  height?: number
}

type LogoCloudProps = React.ComponentProps<'div'> & {
  logos: Logo[]
}

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden pt-4 pb-1 mask-[linear-gradient(to_right,transparent,black,transparent)]',
        className,
      )}
    >
      <CurvedInfiniteSlider arcDepth={28} gap={42} reverse speed={80} speedOnHover={25}>
        {logos.map((logo) => (
          <Image
            alt={logo.alt}
            className='pointer-events-none h-10 w-auto select-none md:h-12 dark:brightness-0 dark:invert'
            height={logo.height ?? 48}
            key={`logo-${logo.alt}`}
            sizes='(max-width: 768px) 120px, 160px'
            src={logo.src}
            unoptimized
            width={logo.width ?? 48}
          />
        ))}
      </CurvedInfiniteSlider>
    </div>
  )
}
