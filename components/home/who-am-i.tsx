'use client'

import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface InlineBadgeProps {
  children: React.ReactNode
  icons?: string[]
  className?: string
}

const InlineBadge = ({ children, icons, className }: InlineBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-4 py-3 select-none leading-none',
      'mx-1 align-middle backdrop-blur-xs',
      'dark:border-white/20 dark:bg-white/[0.03]',
      'shadow-[0_0_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.06)]',
      'dark:shadow-[0_0_10px_rgba(255,255,255,0.08),0_0_20px_rgba(255,255,255,0.04),inset_0_1px_1px_rgba(255,255,255,0.06)]',
      className,
    )}
  >
    {icons &&
      icons.map((icon, idx) => (
        <img
          key={idx}
          src={icon}
          alt=''
          className={cn(
            'size-[1em] object-contain',
            icon.includes('nextdotjs') && 'dark:brightness-0 dark:invert',
          )}
          aria-hidden='true'
        />
      ))}
    <span
      className='animate-shine bg-clip-text text-[1.05em] font-normal text-transparent'
      style={{
        backgroundImage:
          'linear-gradient(120deg, color-mix(in oklch, var(--foreground) 65%, transparent) 35%, var(--foreground) 50%, color-mix(in oklch, var(--foreground) 65%, transparent) 65%)',
        backgroundSize: '200% 100%',
        animationDuration: '4s',
        filter: 'drop-shadow(0 0 6px var(--grid-glow-color))',
      }}
    >
      {children}
    </span>
  </span>
)

export default function WhoAmI() {
  const t = useTranslations('about.whoAmI')
  const locale = useLocale()
  const isArabic = locale === 'ar'

  const textClass = cn(
    'text-foreground text-center font-light tracking-tight text-balance',
    'text-base sm:text-lg md:text-xl',
    isArabic ? 'leading-[2.8] sm:leading-[2.9]' : 'leading-[2.8] sm:leading-[2.9]',
  )

  return (
    <section id='about' className='mt-18 sm:mt-20'>
      <div className='mx-auto max-w-3xl px-6 sm:px-8'>
        <ScrollReveal baseOpacity={0.05} textClassName={textClass}>
          {/* Sentence 1 */}
          {t('line1.pre')} <InlineBadge>{t('line1.badge1')}</InlineBadge> {t('line1.mid')}{' '}
          <InlineBadge>{t('line1.badge2')}</InlineBadge> {t('line1.post')} {/* Sentence 2 */}
          {t('line2.pre')}{' '}
          <InlineBadge icons={['https://cdn.simpleicons.org/nextdotjs']}>
            {t('line2.badge1')}
          </InlineBadge>{' '}
          {t('line2.mid')}{' '}
          <InlineBadge icons={['https://cdn.simpleicons.org/nestjs']}>
            {t('line2.badge2')}
          </InlineBadge>{' '}
          {t('line2.post')} {/* Sentence 3 */}
          {t('line3.pre')} <InlineBadge>{t('line3.role')}</InlineBadge> {t('line3.post')}
        </ScrollReveal>
      </div>
    </section>
  )
}
