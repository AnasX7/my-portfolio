import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

test('the dark-mode action uses Moon02Icon', async () => {
  const source = await readFile(
    new URL('components/ui/animated-theme-toggler.tsx', repoRoot),
    'utf8',
  )

  assert.match(source, /import \{ Sun01Icon, Moon02Icon \}/)
  assert.match(source, /icon=\{Moon02Icon\}/)
  assert.doesNotMatch(source, /Moon01Icon/)
})
