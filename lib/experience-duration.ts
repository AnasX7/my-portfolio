export interface YearMonth {
  year: number
  month: number
}

export interface ExperienceDuration {
  years: number
  months: number
  totalMonths: number
}

export interface ExperiencePeriod {
  startDate: YearMonth
  endDate?: YearMonth
}

function toMonthIndex(value: YearMonth) {
  if (
    !Number.isInteger(value.year) ||
    !Number.isInteger(value.month) ||
    value.month < 1 ||
    value.month > 12
  ) {
    throw new RangeError('Experience dates must use a valid year and month')
  }

  return value.year * 12 + value.month - 1
}

export function calculateExperienceDuration(start: YearMonth, end: YearMonth): ExperienceDuration {
  const totalMonths = toMonthIndex(end) - toMonthIndex(start) + 1

  if (totalMonths < 1) {
    throw new RangeError('Experience end date must not be before its start date')
  }

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    totalMonths,
  }
}

export function getExperienceRange(periods: readonly ExperiencePeriod[], currentMonth: YearMonth) {
  if (periods.length === 0) {
    throw new RangeError('At least one experience period is required')
  }

  const start = periods.reduce(
    (earliest, period) =>
      toMonthIndex(period.startDate) < toMonthIndex(earliest) ? period.startDate : earliest,
    periods[0].startDate,
  )
  const end = periods.some((period) => !period.endDate)
    ? currentMonth
    : periods.reduce((latest, period) => {
        const endDate = period.endDate!
        return toMonthIndex(endDate) > toMonthIndex(latest) ? endDate : latest
      }, periods[0].endDate!)

  return { start, end }
}

export function formatExperienceMonth(locale: string, value: YearMonth) {
  toMonthIndex(value)

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(value.year, value.month - 1, 1)))
}
