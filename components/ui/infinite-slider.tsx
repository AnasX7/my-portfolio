'use client'

import { cn } from '@/lib/utils'
import { useMotionValue, animate, motion } from 'motion/react'
import { useState, useEffect } from 'react'
import useMeasure from 'react-use-measure'
import { useLocale } from 'next-intl'

export type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  speed?: number
  speedOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed)
  const [ref, { width, height }] = useMeasure()
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)

  // Detect RTL based on locale
  const locale = useLocale()
  const isRTL = locale === 'ar'

  useEffect(() => {
    let controls
    const size = direction === 'horizontal' ? width : height
    const contentSize = size + gap

    // Determine animation direction based on RTL and orientation
    // RTL horizontal: moves Right (positive)
    // LTR horizontal: moves Left (negative)
    // Vertical: moves Up (negative)
    const isHorizontal = direction === 'horizontal'
    const directionMultiplier = isRTL && isHorizontal ? 1 : -1

    const from = reverse ? (directionMultiplier * contentSize) / 2 : 0
    const to = reverse ? 0 : (directionMultiplier * contentSize) / 2

    const distanceToTravel = Math.abs(to - from)
    const duration = distanceToTravel / currentSpeed

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to)
      const transitionDuration = remainingDistance / currentSpeed

      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false)
          setKey((prevKey) => prevKey + 1)
        },
      })
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from)
        },
      })
    }

    return controls?.stop
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    isRTL,
  ])

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true)
          setCurrentSpeed(speedOnHover)
        },
        onHoverEnd: () => {
          setIsTransitioning(true)
          setCurrentSpeed(speed)
        },
      }
    : {}

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className='flex w-max'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}>
        {children}
        {children}
      </motion.div>
    </div>
  )
}
