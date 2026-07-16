import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('work history stores structured dates instead of rendered duration strings', async () => {
  const source = await read('data/resume.ts')
  const workHistory = source.slice(source.indexOf('workExperience:'), source.indexOf('education:'))

  assert.equal((workHistory.match(/startDate:/g) ?? []).length, 4)
  assert.equal((workHistory.match(/endDate:/g) ?? []).length, 2)
  assert.doesNotMatch(workHistory, /dateKey:/)
  assert.doesNotMatch(workHistory, /totalDurationKey:/)
})

test('work history calculates localized ranges and durations from the current month', async () => {
  const [component, hook] = await Promise.all([
    read('components/home/work-experience.tsx'),
    read('hooks/use-current-month.ts').catch(() => ''),
  ])

  assert.match(component, /useCurrentMonth/)
  assert.match(component, /calculateExperienceDuration/)
  assert.match(component, /formatExperienceMonth/)
  assert.match(component, /getExperienceRange/)
  assert.match(component, /work\.duration\.present/)
  assert.match(component, /work\.duration\.year/)
  assert.match(component, /work\.duration\.month/)
  assert.match(hook, /setInterval/)
})

test('duration units are localized in English and Arabic', async () => {
  const [english, arabic] = await Promise.all([
    read('messages/en.json').then(JSON.parse),
    read('messages/ar.json').then(JSON.parse),
  ])

  for (const messages of [english, arabic]) {
    assert.equal(typeof messages.work.duration?.present, 'string')
    assert.match(messages.work.duration?.year ?? '', /\{count, plural,/)
    assert.match(messages.work.duration?.month ?? '', /\{count, plural,/)
    assert.equal(typeof messages.work.duration?.join, 'string')
  }
})
