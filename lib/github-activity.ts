import 'server-only'
import { z } from 'zod'
import { DATA } from '@/data/resume'

export const githubUrl = DATA.socials.find((social) => social.name === 'GitHub')!.url
const username = new URL(githubUrl).pathname.slice(1)

const contributionSchema = z.object({
  date: z.iso.date(),
  count: z.number().int().nonnegative(),
  level: z.number().int().min(0).max(4),
})

const activitySchema = z.object({
  contributions: z.array(contributionSchema).min(1).max(371),
})

export function parseGitHubActivity(data: unknown) {
  const { contributions } = activitySchema.parse(data)
  const days = contributions.sort((a, b) => a.date.localeCompare(b.date))
  if (
    days.some(
      (day, index) =>
        index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== 86_400_000,
    )
  ) {
    throw new Error('GitHub contribution dates must be consecutive')
  }

  const offset = new Date(days[0].date).getUTCDay()
  const weeks = Array.from({ length: Math.ceil((days.length + offset) / 7) }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => days[week * 7 + weekday - offset] ?? null),
  )

  return {
    weeks,
    total: days.reduce((sum, day) => sum + day.count, 0),
  }
}

export async function getGitHubActivity() {
  try {
    // shortcut: this public proxy needs no token; use GitHub GraphQL if availability becomes an issue.
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) },
    )
    if (!response.ok) throw new Error(`GitHub activity request failed (${response.status})`)
    return parseGitHubActivity(await response.json())
  } catch (error) {
    console.warn('Could not load GitHub activity:', error)
    return null
  }
}
