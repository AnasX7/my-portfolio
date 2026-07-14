'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { HugeiconsIcon } from '@hugeicons/react'
import { TranslateIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Button } from './button'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleLanguageClick = (lang: string) => {
    if (lang === currentLocale) return
    const segments = pathname.split('/')
    segments[1] = lang
    const newPath = segments.join('/')
    router.push(newPath as any)
  }

  const nextLocale = currentLocale === 'en' ? 'ar' : 'en'
  const nextLabel = nextLocale === 'en' ? 'English' : 'العربية'

  return (
    <Button
      type='button'
      variant='outline'
      className={cn('rounded-full h-9 px-4 text-xs font-bold flex items-center gap-1.5', {
        'font-sans': nextLocale === 'ar',
        'font-inter': nextLocale === 'en',
      })}
      onClick={() => handleLanguageClick(nextLocale)}
      aria-label={`Switch language to ${nextLocale === 'en' ? 'English' : 'العربية'}`}
    >
      <span>{nextLabel}</span>
      <HugeiconsIcon icon={TranslateIcon} className='text-muted-foreground size-4' />
    </Button>
  )
}
