import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('LinkPreview exposes an accessible-name prop on its rendered trigger link', async () => {
  const source = await read('components/ui/link-preview.tsx')

  assert.match(source, /'aria-label'\?: string/)
  assert.match(source, /'aria-label': ariaLabel/)
  assert.match(source, /render=\{<Link href=\{url\} target='_blank' aria-label=\{ariaLabel\} \/>\}/)
})

test('MagneticLinkPreview forwards its accessible name through LinkPreview', async () => {
  const source = await read('components/ui/magnetic-link-preview.tsx')

  assert.match(source, /'aria-label'\?: string/)
  assert.match(source, /'aria-label': ariaLabel/)
  assert.match(
    source,
    /<LinkPreview\s+url=\{url\}\s+aria-label=\{ariaLabel\}\s+className=\{cn\(buttonVariants/,
  )
})

test('hero social links use their social names and hide their decorative icons', async () => {
  const source = await read('components/home/sections/hero.tsx')
  const socialControls = source.match(
    /\{DATA\.socials\.slice\(0, 3\)[\s\S]*?<\/div>\n\s*<\/m\.div>/,
  )?.[0]

  assert.ok(socialControls)
  assert.match(socialControls, /<MagneticLinkPreview[\s\S]*?aria-label=\{social\.name\}/)
  assert.match(socialControls, /<IconComponent[^>]*aria-hidden='true'/)
})

test('footer scroll-to-top control is a named non-submit button', async () => {
  const source = await read('components/footer.tsx')
  const scrollToTopButton = source.match(/<button[\s\S]*?scrollTo\(0,[\s\S]*?<\/button>/)?.[0]

  assert.ok(scrollToTopButton)
  assert.match(scrollToTopButton, /type='button'/)
  assert.match(scrollToTopButton, /aria-label=\{t\('header\.home'\)\}/)
})
