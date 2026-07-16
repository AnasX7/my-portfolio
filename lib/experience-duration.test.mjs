import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

test('experience durations count calendar months inclusively', () => {
  const result = spawnSync(
    'bun',
    [
      '-e',
      `
        import { calculateExperienceDuration } from './lib/experience-duration.ts'

        const cases = [
          [{ year: 2025, month: 10 }, { year: 2026, month: 7 }],
          [{ year: 2024, month: 12 }, { year: 2025, month: 8 }],
          [{ year: 2024, month: 6 }, { year: 2024, month: 10 }],
          [{ year: 2024, month: 12 }, { year: 2026, month: 7 }],
        ]

        console.log(JSON.stringify(cases.map(([start, end]) => calculateExperienceDuration(start, end))))
      `,
    ],
    { cwd: projectRoot, encoding: 'utf8' },
  )

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), [
    { years: 0, months: 10, totalMonths: 10 },
    { years: 0, months: 9, totalMonths: 9 },
    { years: 0, months: 5, totalMonths: 5 },
    { years: 1, months: 8, totalMonths: 20 },
  ])
})

test('experience durations reject an end month before the start month', () => {
  const result = spawnSync(
    'bun',
    [
      '-e',
      `
        import { calculateExperienceDuration } from './lib/experience-duration.ts'

        try {
          calculateExperienceDuration({ year: 2025, month: 10 }, { year: 2025, month: 9 })
          console.log('no error')
        } catch (error) {
          console.log(error instanceof RangeError ? 'range error' : 'wrong error')
        }
      `,
    ],
    { cwd: projectRoot, encoding: 'utf8' },
  )

  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout.trim(), 'range error')
})

test('grouped experience spans the earliest role through the current active month', () => {
  const result = spawnSync(
    'bun',
    [
      '-e',
      `
        import { getExperienceRange } from './lib/experience-duration.ts'

        const range = getExperienceRange(
          [
            { startDate: { year: 2025, month: 8 } },
            { startDate: { year: 2024, month: 12 }, endDate: { year: 2025, month: 8 } },
          ],
          { year: 2026, month: 7 },
        )

        console.log(JSON.stringify(range))
      `,
    ],
    { cwd: projectRoot, encoding: 'utf8' },
  )

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), {
    start: { year: 2024, month: 12 },
    end: { year: 2026, month: 7 },
  })
})

test('experience months are formatted from structured dates', () => {
  const result = spawnSync(
    'bun',
    [
      '-e',
      `
        import { formatExperienceMonth } from './lib/experience-duration.ts'
        console.log(formatExperienceMonth('en', { year: 2025, month: 10 }))
      `,
    ],
    { cwd: projectRoot, encoding: 'utf8' },
  )

  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout.trim(), 'Oct 2025')
})
