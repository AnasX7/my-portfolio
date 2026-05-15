'use client'

import React, { useEffect, useRef } from 'react'
import { m, useMotionValue, useSpring, type SpringOptions } from 'motion/react'

const SPRING_CONFIG = { stiffness: 26.7, damping: 4.1, mass: 0.2 }

type MagneticProps = {
  children: React.ReactNode
  intensity?: number
  range?: number
  actionArea?: 'self' | 'parent' | 'global'
  springOptions?: SpringOptions
}

export function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  actionArea = 'self',
  springOptions = SPRING_CONFIG,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(actionArea === 'global')

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, springOptions)
  const springY = useSpring(y, springOptions)

  useEffect(() => {
    isHoveredRef.current = actionArea === 'global'
  }, [actionArea])

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY

        const absoluteDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

        const isActive = actionArea === 'global' || isHoveredRef.current

        if (isActive && absoluteDistance <= range) {
          const scale = 1 - absoluteDistance / range
          x.set(distanceX * intensity * scale)
          y.set(distanceY * intensity * scale)
        } else {
          x.set(0)
          y.set(0)
        }
      }
    }

    document.addEventListener('mousemove', calculateDistance)

    return () => {
      document.removeEventListener('mousemove', calculateDistance)
    }
  }, [actionArea, intensity, range, x, y])

  useEffect(() => {
    if (actionArea !== 'parent' || !ref.current?.parentElement) {
      return
    }

    const parent = ref.current.parentElement

    const handleParentEnter = () => {
      isHoveredRef.current = true
    }

    const handleParentLeave = () => {
      isHoveredRef.current = false
      x.set(0)
      y.set(0)
    }

    parent.addEventListener('mouseenter', handleParentEnter)
    parent.addEventListener('mouseleave', handleParentLeave)

    return () => {
      parent.removeEventListener('mouseenter', handleParentEnter)
      parent.removeEventListener('mouseleave', handleParentLeave)
    }
  }, [actionArea, x, y])

  const handleMouseEnter = () => {
    if (actionArea === 'self') {
      isHoveredRef.current = true
    }
  }

  const handleMouseLeave = () => {
    if (actionArea === 'self') {
      isHoveredRef.current = false
      x.set(0)
      y.set(0)
    }
  }

  return (
    <m.div
      ref={ref}
      onMouseEnter={actionArea === 'self' ? handleMouseEnter : undefined}
      onMouseLeave={actionArea === 'self' ? handleMouseLeave : undefined}
      style={{
        x: springX,
        y: springY,
      }}
    >
      {children}
    </m.div>
  )
}
