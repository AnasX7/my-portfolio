'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sun01Icon, Moon02Icon } from '@hugeicons/core-free-icons'
import { flushSync } from 'react-dom'

import { cn } from '@/lib/utils'
import { Button } from './button'

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<typeof Button> {
  duration?: number
}

const subscribeThemeClass = (onStoreChange: () => void) => {
  if (typeof document === 'undefined') {
    return () => {}
  }

  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => observer.disconnect()
}

const getThemeSnapshot = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

const getServerThemeSnapshot = () => false

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  variant = 'outline',
  size = 'icon',
  ...props
}: AnimatedThemeTogglerProps) => {
  const isDark = useSyncExternalStore(subscribeThemeClass, getThemeSnapshot, getServerThemeSnapshot)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      })
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    )

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  }, [isDark, duration])

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn('rounded-full', className)}
      {...props}
    >
      <div className='relative size-4.5'>
        <HugeiconsIcon
          icon={Sun01Icon}
          className={cn(
            'absolute inset-0 size-4.5 rotate-0 scale-100 transition-all duration-300',
            isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0',
          )}
          strokeWidth={2}
        />
        <HugeiconsIcon
          icon={Moon02Icon}
          className={cn(
            'absolute inset-0 size-4.5 rotate-90 scale-0 transition-all duration-300',
            isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100',
          )}
          strokeWidth={2}
        />
      </div>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
