'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const handleLanguageClick = (lang: string) => {
    if (lang === currentLocale) return
    const segments = pathname.split('/')
    segments[1] = lang
    const newPath = segments.join('/')
    router.push(newPath)
  }

  const nextLocale = currentLocale === 'en' ? 'ar' : 'en'
  const nextLabel = nextLocale === 'en' ? 'English' : 'العربية'

  return (
    <button
      type='button'
      className={cn(
        'inline-flex items-center justify-center h-8 px-3 rounded-full font-semibold text-xs bg-background ring-1 ring-border transition-colors duration-200 cursor-pointer',
        'hover:bg-secondary hover:text-foreground',
        {
          'font-tajawal': nextLocale === 'ar',
          'font-inter': nextLocale === 'en',
        }
      )}
      onClick={() => handleLanguageClick(nextLocale)}
      aria-label={`Switch language to ${nextLabel}`}>
      {nextLabel}
    </button>
  )
}
