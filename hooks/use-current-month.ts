'use client'

import { useEffect, useState } from 'react'
import type { YearMonth } from '@/lib/experience-duration'

function readCurrentMonth(): YearMonth {
  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export function useCurrentMonth() {
  const [currentMonth, setCurrentMonth] = useState<YearMonth | null>(null)

  useEffect(() => {
    const updateCurrentMonth = () => {
      const nextMonth = readCurrentMonth()

      setCurrentMonth((previousMonth) =>
        previousMonth?.year === nextMonth.year && previousMonth.month === nextMonth.month
          ? previousMonth
          : nextMonth,
      )
    }

    updateCurrentMonth()
    const interval = window.setInterval(updateCurrentMonth, 60 * 60 * 1000)

    return () => window.clearInterval(interval)
  }, [])

  return currentMonth
}
