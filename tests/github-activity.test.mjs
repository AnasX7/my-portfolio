import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { z } from 'zod'

const source = ts.transpileModule(
  readFileSync(new URL('../lib/github-activity.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText

function load(fetch) {
  const exports = {}
  const warnings = []
  runInNewContext(source, {
    exports,
    URL,
    AbortSignal,
    fetch,
    console: { warn: (...args) => warnings.push(args) },
    require: (name) =>
      ({
        'server-only': {},
        zod: { z },
        '@/data/resume': {
          DATA: { socials: [{ name: 'GitHub', url: 'https://github.com/AnasX7' }] },
        },
      })[name],
  })
  return { ...exports, warnings }
}

function days(start, counts) {
  return counts.map((count, index) => ({
    date: new Date(Date.parse(start) + index * 86_400_000).toISOString().slice(0, 10),
    count,
    level: Math.min(count, 4),
  }))
}

test('calendar aligns weekdays across a year boundary and totals use displayed days', () => {
  const { parseGitHubActivity } = load()
  const contributions = days('2025-12-31', [0, 2, 0, 1, 4, 0, 3, 0, 2])
  const activity = parseGitHubActivity({ contributions: contributions.toReversed() })
  assert.equal(activity.total, 12)
  assert.equal(activity.weeks.length, 2)
  assert.equal(activity.weeks[0][2], null)
  assert.equal(activity.weeks[0][3].date, '2025-12-31')
  assert.equal(activity.weeks[1][0].date, '2026-01-04')
  assert.equal(activity.weeks[1][4].date, '2026-01-08')
  assert.equal(activity.weeks[1][5], null)
})

test('zero activity is valid and leap day stays in the correct calendar cell', () => {
  const { parseGitHubActivity } = load()
  const activity = parseGitHubActivity({ contributions: days('2024-02-28', [0, 0, 0]) })
  assert.equal(activity.total, 0)
  assert.equal(activity.weeks[0][4].date, '2024-02-29')
  assert.equal(activity.weeks[0][5].date, '2024-03-01')
})

test('invalid, missing, and duplicate dates or invalid counts cannot produce a misleading chart', () => {
  const { parseGitHubActivity } = load()
  const day = days('2026-01-01', [1])[0]
  for (const contributions of [
    [],
    [{ ...day, date: '2026-02-30' }],
    [{ ...day, count: -1 }],
    [{ ...day, count: 1.5 }],
    [{ ...day, level: 5 }],
    [day, day],
    [day, { ...day, date: '2026-01-03' }],
  ]) {
    assert.throws(() => parseGitHubActivity({ contributions }))
  }
})

test('server request uses the configured profile, hourly caching, and a timeout', async () => {
  const { getGitHubActivity } = load(async (url, options) => {
    assert.equal(url, 'https://github-contributions-api.jogruber.de/v4/AnasX7?y=last')
    assert.equal(options.next.revalidate, 3600)
    assert.ok(options.signal instanceof AbortSignal)
    return { ok: true, json: async () => ({ contributions: days('2026-01-01', [3]) }) }
  })
  assert.equal((await getGitHubActivity()).total, 3)
})

test('HTTP, network, and malformed-response failures return an unavailable state rather than zero stats', async () => {
  for (const fetch of [
    async () => ({ ok: false, status: 503 }),
    async () => {
      throw new Error('Network unavailable')
    },
    async () => {
      throw new DOMException('Timed out', 'TimeoutError')
    },
    async () => ({ ok: true, json: async () => ({ contributions: [] }) }),
    async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('Invalid JSON')
      },
    }),
  ]) {
    const { getGitHubActivity, warnings } = load(fetch)
    assert.equal(await getGitHubActivity(), null)
    assert.equal(warnings.length, 1)
  }
})
