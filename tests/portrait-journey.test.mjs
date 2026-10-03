import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const source = ts.transpileModule(
  readFileSync(new URL('../components/home/portrait-journey.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
).outputText

test('portrait stops geometry work after landing, retraces on reverse scroll, and remeasures on resize', () => {
  for (const finePointer of [true, false]) {
    const effects = [],
      frames = [],
      listeners = new Map(),
      exports = {}
    let reads = 0,
      resize,
      disconnected = false
    const window = {
      scrollY: 0,
      innerHeight: 800,
      matchMedia: () => ({ matches: finePointer }),
      addEventListener: (event, callback) => listeners.set(event, callback),
      removeEventListener: (event, callback) => {
        assert.equal(listeners.get(event), callback)
        listeners.delete(event)
      },
    }
    const rect = (top, size) => {
      reads++
      return { top: top - window.scrollY, left: 20, width: size, height: size }
    }
    const art = { style: {} },
      resting = { style: {} },
      traveler = {
        style: {},
        querySelectorAll: () => [],
        querySelector: (selector) => (selector === '[data-portrait-art]' ? art : null),
      }
    const section = { dataset: {}, getBoundingClientRect: () => rect(800, 600) }
    const sourceElement = { style: {}, getBoundingClientRect: () => rect(200, 320) }
    const destination = {
      querySelector: () => resting,
      closest: () => section,
      getBoundingClientRect: () => rect(1000, 420),
    }
    const modules = {
      react: {
        useState: () => [true, () => {}],
        useId: () => 'test',
        useRef: () => ({ current: null }),
        useEffect: (effect) => effects.push(effect),
      },
      'react/jsx-runtime': {
        jsx: (type, props) => {
          if (props.ref) props.ref.current = type === 'div' ? traveler : { setAttribute() {} }
          return { type, props }
        },
        jsxs: (type, props) => {
          if (props.ref) props.ref.current = traveler
          return { type, props }
        },
      },
      'react-dom': { createPortal: (node) => node },
      '@/components/home/portrait': { Portrait() {}, portraitPath: () => '' },
      '@/hooks/use-hydrated-reduced-motion': { useHydratedReducedMotion: () => false },
    }
    runInNewContext(source, {
      exports,
      require: (name) => modules[name],
      window,
      document: {
        body: {},
        documentElement: { dir: 'ltr' },
        fonts: { ready: { then() {} } },
        querySelector: (selector) =>
          selector === '[data-portrait-source]' ? sourceElement : destination,
      },
      getComputedStyle: () => ({ scrollMarginTop: '0' }),
      requestAnimationFrame: (callback) => {
        frames.push(callback)
        return frames.length
      },
      cancelAnimationFrame() {},
      ResizeObserver: class {
        constructor(callback) {
          resize = callback
        }
        observe() {}
        disconnect() {
          disconnected = true
        }
      },
    })
    exports.PortraitJourney()
    const cleanup = effects[1]()
    const flush = () => {
      while (frames.length) frames.shift()()
    }
    const scroll = (position) => {
      window.scrollY = position
      listeners.get('scroll')()
      flush()
    }
    flush()
    scroll(300)
    assert.equal(traveler.style.visibility, 'visible')
    assert.match(traveler.style.transform, /scale\(/)
    assert.equal(traveler.style.width, '320px')
    assert.equal(Boolean(art.style.filter), finePointer)
    scroll(900)
    assert.equal(section.dataset.portraitLanded, 'true')
    const landedReads = reads
    scroll(1500)
    assert.equal(reads, landedReads, 'No layout reads for the invisible portrait below About')
    scroll(400)
    assert.equal(traveler.style.visibility, 'visible', 'Scrolling back restores the journey')
    assert.ok(reads > landedReads)
    const beforeResize = reads
    resize()
    flush()
    assert.ok(reads > beforeResize, 'Resize invalidates cached travel bounds')
    cleanup()
    assert.equal(listeners.size, 0)
    assert.equal(disconnected, true)
    assert.equal(sourceElement.style.visibility, '')
    assert.equal(resting.style.visibility, '')
  }
})
