import { InfiniteSlider } from '@/components/ui/infinite-slider'
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
      <InfiniteSlider gap={42} reverse speed={40} speedOnHover={15}>
        {logos.map((logo) => (
          <Image
            alt={logo.alt}
            className='pointer-events-none h-9 w-auto opacity-45 brightness-0 select-none md:h-11 dark:opacity-80 dark:invert'
            height={logo.height ?? 48}
            key={`logo-${logo.alt}`}
            sizes='(max-width: 768px) 120px, 160px'
            src={logo.src}
            unoptimized
            width={logo.width ?? 48}
          />
        ))}
      </InfiniteSlider>
    </div>
  )
}
