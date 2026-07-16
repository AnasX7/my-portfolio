import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function loadMessages(locale) {
  const contents = await readFile(new URL(`./${locale}.json`, import.meta.url), 'utf8')
  return JSON.parse(contents)
}

test('the current role describes full-stack work with remote teams', async () => {
  const english = await loadMessages('en')
  const arabic = await loadMessages('ar')

  assert.deepEqual(english.about.whoAmI.line3, {
    pre: 'Currently works as a',
    role: 'Full-Stack Software Engineer',
    post: 'with remote teams.',
  })

  assert.deepEqual(arabic.about.whoAmI.line3, {
    pre: 'يعمل حالياً كـ',
    role: 'مهندس برمجيات فول ستاك',
    post: 'مع فرق عمل عن بُعد.',
  })
})
