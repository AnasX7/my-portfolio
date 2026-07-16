import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('about list animations clip their horizontal reveal overflow locally', async () => {
  const [workExperience, education, aboutMotion] = await Promise.all([
    read('components/home/work-experience.tsx'),
    read('components/home/education.tsx'),
    read('components/home/about-motion.ts'),
  ])

  assert.match(workExperience, /variants=\{motion\.list\} className='[^']*overflow-x-clip[^']*'/)
  assert.match(education, /variants=\{motion\.list\} className='[^']*overflow-x-clip[^']*'/)
  assert.match(aboutMotion, /x: reduceMotion \? 0 : 18 \* direction/)
})
