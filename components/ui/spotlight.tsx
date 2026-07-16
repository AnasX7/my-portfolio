'use client'

import { m } from 'motion/react'
import { useSyncExternalStore, type CSSProperties } from 'react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

type SpotlightProps = {
  gradientFirst?: string
  gradientSecond?: string
  gradientThird?: string
  translateY?: number
  width?: number
  height?: number
  smallWidth?: number
  duration?: number
  xOffset?: number
  className?: string
}

export const Spotlight = ({
  gradientFirst = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, var(--spotlight-main, hsla(0,0%,100%,.08)) 0, var(--spotlight-fade, hsla(0,0%,100%,.02)) 50%, var(--spotlight-end, hsla(0,0%,100%,0)) 80%)',
  gradientSecond = 'radial-gradient(50% 50% at 50% 50%, var(--spotlight-main, hsla(0,0%,100%,.06)) 0, var(--spotlight-fade, hsla(0,0%,100%,.02)) 80%, transparent 100%)',
  gradientThird = 'radial-gradient(50% 50% at 50% 50%, var(--spotlight-main, hsla(0,0%,100%,.04)) 0, var(--spotlight-end, hsla(0,0%,100%,.02)) 80%, transparent 100%)',
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
  className = '',
}: SpotlightProps = {}) => {
  const shouldReduceMotion = useHydratedReducedMotion()
  const isMobile = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {}
      window.addEventListener('resize', onStoreChange)
      return () => window.removeEventListener('resize', onStoreChange)
    },
    () => (typeof window !== 'undefined' ? window.innerWidth < 640 : false),
    () => false,
  )

  const mobileWidth = 320
  const mobileHeight = 600
  const mobileSmallWidth = 120
  const mobileTranslateY = -120
  const mobileXOffset = 40

  return (
    <m.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className={`pointer-events-none absolute inset-0 z-[-1] max-h-full max-w-full overflow-hidden ${className}`}
      style={
        {
          // Light mode: white gradients, dark mode: black gradients
          // These CSS vars can be overridden by a parent or via className
          '--spotlight-main': 'hsla(0,0%,100%,.08)',
          '--spotlight-fade': 'hsla(0,0%,100%,.02)',
          '--spotlight-end': 'hsla(0,0%,100%,0)',
        } as CSSProperties
      }
    >
      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, isMobile ? mobileXOffset : xOffset, 0],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }
        }
        className='pointer-events-none absolute top-0 left-0 overflow-visible'
      >
        <div
          style={{
            transform: `translateY(${isMobile ? mobileTranslateY : translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${isMobile ? mobileWidth : width}px`,
            height: `${isMobile ? mobileHeight : height}px`,
          }}
          className={`absolute top-0 left-0`}
        />

        <div
          style={{
            transform: 'rotate(-45deg) translate(5%, -50%)',
            background: gradientSecond,
            width: `${isMobile ? mobileSmallWidth : smallWidth}px`,
            height: `${isMobile ? mobileHeight : height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />

        <div
          style={{
            transform: 'rotate(-45deg) translate(-180%, -70%)',
            background: gradientThird,
            width: `${isMobile ? mobileSmallWidth : smallWidth}px`,
            height: `${isMobile ? mobileHeight : height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />
      </m.div>

      <m.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, -(isMobile ? mobileXOffset : xOffset), 0],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }
        }
        className='pointer-events-none absolute top-0 right-0 overflow-visible'
      >
        <div
          style={{
            transform: `translateY(${isMobile ? mobileTranslateY : translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${isMobile ? mobileWidth : width}px`,
            height: `${isMobile ? mobileHeight : height}px`,
          }}
          className={`absolute top-0 right-0`}
        />

        <div
          style={{
            transform: 'rotate(45deg) translate(-5%, -50%)',
            background: gradientSecond,
            width: `${isMobile ? mobileSmallWidth : smallWidth}px`,
            height: `${isMobile ? mobileHeight : height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />

        <div
          style={{
            transform: 'rotate(45deg) translate(180%, -70%)',
            background: gradientThird,
            width: `${isMobile ? mobileSmallWidth : smallWidth}px`,
            height: `${isMobile ? mobileHeight : height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />
      </m.div>
    </m.div>
  )
}
