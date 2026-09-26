'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { HugeiconsIcon } from '@hugeicons/react'
import { TranslateIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Button } from './button'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
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
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={`Switch language to ${nextLocale === 'en' ? 'English' : 'العربية'}`}
    >
      <span>{nextLabel}</span>
      <HugeiconsIcon icon={TranslateIcon} className='text-muted-foreground size-4' />
    </Button>
  )
}
