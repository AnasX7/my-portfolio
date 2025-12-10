'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Languages } from 'lucide-react'
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
  const nextLabel = nextLocale === 'en' ? 'EN' : 'ع'

  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      className={cn('rounded-full', {
        'font-tajawal': nextLocale === 'ar',
        'font-inter': nextLocale === 'en',
      })}
      onClick={() => handleLanguageClick(nextLocale)}
      aria-label={`Switch language to ${nextLocale === 'en' ? 'English' : 'العربية'}`}>
      <div className='relative flex items-center justify-center'>
        <Languages className='size-[18px] opacity-0' />
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center text-xs font-bold transition-all duration-300',
            nextLocale === 'ar' ? 'text-base' : ''
          )}>
          {nextLabel}
        </span>
      </div>
    </Button>
  )
}
