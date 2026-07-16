import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('scroll reveal progressively reveals tokens from Motion scroll progress', async () => {
  const source = await read('components/ui/scroll-reveal.tsx')

  assert.doesNotMatch(source, /gsap|ScrollTrigger/)
  assert.doesNotMatch(source, /\bfilter\s*:|blur\(/)
  assert.match(source, /motion\/react/)
  assert.match(source, /\buseScroll\b/)
  assert.match(source, /\buseTransform\b/)
  assert.match(source, /scrollYProgress/)
  assert.match(source, /scroll-reveal-token/)
})

test('animated buttons do not render per-button particle nodes', async () => {
  const [buttonSource, globalCss] = await Promise.all([
    read('components/ui/button.tsx'),
    read('app/globals.css'),
  ])

  assert.doesNotMatch(buttonSource, /className=['"]point['"]/)
  assert.doesNotMatch(globalCss, /\.point(?:\s|:|\{)/)
})

test('Motion uses a hydration-safe Reduced Motion preference', async () => {
  const [provider, hook] = await Promise.all([
    read('components/motion-provider.tsx'),
    read('hooks/use-hydrated-reduced-motion.ts'),
  ])

  assert.match(provider, /useHydratedReducedMotion/)
  assert.match(provider, /reducedMotion=\{shouldReduceMotion \? 'always' : 'never'\}/)
  assert.match(hook, /useState\(false\)/)
  assert.match(hook, /useEffect/)
})

test('components do not read the browser Reduced Motion preference during hydration', async () => {
  const componentsRoot = new URL('../', import.meta.url)
  const componentFiles = await Array.fromAsync(
    (await readdir(componentsRoot, { recursive: true, withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
      .map((entry) => new URL(`${entry.parentPath}/${entry.name}`, 'file:')),
  )
  const componentSources = await Promise.all(componentFiles.map((file) => readFile(file, 'utf8')))

  for (const source of componentSources) {
    assert.doesNotMatch(source, /\buseReducedMotion\b/)
  }
})

test('shine effects are finite instead of permanently animating off-screen', async () => {
  const [shinyText, globalCss] = await Promise.all([
    read('components/ui/shiny-text.tsx'),
    read('app/globals.css'),
  ])

  assert.doesNotMatch(shinyText, /shine[^\n]+infinite/)
  assert.doesNotMatch(globalCss, /\.animate-shine\s*\{[^}]*infinite/s)
})

test('hero and footer ambient loops are scoped to the viewport', async () => {
  const [hero, footer] = await Promise.all([
    read('components/home/sections/hero.tsx'),
    read('components/footer.tsx'),
  ])

  assert.match(hero, /whileInView=/)
  assert.doesNotMatch(hero, /<m\.div[\s\S]{0,500}?animate=\{\s*shouldReduceMotion/s)
  assert.doesNotMatch(footer, /<m\.div\s+animate=\{/)
})

test('Turnstile loads only when the contact form approaches the viewport', async () => {
  const source = await read('components/home/contact-form.tsx')

  assert.match(source, /useInView/)
  assert.match(source, /shouldLoadTurnstile\s*\?/)
})
