'use client'

import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react'
import Lenis from 'lenis'
import { useLenis } from 'lenis/react'
import './scroll-stack.css'

interface ScrollStackItemProps {
  children: React.ReactNode
  itemClassName?: string
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
}) => <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>

interface ScrollStackProps {
  children: React.ReactNode
  className?: string
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string | number
  scaleEndPosition?: string | number
  baseScale?: number
  scaleDuration?: number
  rotationAmount?: number
  blurAmount?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const lastTransformsRef = useRef<
    Map<number, { translateY: number; scale: number; rotation: number; blur: number }>
  >(new Map())
  const isUpdatingRef = useRef(false)

  // Caching offsets to prevent layout thrashing and infinite loops during scroll
  const cardOffsetsRef = useRef<number[]>([])
  const endElementOffsetTopRef = useRef<number>(0)

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return parseFloat(value as string)
  }, [])

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      }
    } else {
      const scroller = scrollerRef.current
      if (!scroller) {
        return {
          scrollTop: 0,
          containerHeight: 0,
          scrollContainer: null,
        }
      }
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller,
      }
    }
  }, [useWindowScroll])

  const measureLayout = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const cards = cardsRef.current
    if (!cards.length) return

    // Temporarily clear active transforms to measure static layout offsets
    const originalStyles = cards.map((card) => {
      const transform = card.style.transform
      const filter = card.style.filter
      card.style.transform = ''
      card.style.filter = ''
      return { transform, filter }
    })

    // Measure static card tops relative to the document
    cardOffsetsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect()
      return rect.top + window.scrollY
    })

    // Measure static end element top relative to the document
    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scroller.querySelector('.scroll-stack-end') as HTMLElement | null)
    if (endElement) {
      const rect = endElement.getBoundingClientRect()
      endElementOffsetTopRef.current = rect.top + window.scrollY
    }

    // Dynamic inner container padding adjustment to prevent layout overlaps
    const innerContainer = scroller.querySelector('.scroll-stack-inner') as HTMLElement | null
    if (innerContainer && cards.length > 0) {
      const containerHeight = useWindowScroll ? window.innerHeight : scroller.clientHeight
      const stackPositionPx = parsePercentage(stackPosition, containerHeight)
      const firstCardTop = cardOffsetsRef.current[0] || 0
      const lastCardTop = cardOffsetsRef.current[cards.length - 1] || 0
      const firstCardPinStart = firstCardTop - stackPositionPx
      const lastCardPinStart =
        lastCardTop - stackPositionPx - itemStackDistance * (cards.length - 1)
      const activeScrollRange = 200 // matching release pin duration range

      // Calculate paddingBottom to align the bottom card with the next section at the moment of release
      const calculatedPadding = activeScrollRange - itemStackDistance * (cards.length - 1)
      const paddingBottom = Math.max(200, calculatedPadding + 60) // 60px safe margin buffer to prevent overlaps
      innerContainer.style.paddingBottom = `${paddingBottom}px`
    }

    // Restore original transforms
    cards.forEach((card, i) => {
      card.style.transform = originalStyles[i].transform
      card.style.filter = originalStyles[i].filter
    })
  }, [useWindowScroll, stackPosition, itemStackDistance, parsePercentage])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return

    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)
    const endElementTop = endElementOffsetTopRef.current

    // Prevent overlapping with subsequent page sections by releasing at a fixed scroll range
    let pinEnd = endElementTop - containerHeight / 2
    if (useWindowScroll && cardsRef.current.length > 0) {
      const lastCardIndex = cardsRef.current.length - 1
      const lastCardTop = cardOffsetsRef.current[lastCardIndex] || 0
      const lastCardPinStart = lastCardTop - stackPositionPx - itemStackDistance * lastCardIndex
      const activeScrollRange = 200 // Keep cards pinned for 200px after stacking, matching CSS bottom padding
      pinEnd = lastCardPinStart + activeScrollRange
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = cardOffsetsRef.current[i] || 0
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cardOffsetsRef.current[j] || 0
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i
          blur = Math.max(0, depthInStack * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''

        card.style.transform = transform
        card.style.filter = filter

        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    useWindowScroll,
  ])

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      return null
    } else {
      const scroller = scrollerRef.current
      if (!scroller) return null

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: 'vertical',
        normalizeWheel: true,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      } as any)

      const handleScrollLocal = () => {
        updateCardTransforms()
      }

      lenis.on('scroll', handleScrollLocal)

      const raf = (time: number) => {
        lenis.raf(time)
        animationFrameRef.current = requestAnimationFrame(raf)
      }
      animationFrameRef.current = requestAnimationFrame(raf)

      lenisRef.current = lenis
      return lenis
    }
  }, [updateCardTransforms, useWindowScroll])

  // Hook into existing global Lenis if useWindowScroll is true, with window event fallback
  const globalLenis = useLenis()

  useEffect(() => {
    if (!useWindowScroll) return

    const handleScrollEvent = () => {
      updateCardTransforms()
    }

    if (globalLenis) {
      globalLenis.on('scroll', handleScrollEvent)
      updateCardTransforms()
      return () => {
        globalLenis.off('scroll', handleScrollEvent)
      }
    } else {
      window.addEventListener('scroll', handleScrollEvent, { passive: true })
      updateCardTransforms()
      return () => {
        window.removeEventListener('scroll', handleScrollEvent)
      }
    }
  }, [useWindowScroll, globalLenis, updateCardTransforms])

  // Recalculate offsets on window resize or when layout settles
  useEffect(() => {
    measureLayout()
    const timer = setTimeout(measureLayout, 150)
    window.addEventListener('resize', measureLayout)
    window.addEventListener('load', measureLayout)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measureLayout)
      window.removeEventListener('load', measureLayout)
    }
  }, [measureLayout])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller
          ? scroller.querySelectorAll('.scroll-stack-card')
          : [],
    ) as HTMLElement[]

    cardsRef.current = cards
    const transformsCache = lastTransformsRef.current

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`
      }
      // Set explicit z-index to enforce stacking sequence (Card i+1 stacks on top of Card i)
      card.style.zIndex = String(i + 1)
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      ;(card.style as any).webkitTransform = 'translateZ(0)'
      card.style.perspective = '1000px'
      ;(card.style as any).webkitPerspective = '1000px'
    })

    measureLayout()

    let localLenis: Lenis | null = null
    if (!useWindowScroll) {
      localLenis = setupLenis()
    }

    updateCardTransforms()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (localLenis) {
        localLenis.destroy()
      }
      stackCompletedRef.current = false
      cardsRef.current = []
      transformsCache.clear()
      isUpdatingRef.current = false
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    measureLayout,
  ])

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'use-window-scroll' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className='scroll-stack-inner'>
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className='scroll-stack-end' />
      </div>
    </div>
  )
}

export default ScrollStack
