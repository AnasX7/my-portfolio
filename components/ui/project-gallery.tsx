'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, m } from 'motion/react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

interface ProjectGalleryProps {
  images: string[]
  imageAlts: string[]
  title: string
  isRtl: boolean
}

interface ActiveImage {
  src: string
  alt: string
  index: number
}

export default function ProjectGallery({ images, imageAlts, title, isRtl }: ProjectGalleryProps) {
  const shouldReduceMotion = useHydratedReducedMotion()
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const openLabel = isRtl ? 'فتح' : 'Open'
  const closeLabel = isRtl ? 'إغلاق معرض الصور' : 'Close project gallery'

  useEffect(() => {
    if (!activeImage) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveImage(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [activeImage])

  const openImage = (image: ActiveImage, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setActiveImage(image)
  }

  return (
    <section aria-labelledby='gallery-title' className='py-24 sm:py-32'>
      <div className='border-foreground/20 mb-14 grid gap-7 border-t pt-7 md:grid-cols-12 md:items-end'>
        <div className='md:col-span-7'>
          <p className='text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase'>
            {isRtl ? 'مختارات من المشروع' : 'Selected screens'}
          </p>
          <h2
            id='gallery-title'
            className='mt-4 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl'
          >
            {isRtl ? 'معرض صور المشروع' : 'Project gallery'}
          </h2>
        </div>
        <p className='text-muted-foreground text-sm leading-7 text-pretty md:col-span-4 md:col-start-9'>
          {isRtl
            ? 'جولة بصرية في الواجهات والتفاصيل التي شكّلت تجربة المشروع.'
            : 'A visual walkthrough of the interfaces and details that shaped the project experience.'}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-20'>
        {images.map((image, idx) => {
          const alt = imageAlts[idx] ?? `${title} screenshot ${idx + 2}`
          const isWide = idx % 3 === 0
          const placement = isWide
            ? 'md:col-span-12'
            : idx % 3 === 1
              ? 'md:col-span-7'
              : 'md:col-span-5 md:mt-24'

          return (
            <m.figure
              key={image}
              className={placement}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type='button'
                onClick={(event) => openImage({ src: image, alt, index: idx }, event.currentTarget)}
                aria-label={`${openLabel} ${alt}`}
                className='group focus-visible:ring-foreground focus-visible:ring-offset-background block w-full cursor-zoom-in text-start outline-none focus-visible:ring-2 focus-visible:ring-offset-4'
              >
                <span
                  className={`relative block overflow-hidden bg-zinc-950 ${
                    isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    unoptimized
                    sizes={
                      isWide
                        ? '(max-width: 1280px) 100vw, 1280px'
                        : '(max-width: 768px) 100vw, 58vw'
                    }
                    className='object-contain transition-transform duration-200 ease-out group-hover:scale-[1.015]'
                  />
                  <span className='absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100'>
                    <ExpandIcon />
                  </span>
                </span>
              </button>
              <figcaption className='border-foreground/15 mt-4 flex items-start gap-4 border-t pt-3'>
                <span className='text-muted-foreground font-mono text-xs'>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className='text-sm leading-6 text-pretty'>{alt}</span>
              </figcaption>
            </m.figure>
          )
        })}
      </div>

      <AnimatePresence>
        {activeImage ? (
          <m.div
            role='dialog'
            aria-modal='true'
            aria-label={`${title}: ${activeImage.alt}`}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setActiveImage(null)
            }}
          >
            <button
              ref={closeButtonRef}
              type='button'
              onClick={() => setActiveImage(null)}
              aria-label={closeLabel}
              className='absolute top-5 right-5 flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-150 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:top-8 sm:right-8'
            >
              <CloseIcon />
            </button>

            <m.figure
              className='flex max-h-[88vh] max-w-[94vw] flex-col items-center gap-4'
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className='max-h-[80vh] max-w-full object-contain select-none'
              />
              <figcaption className='flex w-full items-center justify-between gap-5 text-xs text-white/70'>
                <span>{activeImage.alt}</span>
                <span className='font-mono'>
                  {String(activeImage.index + 1).padStart(2, '0')} /{' '}
                  {String(images.length).padStart(2, '0')}
                </span>
              </figcaption>
            </m.figure>
          </m.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function ExpandIcon() {
  return (
    <svg
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      className='size-4'
      aria-hidden='true'
    >
      <path d='M7.5 3H3v4.5M12.5 3H17v4.5M7.5 17H3v-4.5M12.5 17H17v-4.5' />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      className='size-5'
      aria-hidden='true'
    >
      <path d='m4 4 12 12M16 4 4 16' />
    </svg>
  )
}
