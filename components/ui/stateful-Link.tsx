'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { motion, useAnimate } from 'motion/react'
import { Link } from '@/i18n/navigation'

interface StatefulLinkProps {
  className?: string
  children: React.ReactNode
  icon?: React.ReactNode
  href: string
}

export const StatefulLink = ({
  className,
  children,
  icon,
  href,
  ...props
}: StatefulLinkProps) => {
  const [scope, animate] = useAnimate()

  const animateLoading = async () => {
    await animate(
      '.loader',
      {
        width: '20px',
        scale: 1,
        display: 'block',
      },
      {
        duration: 0.2,
      }
    )
  }

  const animateSuccess = async () => {
    await animate(
      '.loader',
      {
        width: '0px',
        scale: 0,
        display: 'none',
      },
      {
        duration: 0.2,
      }
    )
    await animate(
      '.check',
      {
        width: '20px',
        scale: 1,
        display: 'block',
      },
      {
        duration: 0.2,
      }
    )

    await animate(
      '.check',
      {
        width: '0px',
        scale: 0,
        display: 'none',
      },
      {
        delay: 2,
        duration: 0.2,
      }
    )
  }

  const handleClick = async () => {
    await animateLoading()

    // After loading animation, show success and then navigate
    setTimeout(async () => {
      await animateSuccess()
      window.open(href, '_blank')
    }, 1000)
  }

  return (
    <Link
      ref={scope}
      href={href}
      className={cn(
        'neumorphic-button hover:shadow-[0_0_20px_rgba(155, 135, 245, 0.5)] cursor-pointer relative w-full overflow-hidden rounded-2xl border-[2px] dark:border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-8 py-4 text-black dark:text-white shadow-lg transition-all duration-300 dark:hover:border-[#ffffff]/30 sm:w-auto ',
        className
      )}
      onClick={handleClick}
      {...props}>
      <div className='flex items-center gap-2'>
        <Loader />
        <CheckIcon />
        <span>{children}</span>
        {icon && <span className='ml-1'>{icon}</span>}
      </div>
    </Link>
  )
}

const Loader = () => {
  return (
    <motion.svg
      animate={{ rotate: [0, 360] }}
      initial={{ scale: 0, width: 0, display: 'none' }}
      style={{ scale: 0.5, display: 'none' }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='loader text-zinc-900 dark:text-white'>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 3a9 9 0 1 0 9 9' />
    </motion.svg>
  )
}

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{ scale: 0, width: 0, display: 'none' }}
      style={{ scale: 0.5, display: 'none' }}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='check text-zinc-900 dark:text-white'>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M9 12l2 2l4 -4' />
    </motion.svg>
  )
}
