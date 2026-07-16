import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

test('the Skills section does not render the terminal panel', async () => {
  const source = await readFile(new URL('components/home/sections/about.tsx', repoRoot), 'utf8')

  assert.doesNotMatch(source, /@\/components\/ui\/terminal/)
  assert.doesNotMatch(source, /<Terminal\b/)
  assert.doesNotMatch(source, /terminalSkills/)
  assert.doesNotMatch(source, /lg:grid-cols-2/)
})

test('the Skills section follows Education in document order', async () => {
  const source = await readFile(new URL('components/home/sections/about.tsx', repoRoot), 'utf8')
  const educationIndex = source.indexOf('<Education />')
  const skillsIndex = source.indexOf('{t(DATA.about.card4.titleKey)}')

  assert.ok(educationIndex >= 0, 'Education should be rendered')
  assert.ok(skillsIndex > educationIndex, 'Skills should render after Education')
})
