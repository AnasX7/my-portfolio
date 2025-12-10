'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'

import { cn } from '@/lib/utils'
import { Button } from './button'

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  variant = 'outline',
  size = 'icon',
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        setIsDark(newTheme)
        document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }, [isDark, duration])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn('rounded-full', className)}
        disabled
        {...props}>
        <Sun className='size-[18px]' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn('rounded-full', className)}
      {...props}>
      <div className='relative size-[18px]'>
        <Sun
          className={cn(
            'absolute inset-0 size-[18px] rotate-0 scale-100 transition-all duration-300',
            isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
          )}
          strokeWidth={2}
        />
        <Moon
          className={cn(
            'absolute inset-0 size-[18px] rotate-90 scale-0 transition-all duration-300',
            isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
          )}
          strokeWidth={2}
        />
      </div>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
