import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const code = ts.transpileModule(
  readFileSync(new URL('../components/home/portrait-native-journey.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText

function setup({
  supported = true,
  rejectAnimation = false,
  entranceY = 0,
  direction = 'ltr',
} = {}) {
  const animations = [],
    listeners = new Map(),
    frames = new Map(),
    exports = {}
  let resizeLayout,
    fontsReady,
    reads = 0,
    disconnected = false,
    frameId = 0
  const window = {
    innerWidth: 390,
    innerHeight: 800,
    scrollY: 300,
    ...(supported ? { ScrollTimeline: class {} } : {}),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  }
  const element = (top, width) => ({
    style: { position: '', visibility: 'hidden', opacity: '' },
    dataset: {},
    getBoundingClientRect() {
      reads++
      return { top: top - window.scrollY, left: 20, width, height: width }
    },
    animate(keyframes, options) {
      if (rejectAnimation && animations.length === 2) throw Error('Unsupported range')
      const animation = {
        element: this,
        keyframes,
        options,
        cancelled: false,
        cancel() {
          this.cancelled = true
        },
      }
      animations.push(animation)
      return animation
    },
  })
  const source = element(200 + entranceY, 320),
    destination = element(1000, 420),
    section = element(800, 600)
  const resting = element(),
    traveler = element(),
    light = element(),
    art = element(),
    availability = element(),
    socials = element()
  source.parentElement = { entranceY }
  destination.querySelector = () => socials
  traveler.querySelector = (selector) =>
    ({
      '[data-paper-light]': light,
      '[data-portrait-art]': art,
      '[data-portrait-availability]': availability,
    })[selector]
  const paths = [0, 1].map((index) => {
    const attributes = new Map([['d', 'original'], ...(index ? [['stroke-width', '8']] : [])])
    return {
      getAttribute: (key) => attributes.get(key) ?? null,
      setAttribute: (key, value) => attributes.set(key, value),
      removeAttribute: (key) => attributes.delete(key),
    }
  })
  traveler.querySelectorAll = () => paths
  const scrollingElement = {}
  class ScrollTimeline {
    constructor(options) {
      Object.assign(this, options)
    }
  }
  runInNewContext(code, {
    exports,
    require: () => ({ portraitPath: (progress) => `path:${progress}` }),
    window,
    ScrollTimeline,
    CSS: { supports: () => supported },
    document: {
      scrollingElement,
      documentElement: { dir: direction },
      body: {},
      fonts: {
        ready: {
          then(callback) {
            fontsReady = callback
          },
        },
      },
    },
    getComputedStyle: (element) => ({
      scrollMarginTop: '0',
      transform: element.entranceY ? String(element.entranceY) : 'none',
    }),
    DOMMatrixReadOnly: class {
      constructor(value) {
        this.m42 = Number(value)
      }
    },
    requestAnimationFrame(callback) {
      frames.set(++frameId, callback)
      return frameId
    },
    cancelAnimationFrame(id) {
      frames.delete(id)
    },
    ResizeObserver: class {
      constructor(callback) {
        resizeLayout = callback
      }
      observe() {}
      disconnect() {
        disconnected = true
      }
    },
  })
  const cleanup = exports.startNativePortraitJourney({
    source,
    destination,
    resting,
    section,
    traveler,
  })
  return {
    cleanup,
    animations,
    listeners,
    frames,
    window,
    source,
    destination,
    section,
    traveler,
    resting,
    socials,
    art,
    light,
    paths,
    scrollingElement,
    resizeLayout: () => resizeLayout(),
    fontsReady: () => fontsReady(),
    flush() {
      const callbacks = [...frames.values()]
      frames.clear()
      callbacks.forEach((cb) => cb())
    },
    get reads() {
      return reads
    },
    get disconnected() {
      return disconnected
    },
  }
}

test('native journey uses one ranged scroll timeline for movement and both handoffs', () => {
  const scene = setup()
  assert.equal(typeof scene.cleanup, 'function')
  assert.equal(scene.traveler.style.position, 'absolute')
  assert.equal(scene.traveler.dataset.nativeScroll, 'true')
  assert.equal(scene.listeners.has('scroll'), true, 'Only SVG shape updates need scroll events')
  assert.equal(scene.reads, 3)
  const movement = scene.animations.find((animation) => animation.keyframes[0].transform)
  assert.equal(movement.keyframes[0].transform, 'translate3d(20px, 200px, 0) scale(1, 1)')
  assert.equal(
    movement.keyframes.at(-1).transform,
    'translate3d(20px, 1000px, 0) scale(1.3125, 1.3125)',
  )
  for (const animation of scene.animations) {
    assert.equal(animation.options.timeline, movement.options.timeline)
    assert.equal(animation.options.timeline.source, scene.scrollingElement)
    assert.equal(animation.options.rangeStart, '72px')
    assert.equal(animation.options.rangeEnd, '688px')
  }
  const opacity = (element) =>
    scene.animations.find(
      (animation) => animation.element === element && 'opacity' in animation.keyframes[0],
    )
  assert.equal(opacity(scene.source).keyframes[0].opacity, 1)
  assert.equal(opacity(scene.source).keyframes.at(-1).opacity, 0)
  assert.equal(opacity(scene.resting).keyframes[0].opacity, 0)
  assert.equal(opacity(scene.resting).keyframes.at(-1).opacity, 1)
  assert.equal(opacity(scene.traveler).keyframes[0].opacity, 0)
  assert.equal(opacity(scene.traveler).keyframes.at(-1).opacity, 0)
  scene.cleanup()
  assert.ok(scene.animations.every((animation) => animation.cancelled))
  assert.equal(scene.traveler.style.position, '')
  assert.equal(scene.traveler.style.visibility, 'hidden')
  assert.equal(scene.traveler.style.opacity, '')
  assert.equal(scene.listeners.size, 0)
  assert.ok(scene.disconnected)
})

test('native range survives toolbar resizing and refreshes on layout/orientation changes', () => {
  const scene = setup()
  scene.window.innerHeight = 700
  scene.listeners.get('resize')()
  assert.equal(scene.frames.size, 0)
  const first = [...scene.animations]
  scene.window.innerWidth = 844
  scene.listeners.get('resize')()
  scene.flush()
  assert.ok(first.every((animation) => animation.cancelled))
  assert.equal(scene.animations.at(-1).options.rangeStart, '88px')
  scene.resizeLayout()
  scene.fontsReady()
  assert.equal(scene.frames.size, 1, 'Layout invalidations coalesce')
  scene.cleanup()
  assert.equal(scene.frames.size, 0, 'Cleanup cancels a pending measurement')
  scene.fontsReady()
  assert.equal(scene.frames.size, 0, 'Late font callbacks cannot restart a disposed journey')
})

test('unsupported or rejected native APIs leave the accepted fallback available', () => {
  for (const options of [{ supported: false }, { rejectAnimation: true }]) {
    const scene = setup(options)
    assert.equal(scene.cleanup, null)
    assert.equal(scene.traveler.style.position, '')
    assert.equal(scene.traveler.style.visibility, 'hidden')
    assert.equal(scene.traveler.style.opacity, '')
    assert.equal(scene.listeners.size, 0)
    assert.ok(scene.animations.every((animation) => animation.cancelled))
  }
})

test('native path measures the final hero anchor during its entrance animation', () => {
  const scene = setup({ entranceY: 30 })
  const movement = scene.animations.find((animation) => animation.keyframes[0].transform)
  assert.equal(movement.keyframes[0].transform, 'translate3d(20px, 200px, 0) scale(1, 1)')
  assert.equal(movement.options.rangeStart, '72px')
  scene.cleanup()
})

test('native tilt and lighting retain the original curves and mirror in Arabic', () => {
  for (const direction of ['ltr', 'rtl']) {
    const scene = setup({ direction })
    const tilt = scene.animations.find((animation) => animation.element === scene.art)
    const lighting = scene.animations.find((animation) => animation.element === scene.light)
    const sign = direction === 'rtl' ? -1 : 1
    for (const index of [0, 30, 60, 90, 120]) {
      const progress = index / 120
      const wave = Math.sin(progress * Math.PI)
      assert.equal(
        tilt.keyframes[index].transform,
        `perspective(1000px) rotateY(${sign * wave * 18}deg) rotateX(${Math.sin(progress * Math.PI * 2) * 9}deg) rotateZ(${sign * wave * -5}deg)`,
      )
      assert.equal(lighting.keyframes[index].opacity, wave * 0.65)
    }
    scene.cleanup()
  }
})

test('original corner and border morph follow scroll immediately without remeasuring movement', () => {
  const scene = setup()
  const reads = scene.reads
  const scroll = (position) => {
    scene.window.scrollY = position
    scene.listeners.get('scroll')()
    scene.flush()
  }
  scroll(380)
  assert.equal(scene.paths[0].getAttribute('d'), 'path:0.5')
  assert.equal(scene.paths[1].getAttribute('stroke-width'), '4.5')
  scroll(688)
  assert.equal(scene.paths[0].getAttribute('d'), 'path:1')
  assert.equal(scene.paths[1].getAttribute('stroke-width'), '1')
  scroll(1200)
  scroll(0)
  assert.equal(scene.paths[0].getAttribute('d'), 'path:0')
  assert.equal(scene.paths[1].getAttribute('stroke-width'), '8')
  assert.equal(scene.reads, reads, 'Shape updates never measure layout')
  assert.equal(scene.frames.size, 0, 'No catch-up loop after scrolling stops')
  scene.cleanup()
  assert.equal(scene.paths[0].getAttribute('d'), 'original')
})

test('social links use the original landing reveal and hide immediately on reverse scrolling', () => {
  const scene = setup()
  assert.equal(scene.section.dataset.portraitLanded, 'false')
  assert.equal(
    scene.animations.some((animation) => animation.element === scene.socials),
    false,
    'The native timeline must not override the social links CSS transition',
  )
  scene.window.scrollY = 688
  scene.listeners.get('scroll')()
  scene.flush()
  assert.equal(scene.section.dataset.portraitLanded, 'true')
  scene.window.scrollY = 687
  scene.listeners.get('scroll')()
  scene.flush()
  assert.equal(scene.section.dataset.portraitLanded, 'false')
  scene.cleanup()
  assert.equal(scene.section.dataset.portraitLanded, undefined)
})
