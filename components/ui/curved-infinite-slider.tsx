'use client'

import { cn } from '@/lib/utils'
import { animate, m, type MotionValue, useInView, useMotionValue, useTransform } from 'motion/react'
import { useLocale } from 'next-intl'
import { Children, useEffect, useMemo, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

type CurvedInfiniteSliderProps = {
  children: React.ReactNode
  arcDepth?: number
  className?: string
  gap?: number
  itemWidth?: number
  reverse?: boolean
  speed?: number
  speedOnHover?: number
}

type CurvedSliderItemProps = {
  baseX: number
  depth: number
  itemWidth: number
  translation: MotionValue<number>
  viewportWidth: number
  children: React.ReactNode
}

export function getArcOffset(position: number, viewportWidth: number, depth: number) {
  if (viewportWidth <= 0 || position <= 0 || position >= viewportWidth) return 0

  const normalizedPosition = (position - viewportWidth / 2) / (viewportWidth / 2)

  return -depth * (1 - normalizedPosition ** 2)
}

function CurvedSliderItem({
  baseX,
  children,
  depth,
  itemWidth,
  translation,
  viewportWidth,
}: CurvedSliderItemProps) {
  const y = useTransform(translation, (currentTranslation) =>
    getArcOffset(baseX + currentTranslation + itemWidth / 2, viewportWidth, depth),
  )

  return (
    <m.div
      className='absolute bottom-2 left-0 flex items-center justify-center'
      style={{ width: itemWidth, x: baseX, y }}
    >
      {children}
    </m.div>
  )
}

export function CurvedInfiniteSlider({
  arcDepth = 24,
  children,
  className,
  gap = 32,
  itemWidth = 64,
  reverse = false,
  speed = 80,
  speedOnHover,
}: CurvedInfiniteSliderProps) {
  const items = useMemo(() => Children.toArray(children), [children])
  const cycleWidth = items.length * (itemWidth + gap)
  const translation = useMotionValue(0)
  const shouldReduceMotion = useHydratedReducedMotion()
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const movesRight = reverse !== isRTL
  const viewportRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(viewportRef, { amount: 0.1 })
  const [measureRef, { width: viewportWidth }] = useMeasure()
  const [isHovering, setIsHovering] = useState(false)
  const [iteration, setIteration] = useState(0)
  const currentSpeed = isHovering && speedOnHover ? speedOnHover : speed

  useEffect(() => {
    if (shouldReduceMotion || !isInView || cycleWidth === 0) return

    let currentPosition = translation.get()

    if (movesRight && currentPosition >= -0.5) {
      currentPosition = -cycleWidth
      translation.set(currentPosition)
    } else if (!movesRight && currentPosition <= -cycleWidth + 0.5) {
      currentPosition = 0
      translation.set(currentPosition)
    }

    const target = movesRight ? 0 : -cycleWidth
    const duration = Math.abs(target - currentPosition) / currentSpeed
    const controls = animate(translation, target, {
      duration,
      ease: 'linear',
      onComplete: () => setIteration((currentIteration) => currentIteration + 1),
    })

    return controls.stop
  }, [currentSpeed, cycleWidth, isInView, iteration, movesRight, shouldReduceMotion, translation])

  return (
    <div
      className={cn('relative h-24 overflow-hidden md:h-28', className)}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
      ref={viewportRef}
    >
      <div className='absolute inset-0' ref={measureRef}>
        <m.div className='absolute inset-0' style={{ x: translation }}>
          {[-1, 0, 1].map((copyIndex) => (
            <div aria-hidden={copyIndex !== 0} key={copyIndex}>
              {items.map((item, itemIndex) => {
                const baseX = copyIndex * cycleWidth + itemIndex * (itemWidth + gap) + gap / 2

                return (
                  <CurvedSliderItem
                    baseX={baseX}
                    depth={arcDepth}
                    itemWidth={itemWidth}
                    key={`${copyIndex}-${itemIndex}`}
                    translation={translation}
                    viewportWidth={viewportWidth}
                  >
                    {item}
                  </CurvedSliderItem>
                )
              })}
            </div>
          ))}
        </m.div>
      </div>
    </div>
  )
}
