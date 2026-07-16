import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const componentPath = new URL('./scroll-stack.tsx', import.meta.url)
const stylesheetPath = new URL('./scroll-stack.css', import.meta.url)
const projectsPath = new URL('../home/sections/projects.tsx', import.meta.url)

test('uses CSS sticky enhancement on mobile and desktop without Reduced Motion', async () => {
  const [source, css] = await Promise.all([
    readFile(componentPath, 'utf8'),
    readFile(stylesheetPath, 'utf8'),
  ])

  assert.match(css, /prefers-reduced-motion:\s*no-preference/)
  assert.match(css, /position:\s*sticky/)
  assert.match(source, /--mobile-stack-offset/)
  assert.match(source, /stackIndex \* 0\.375/)
  assert.match(css, /var\(--mobile-stack-offset\)/)
  assert.match(css, /max-width:\s*767px/)
  assert.match(css, /min-height:\s*640px/)
  assert.match(css, /pointer:\s*fine/)
  assert.doesNotMatch(css, /var\(--stack-index\)\s*\*/)
})

test('keeps project cards compact enough for the mobile sticky viewport', async () => {
  const source = await readFile(projectsPath, 'utf8')

  assert.match(source, /gap-4[^'\n]*p-5[^'\n]*sm:gap-6[^'\n]*sm:p-6/)
  assert.match(source, /gap-4[^'\n]*sm:gap-6/)
  assert.match(source, /h-44[^'\n]*sm:h-80/)
})

test('does not run a JavaScript scroll loop', async () => {
  const source = await readFile(componentPath, 'utf8')

  assert.doesNotMatch(source, /Lenis|useLenis|requestAnimationFrame|addEventListener\(['"]scroll/)
})

test('gives the final card a following grid track before the stack releases', async () => {
  const [source, css] = await Promise.all([
    readFile(componentPath, 'utf8'),
    readFile(stylesheetPath, 'utf8'),
  ])

  assert.match(source, /className='scroll-stack-runway'/)
  assert.match(source, /aria-hidden='true'/)
  assert.match(css, /\.scroll-stack-runway\s*{[^}]*height:\s*24rem/s)
})

test('does not keep filter or 3D compositing layers alive', async () => {
  const [source, css] = await Promise.all([
    readFile(componentPath, 'utf8'),
    readFile(stylesheetPath, 'utf8'),
  ])
  const combined = `${source}\n${css}`

  assert.doesNotMatch(combined, /will-change|filter|perspective|translateZ|preserve-3d/)
})
