'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProjectGalleryProps {
  images: string[]
  imageAlts: string[]
  title: string
  isRtl: boolean
}

export default function ProjectGallery({ images, imageAlts, title, isRtl }: ProjectGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null)

  return (
    <div>
      <h2 className='text-foreground mb-6 text-xl font-bold tracking-tight'>
        {isRtl ? 'معرض صور المشروع' : 'Project Gallery'}
      </h2>
      <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2'>
        {images.map((image, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(image)}
            className='border-border/40 bg-card/25 hover:bg-card/40 cursor-pointer overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md active:scale-99'
          >
            <div className='relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-900/5 dark:bg-zinc-100/5'>
              <Image
                src={image}
                alt={imageAlts[idx] ?? `${title} screenshot ${idx + 2}`}
                fill
                sizes='(max-width: 768px) 100vw, 400px'
                className='object-contain transition-transform duration-300 hover:scale-103'
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className='animate-in fade-in fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-md duration-200'
        >
          <button
            onClick={() => setActiveImage(null)}
            className='absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 hover:text-zinc-300 focus:outline-none'
            aria-label='Close gallery lightbox'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='size-6'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
          <div className='relative flex aspect-auto max-h-[90vh] max-w-[95vw] items-center justify-center'>
            <img
              src={activeImage}
              alt='Project screenshot preview'
              className='animate-in zoom-in-95 max-h-[85vh] max-w-full rounded-lg border border-white/10 object-contain shadow-2xl duration-200 select-none'
            />
          </div>
        </div>
      )}
    </div>
  )
}
