'use client'

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline'
import { useLocale, useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'

export default function ExperinceTimeline() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <div 
    className={cn('relative', isRTL ? 'sm:mr-16' : 'sm:ml-16')}
    >
      <Timeline defaultValue={DATA.timeline.DefaultValue}>
        {DATA.timeline.entries.map((item) => (
          <TimelineItem
            key={item.id}
            step={item.id}
            className={cn(
              'group-data-[orientation=vertical]/timeline:sm:ms-24',
              isRTL &&
                'group-data-[orientation=vertical]/timeline:sm:ms-24 group-data-[orientation=vertical]/timeline:sm:me-24'
            )}>
            <TimelineHeader>
              <TimelineSeparator />
              <TimelineDate
                className={cn(
                  'group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:w-16 ',
                  isRTL
                    ? 'group-data-[orientation=vertical]/timeline:sm:-right-28 group-data-[orientation=vertical]/timeline:sm:text-left'
                    : 'group-data-[orientation=vertical]/timeline:sm:-left-28 group-data-[orientation=vertical]/timeline:sm:text-right'
                )}>
                {t(item.dateKey)}
              </TimelineDate>
              <TimelineTitle className='sm:-mt-0.5'>
                {t(item.titleKey)}
              </TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent className={cn(isRTL ? 'sm:pl-0' : 'sm:pr-0')}>
              {t(item.descriptionKey)}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
