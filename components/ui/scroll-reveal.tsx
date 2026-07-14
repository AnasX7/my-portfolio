'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'

import './scroll-reveal.css'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  start?: string
  end?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  start = 'top 85%',
  end = 'bottom 70%',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const lenis = useLenis()

  // Keep ScrollTrigger updated with Lenis scroll events
  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', ScrollTrigger.update)
    return () => {
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  const splitText = useMemo(() => {
    const childrenArray = React.Children.toArray(children)
    return childrenArray.map((child, idx) => {
      if (typeof child === 'string') {
        return child.split(/(\s+)/).map((word, index) => {
          if (word.match(/^\s+$/)) return word
          return (
            <span className='word' key={`${idx}-${index}`}>
              {word}
            </span>
          )
        })
      }
      return (
        <span className='word inline-block align-middle' key={idx}>
          {child}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window

    // Using gsap.context() ensures safe cleanup and strict mode compatibility
    const ctx = gsap.context(() => {
      // Rotation Animation
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start,
            end,
            scrub: true,
          },
        },
      )

      const wordElements = el.querySelectorAll('.word')

      // Opacity Animation
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity, filter' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start,
            end,
            scrub: true,
          },
        },
      )

      // Blur Animation
      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start,
              end,
              scrub: true,
            },
          },
        )
      }
    }, el)

    // Force layout calculation refresh after hydration completes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, start, end, blurStrength])

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  )
}

export default ScrollReveal
