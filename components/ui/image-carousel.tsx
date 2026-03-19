import React, { useState } from 'react'
import { motion, AnimatePresence, Transition, Variants } from 'motion/react' // Import Variants and Transition
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'

// Define the types for ImageCarousel's props
interface ImageCarouselProps {
  images: string[] // Array of image URLs
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [direction, setDirection] = useState<number>(0) // 0 for initial, 1 for next, -1 for prev

  const local = useLocale()
  const isRtl = local === 'ar'

  const navigate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        // Next
        return (prevIndex + 1) % images.length
      } else {
        // Previous
        return (prevIndex - 1 + images.length) % images.length
      }
    })
  }

  const currentImage: string = images[currentIndex]

  // Define the spring transition explicitly
  const springTransition: Transition = {
    type: 'spring', // Here, 'spring' is correctly typed as a literal
    stiffness: 200,
    damping: 20,
  }

  const variants: Variants = {
    // Explicitly type variants as Variants
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300, // Start off-screen
      rotate: direction > 0 ? 15 : -15, // Initial rotation for slide in effect
      scale: 0.8,
      opacity: 0,
    }),
    center: {
      x: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: springTransition, // Use the explicitly typed transition
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300, // Slide off-screen in opposite direction
      rotate: direction < 0 ? 15 : -15, // Rotate as it slides out
      scale: 0.8,
      opacity: 0,
      transition: springTransition, // Use the explicitly typed transition
    }),
  }

  return (
    <div className='flex h-full w-full items-center justify-center pb-0 sm:pb-15 lg:w-[50%] lg:flex-col lg:pt-62 lg:pb-0'>
      <div
        className={`absolute ${
          isRtl ? 'lg:left-0' : 'lg:right-0'
        } flex h-full w-full items-center justify-center overflow-hidden lg:bottom-1/5 lg:w-[50%]`}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial='enter'
            animate='center'
            exit='exit'
            className='absolute flex h-full w-full items-center justify-center'
          >
            <Image
              src={currentImage}
              alt={`Project Screenshot ${currentIndex + 1}`}
              width={500}
              height={500}
              className='pointer-events-none max-h-full max-w-full object-contain select-none'
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='z-10 flex w-full flex-row justify-between gap-4 px-6 lg:justify-center'>
        <button
          onClick={() => navigate(-1)}
          className='bg-muted hover:bg-muted-foreground/10 cursor-pointer rounded-full px-2 py-2 transition-colors'
        >
          <ChevronLeft className={isRtl ? 'rotate-180' : ''} />
        </button>
        <button
          onClick={() => navigate(1)}
          className='bg-muted hover:bg-muted-foreground/10 cursor-pointer rounded-full px-2 py-2 transition-colors'
        >
          <ChevronRight className={isRtl ? 'rotate-180' : ''} />
        </button>
      </div>
    </div>
  )
}

export default ImageCarousel
