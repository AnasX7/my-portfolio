import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('profile avatars provide square light and dark theme assets', async () => {
  const [dataSource, lightMetadata, darkMetadata] = await Promise.all([
    read('data/resume.ts'),
    sharp(fileURLToPath(new URL('public/avatar-light.jpg', repoRoot))).metadata(),
    sharp(fileURLToPath(new URL('public/avatar-dark.jpg', repoRoot))).metadata(),
  ])

  assert.match(dataSource, /avatarLight: '\/avatar-light\.jpg'/)
  assert.match(dataSource, /avatarDark: '\/avatar-dark\.jpg'/)

  for (const metadata of [lightMetadata, darkMetadata]) {
    assert.equal(metadata.width, 848)
    assert.equal(metadata.height, 848)
  }
})

test('the header and hero switch profile portraits with the active theme', async () => {
  const [headerSource, heroSource] = await Promise.all([
    read('components/header.tsx'),
    read('components/home/sections/hero.tsx'),
  ])

  for (const source of [headerSource, heroSource]) {
    assert.match(source, /src=\{DATA\.profile\.avatarLight\}/)
    assert.match(source, /src=\{DATA\.profile\.avatarDark\}/)
    assert.match(source, /dark:invisible/)
    assert.match(source, /invisible[^']*dark:visible/)
  }
})

test('the glare overlay stays above the positioned theme images', async () => {
  const glareCss = await read('components/ui/glare-hover.css')
  const glareOverlay = glareCss.match(/\.glare-hover::before\s*\{([\s\S]*?)\n\}/)?.[1]

  assert.ok(glareOverlay)
  assert.match(glareOverlay, /z-index:\s*1/)
  assert.match(glareOverlay, /pointer-events:\s*none/)
})
