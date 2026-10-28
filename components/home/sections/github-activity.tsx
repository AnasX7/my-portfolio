import { Suspense } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { TextReveal } from '@/components/ui/text-reveal'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { getGitHubActivity, githubUrl } from '@/lib/github-activity'
import styles from './github-activity.module.css'

async function ActivityCalendar() {
  const [activity, locale, t] = await Promise.all([
    getGitHubActivity(),
    getLocale(),
    getTranslations('githubActivity'),
  ])

  if (!activity) {
    return <p className='text-muted-foreground py-12 text-center text-sm'>{t('unavailable')}</p>
  }

  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' })
  const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })

  return (
    <>
      {/* Keep absolutely positioned screen-reader labels inside the calendar's scroll area. */}
      <div
        role='region'
        aria-label={t('calendar')}
        tabIndex={0}
        dir='rtl'
        className='focus-visible:outline-ring relative overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4'
        data-lenis-prevent
      >
        <table dir='ltr' className={styles.calendar}>
          <caption className='sr-only'>{t('description')}</caption>
          <thead>
            <tr>
              <td />
              {activity.weeks.map((week) => {
                const firstDay = week.find((day) => day !== null)!
                const monthLabel = week.find((day) => day?.date.endsWith('-01'))
                return (
                  <th key={firstDay.date} scope='col' className={styles.month}>
                    <span className='sr-only'>
                      {t('weekOf', { date: date.format(new Date(firstDay.date)) })}
                    </span>
                    {monthLabel && (
                      <span aria-hidden='true'>{month.format(new Date(monthLabel.date))}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <tr key={dayIndex}>
                <th scope='row' className={styles.weekday}>
                  <span className={dayIndex % 2 === 0 ? 'sr-only' : undefined}>
                    {weekday.format(new Date(Date.UTC(2026, 0, 4 + dayIndex)))}
                  </span>
                </th>
                {activity.weeks.map((week, weekIndex) => {
                  const day = week[dayIndex]
                  const label = day
                    ? t('day', { date: date.format(new Date(day.date)), count: day.count })
                    : undefined
                  return (
                    <td key={weekIndex} title={label}>
                      {day && (
                        <span className={styles.day} data-level={day.level}>
                          <span className='sr-only'>{label}</span>
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-3 text-xs'>
        <p>{activity.total === 0 ? t('empty') : t('period')}</p>
        <div className='flex items-center gap-2' aria-hidden='true'>
          <span>{t('less')}</span>
          <div className='flex gap-1' dir='ltr'>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className={`${styles.day} size-3!`} data-level={level} />
            ))}
          </div>
          <span>{t('more')}</span>
        </div>
      </div>
    </>
  )
}

export default async function GitHubActivity() {
  const t = await getTranslations('githubActivity')

  return (
    <section id='github' aria-labelledby='github-heading' className='content-section scroll-mt-24'>
      <div className='section-inner'>
        <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
          <TextReveal as='h2' id='github-heading' className='section-title'>
            {t('title')}
          </TextReveal>
          <a
            href={githubUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={buttonVariants({ variant: 'secondary' })}
          >
            <AnimatedButtonContent>
              <Icons.GitHub className='size-4' aria-hidden='true' />
              {t('viewGithub')}
            </AnimatedButtonContent>
          </a>
        </div>
        <Suspense
          fallback={
            <div
              role='status'
              className='text-muted-foreground flex min-h-72 items-center justify-center text-sm'
            >
              {t('loading')}
            </div>
          }
        >
          <ActivityCalendar />
        </Suspense>
      </div>
    </section>
  )
}
