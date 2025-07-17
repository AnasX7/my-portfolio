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
import { useMessages, useLocale } from 'next-intl'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'

interface TimelineEntry {
  id: number
  date: string
  title: string
  description: string
}

export default function Experince() {
  const messages = useMessages()
  const locale = useLocale()
  const timelineItems = (messages.Timeline as TimelineEntry[]) || []
  const isRTL = locale === 'ar'

  return (
    <div
      className={cn(
        'relative',
        isRTL ? 'sm:mr-8' : 'sm:ml-8'
      )}>
      <Timeline defaultValue={DATA.timelineDefaultValue}>
        {timelineItems.map((item) => (
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
                {item.date}
              </TimelineDate>
              <TimelineTitle className='sm:-mt-0.5'>{item.title}</TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent className={cn(
              isRTL ? 'sm:pl-0' : 'sm:pr-4'
            )}>
              {item.description}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}