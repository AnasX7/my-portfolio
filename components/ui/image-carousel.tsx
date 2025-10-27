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
    <div className='w-full lg:w-[50%] h-full pb-0 sm:pb-15 lg:pb-0 lg:pt-62 flex lg:flex-col justify-center items-center'>
      <div
        className={`absolute ${
          isRtl ? 'lg:left-0' : 'lg:right-0'
        } lg:bottom-1/5 w-full lg:w-[50%] h-full overflow-hidden flex justify-center items-center`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial='enter'
            animate='center'
            exit='exit'
            className='absolute w-full h-full flex justify-center items-center'>
            <Image
              src={currentImage}
              alt={`Project Screenshot ${currentIndex + 1}`}
              width={500}
              height={500}
              className='max-w-full max-h-full object-contain select-none pointer-events-none'
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex flex-row px-6 gap-4 w-full justify-between lg:justify-center z-10'>
        <button
          onClick={() => navigate(-1)}
          className='bg-muted rounded-full px-2 py-2 hover:bg-muted-foreground/10 transition-colors cursor-pointer'>
          <ChevronLeft className={isRtl ? 'rotate-180' : ''} />
        </button>
        <button
          onClick={() => navigate(1)}
          className='bg-muted rounded-full px-2 py-2 hover:bg-muted-foreground/10 transition-colors cursor-pointer'>
          <ChevronRight className={isRtl ? 'rotate-180' : ''} />
        </button>
      </div>
    </div>
  )
}

export default ImageCarousel
