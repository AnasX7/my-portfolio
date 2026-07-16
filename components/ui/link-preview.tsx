'use client'

import { Popover } from '@base-ui/react/popover'

import { encode } from 'qss'
import React from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'

import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

type LinkPreviewProps = {
  children: React.ReactNode
  url: string
  'aria-label'?: string
  className?: string
  width?: number
  height?: number
  quality?: number
  layout?: string
} & ({ isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never })

export const LinkPreview = ({
  children,
  url,
  'aria-label': ariaLabel,
  className,
  width = 200,
  height = 125,
  // quality = 50,
  // layout = "fixed",
  isStatic = false,
  imageSrc = '',
}: LinkPreviewProps) => {
  let src
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: 'screenshot.url',
      colorScheme: 'dark',
      'viewport.isMobile': true,
      'viewport.deviceScaleFactor': 1,
      'viewport.width': width * 3,
      'viewport.height': height * 3,
    })
    src = `https://api.microlink.io/?${params}`
  } else {
    src = imageSrc
  }

  const [isOpen, setOpen] = React.useState(false)

  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const springConfig = { stiffness: 100, damping: 15 }
  const x = useMotionValue(0)

  const translateX = useSpring(x, springConfig)

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const targetRect = event.currentTarget.getBoundingClientRect()
    const eventOffsetX = event.clientX - targetRect.left
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2 // Reduce the effect to make it subtle
    x.set(offsetFromCenter)
  }

  return (
    <>
      {isMounted ? (
        <div className='hidden'>
          <Image src={src} width={width} height={height} alt='hidden image' />
        </div>
      ) : null}

      <Popover.Root open={isOpen} onOpenChange={setOpen} modal={false}>
        <Popover.Trigger
          render={<Link href={url} target='_blank' aria-label={ariaLabel} />}
          nativeButton={false}
          openOnHover
          delay={50}
          closeDelay={100}
          onMouseMove={handleMouseMove}
          className={cn('text-black dark:text-white', className)}
        >
          {children}
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner
            className='z-50 origin-(--transform-origin)'
            side='top'
            align='center'
            sideOffset={10}
          >
            <Popover.Popup>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    className='rounded-xl shadow-xl'
                    style={{
                      x: translateX,
                    }}
                  >
                    <Link
                      href={url}
                      target='_blank'
                      className='block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:hover:border-neutral-800'
                      style={{ fontSize: 0 }}
                    >
                      <Image
                        src={isStatic ? imageSrc : src}
                        width={width}
                        height={height}
                        className='rounded-lg'
                        alt='preview image'
                      />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
