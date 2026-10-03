import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const source = ts.transpileModule(
  readFileSync(new URL('../components/home/portrait-journey.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
).outputText

function setup(finePointer = false) {
  const effects = [],
    frames = [],
    listeners = new Map(),
    exports = {}
  let time = 0,
    reads = 0,
    resize,
    disconnected = false
  const window = {
    scrollY: 0,
    innerHeight: 800,
    innerWidth: 390,
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
  const tick = (elapsed = 1000 / 60) => {
    time += elapsed
    const callbacks = frames.splice(0)
    callbacks.forEach((callback) => callback(time))
  }
  const flush = () => {
    let ticks = 0
    while (frames.length) {
      assert.ok(ticks++ < 200, 'Animation must settle and stop scheduling frames')
      tick()
    }
  }
  const scroll = (position, settle = true) => {
    window.scrollY = position
    listeners.get('scroll')()
    if (settle) flush()
  }
  return {
    window,
    art,
    traveler,
    section,
    sourceElement,
    resting,
    frames,
    listeners,
    tick,
    flush,
    scroll,
    cleanup,
    resize: () => resize(),
    get reads() {
      return reads
    },
    get disconnected() {
      return disconnected
    },
  }
}

test('portrait lands, retraces, caches geometry, and cleans up', () => {
  for (const finePointer of [true, false]) {
    const scene = setup(finePointer)
    const { traveler, art, section, sourceElement, resting, flush, scroll, cleanup } = scene
    flush()
    scroll(300)
    assert.equal(traveler.style.visibility, 'visible')
    assert.match(traveler.style.transform, /scale\(/)
    assert.equal(traveler.style.width, '320px')
    assert.equal(Boolean(art.style.filter), finePointer)
    const travelReads = scene.reads
    scroll(400)
    assert.equal(scene.reads, travelReads, 'Scrolling must not remeasure layout')
    scroll(900)
    assert.equal(section.dataset.portraitLanded, 'true')
    const landedReads = scene.reads
    scroll(1500)
    assert.equal(scene.reads, landedReads, 'No layout reads below About')
    scroll(400)
    assert.equal(traveler.style.visibility, 'visible', 'Scrolling back restores the journey')
    const beforeResize = scene.reads
    scene.resize()
    flush()
    assert.ok(scene.reads > beforeResize, 'Layout resize invalidates cached travel bounds')
    cleanup()
    assert.equal(scene.listeners.size, 0)
    assert.equal(scene.disconnected, true)
    assert.equal(sourceElement.style.visibility, '')
    assert.equal(resting.style.visibility, '')
  }
})

const scale = (scene) => Number(scene.traveler.style.transform.match(/scale\(([^,]+)/)[1])

test('touch scroll jumps ease across frames and settle after the last scroll event', () => {
  const scene = setup()
  scene.flush()
  scene.scroll(200)
  const before = scale(scene)
  scene.scroll(600, false)
  scene.tick()
  const first = scale(scene)
  assert.ok(first > before, 'The portrait starts following the swipe immediately')
  scene.tick()
  assert.ok(scale(scene) > first, 'The journey continues between scroll events')
  assert.equal(scene.reads, 3, 'Only the initial anchors need layout measurements')
  scene.flush()
  assert.ok(scale(scene) > first)
  scene.scroll(900, false)
  scene.tick()
  assert.equal(
    scene.section.dataset.portraitLanded,
    'false',
    'Handoff waits for the image to arrive',
  )
  scene.flush()
  assert.equal(scene.section.dataset.portraitLanded, 'true')
  assert.equal(scene.frames.length, 0)
  scene.cleanup()
})

test('touch smoothing has the same timing on 60 Hz and 120 Hz screens', () => {
  const sample = (hz) => {
    const scene = setup()
    scene.flush()
    scene.scroll(200)
    scene.scroll(600, false)
    scene.tick()
    for (let frame = 0; frame < hz / 10; frame++) scene.tick(1000 / hz)
    const result = scale(scene)
    scene.cleanup()
    return result
  }
  assert.ok(Math.abs(sample(60) - sample(120)) < 0.001)
})

test('touch browser toolbar height changes do not shift the animation range', () => {
  const scene = setup()
  scene.flush()
  scene.scroll(400)
  const before = scene.traveler.style.transform
  scene.window.innerHeight = 700
  scene.listeners.get('resize')()
  scene.flush()
  assert.equal(scene.traveler.style.transform, before)
  scene.window.innerWidth = 844
  scene.listeners.get('resize')()
  scene.flush()
  assert.notEqual(scene.traveler.style.transform, before, 'Orientation changes remeasure the range')
  scene.cleanup()
})

test('touch motion follows a reversed swipe and skips journeys outside the viewport', () => {
  const scene = setup()
  scene.flush()
  scene.scroll(400)
  scene.scroll(600, false)
  scene.tick()
  const forward = scale(scene)
  scene.scroll(200, false)
  scene.tick()
  assert.ok(scale(scene) < forward, 'Reversal follows the latest input without overshooting')
  scene.flush()
  scene.scroll(2000, false)
  scene.tick()
  assert.equal(scene.section.dataset.portraitLanded, 'true')
  assert.equal(scene.traveler.style.visibility, 'hidden')
  assert.equal(scene.frames.length, 0, 'Offscreen navigation does not leave a catch-up loop')
  scene.scroll(0)
  assert.equal(scene.sourceElement.style.visibility, '')
  assert.equal(scene.resting.style.visibility, 'hidden')
  scene.cleanup()
})
