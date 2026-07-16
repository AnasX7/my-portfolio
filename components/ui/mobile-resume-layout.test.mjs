import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('work experience stacks dates and preserves complete titles on mobile', async () => {
  const source = await read('components/home/work-experience.tsx')

  assert.doesNotMatch(source, /\btruncate\b/)
  assert.ok((source.match(/sm:flex-row/g) ?? []).length >= 2)
  assert.match(source, /ms-16[^']*sm:ms-0/)
  assert.match(source, /tabular-nums/)
})

test('education stacks dates and safely wraps credential metadata on mobile', async () => {
  const source = await read('components/home/education.tsx')

  assert.ok((source.match(/sm:flex-row/g) ?? []).length >= 3)
  assert.match(source, /ms-16[^']*sm:ms-0/)
  assert.match(source, /\[overflow-wrap:anywhere\]/)
  assert.match(source, /tabular-nums/)
})
