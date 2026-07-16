import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

function getComposedHomeModulePaths(pageSource) {
  const imports = new Map()

  for (const match of pageSource.matchAll(/import\s+(\w+)\s+from\s+'@\/([^']+)'/g)) {
    imports.set(match[1], match[2])
  }

  for (const match of pageSource.matchAll(
    /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\('@\/([^']+)'\)\)/g,
  )) {
    imports.set(match[1], match[2])
  }

  const mainStart = pageSource.indexOf('<main>')
  const mainEnd = pageSource.indexOf('</main>')
  const mainSource = pageSource.slice(mainStart, mainEnd)
  const componentNames = Array.from(mainSource.matchAll(/<([A-Z]\w*)\s*\/>/g), (match) => match[1])

  return componentNames.map((componentName) => {
    const modulePath = imports.get(componentName)
    assert.ok(modulePath, `${componentName} should resolve to an imported home module`)
    return `${modulePath}.tsx`
  })
}

test('the locale home page places every visible section in one main landmark', async () => {
  const source = await read('app/[locale]/page.tsx')
  const mainOpenings = source.match(/<main\b/g) ?? []
  const mainClosings = source.match(/<\/main>/g) ?? []

  assert.equal(mainOpenings.length, 1)
  assert.equal(mainClosings.length, 1)

  const scriptIndex = source.indexOf("<script type='application/ld+json'")
  const spotlightIndex = source.indexOf('<Spotlight />')
  const mainStart = source.indexOf('<main>')
  const mainEnd = source.indexOf('</main>')
  const mainSource = source.slice(mainStart, mainEnd)

  assert.ok(scriptIndex < spotlightIndex)
  assert.ok(spotlightIndex < mainStart)
  assert.ok(mainStart < mainEnd)

  const sections = [
    '<HeroSection />',
    '<LogoCloudSection />',
    '<WhoAmISection />',
    '<AboutSection />',
    '<ProjectSection />',
    '<ContactSection />',
  ]

  let previousSectionIndex = -1
  for (const section of sections) {
    const sectionIndex = mainSource.indexOf(section)
    assert.ok(sectionIndex > previousSectionIndex, `${section} should be inside main in page order`)
    previousSectionIndex = sectionIndex
  }
})

test('the global scroll provider leaves the main landmark to each route', async () => {
  const source = await read('components/scroll-progress-provider.tsx')

  assert.doesNotMatch(source, /<main\b/)
  assert.match(
    source,
    /<div className='z-0 flex min-h-dvh flex-col' ref=\{containerRef\}>[\s\S]*?\{children\}[\s\S]*?<\/div>/,
  )
})

test('the composed home modules expose one hero h1 with unchanged typography classes', async () => {
  const pageSource = await read('app/[locale]/page.tsx')
  const modulePaths = getComposedHomeModulePaths(pageSource)
  const sources = await Promise.all(modulePaths.map(read))
  const heroSource = sources[modulePaths.indexOf('components/home/sections/hero.tsx')]
  const h1Count = sources.reduce(
    (total, source) => total + (source.match(/<h1\b/g) ?? []).length,
    0,
  )

  assert.ok(heroSource)
  assert.equal(h1Count, 1)
  assert.match(
    heroSource,
    /<h1[\s\S]*?text-2xl font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl lg:text-5xl/,
  )
})

test('ScrollReveal renders its prose and both class hooks on one Motion paragraph', async () => {
  const source = await read('components/ui/scroll-reveal.tsx')

  assert.doesNotMatch(source, /<m\.h2\b/)
  assert.match(source, /<m\.p\b/)
  assert.match(
    source,
    /className=\{`scroll-reveal scroll-reveal-text \$\{containerClassName\} \$\{textClassName\}`\}/,
  )
  assert.doesNotMatch(source, /<m\.p\b[\s\S]*?<p\b/)
})

test('CardTitle exposes and renders a semantic h3 without changing its presentation', async () => {
  const source = await read('components/ui/card.tsx')
  const cardTitle = source.match(/function CardTitle[\s\S]*?(?=function CardDescription)/)?.[0]

  assert.ok(cardTitle)
  assert.match(cardTitle, /React\.ComponentProps<'h3'>/)
  assert.match(cardTitle, /<h3\b/)
  assert.match(cardTitle, /data-slot='card-title'/)
  assert.match(cardTitle, /cn\('leading-none font-semibold', className\)/)
  assert.doesNotMatch(cardTitle, /<div\b/)
})
