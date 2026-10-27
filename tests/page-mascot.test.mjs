import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const source = ts.transpileModule(
  readFileSync(new URL('../components/home/page-mascot.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
).outputText

function mount({ reduced = false, finePointer = true, inView = true, pageVisible = true } = {}) {
  const states = [],
    refs = [],
    effects = [],
    listeners = new Map(),
    timers = new Map()
  let stateIndex,
    refIndex,
    timerId = 0,
    animations = 0
  let box = { left: 200, top: 200, width: 128, height: 128 }
  const modules = {
    react: {
      useState(initial) {
        const index = stateIndex++
        if (!(index in states)) states[index] = initial
        return [
          states[index],
          (value) => {
            states[index] = value
          },
        ]
      },
      useRef(initial) {
        return refs[refIndex++] ?? (refs[refIndex - 1] = { current: initial })
      },
      useEffect(effect) {
        effects.push(effect)
      },
    },
    'react/jsx-runtime': {
      jsx: (type, props) => ({ type, props }),
      jsxs: (type, props) => ({ type, props }),
    },
    'motion/react': { useInView: () => inView },
    'next-intl': { useTranslations: () => (key) => key },
    '@/hooks/use-hydrated-reduced-motion': { useHydratedReducedMotion: () => reduced },
    '@/hooks/use-page-visible': { usePageVisible: () => pageVisible },
    './page-mascot.module.css': { default: {} },
  }
  const exports = {}
  const window = {
    matchMedia: () => ({ matches: finePointer }),
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => {
      assert.equal(listeners.get(name), fn)
      listeners.delete(name)
    },
    setTimeout: (fn, delay) => {
      timers.set(++timerId, { fn, delay })
      return timerId
    },
    clearTimeout: (id) => timers.delete(id),
  }
  new Function('require', 'exports', 'window', source)((name) => modules[name], exports, window)
  const render = () => {
    stateIndex = 0
    refIndex = 0
    return exports.default()
  }
  const initial = render()
  initial.props.ref.current = {
    getBoundingClientRect: () => box,
    animate: () => {
      animations++
    },
  }
  const cleanups = effects
    .slice()
    .map((effect) => effect())
    .filter(Boolean)
  return {
    render,
    listeners,
    timers,
    point: (x, y, pointerType = 'mouse') =>
      listeners.get('pointermove')?.({ clientX: x, clientY: y, pointerType }),
    position: () => render().props.children[0].props.style.backgroundPosition,
    moveBox: (next) => {
      box = next
      listeners.get('scroll')?.()
    },
    click: () => render().props.onClick(),
    advance: (delay) => {
      for (const [id, timer] of timers)
        if (timer.delay === delay) {
          timers.delete(id)
          timer.fn()
        }
    },
    animations: () => animations,
    cleanup: () => cleanups.forEach((cleanup) => cleanup()),
  }
}

test('mascot follows mouse direction, settles nearby, and avoids flickering at sector boundaries', () => {
  const mascot = mount()
  for (const [dx, dy, expected] of [
    [200, 0, '100% 50%'],
    [200, 200, '100% 100%'],
    [0, 200, '50% 100%'],
    [-200, 200, '0% 100%'],
    [-200, 0, '0% 50%'],
    [-200, -200, '0% 0%'],
    [0, -200, '50% 0%'],
    [200, -200, '100% 0%'],
    [0, 0, '50% 50%'],
  ]) {
    mascot.point(264 + dx, 264 + dy)
    assert.equal(mascot.position(), expected)
  }
  mascot.point(464, 264)
  mascot.point(264 + 200 * Math.cos(0.4), 264 + 200 * Math.sin(0.4))
  assert.equal(mascot.position(), '100% 50%')
  mascot.point(264 + 200 * Math.cos(0.6), 264 + 200 * Math.sin(0.6))
  assert.equal(mascot.position(), '100% 100%')
  mascot.point(464, 264)
  mascot.point(64, 264, 'touch')
  assert.equal(mascot.position(), '100% 50%', 'Touch events do not move the head')
  mascot.moveBox({ left: 600, top: 200, width: 128, height: 128 })
  assert.equal(mascot.position(), '0% 50%', 'Scrolling re-aims towards the stationary cursor')
  mascot.cleanup()
  assert.equal(mascot.listeners.size, 0)
})

test('repeated activation replaces timers, reacts, returns to tracking, and cleans up on unmount', () => {
  const mascot = mount()
  assert.equal(mascot.render().props.type, 'button')
  assert.equal(mascot.render().props['aria-label'], 'react')
  mascot.click()
  assert.equal(mascot.render().props.children[1].props.style.opacity, 1)
  mascot.click()
  assert.equal(mascot.timers.size, 2)
  mascot.advance(120)
  assert.equal(mascot.render().props.children[1].props.style.backgroundPosition, '100% 0%')
  mascot.advance(700)
  assert.equal(mascot.render().props.children[0].props.style.opacity, 1)
  mascot.click()
  mascot.cleanup()
  assert.equal(mascot.timers.size, 0)
})

test('the small header mascot tracks nearby movement and settles inside its own bounds', () => {
  const mascot = mount()
  mascot.moveBox({ left: 200, top: 200, width: 56, height: 56 })
  mascot.point(264, 228)
  assert.equal(mascot.position(), '100% 50%')
  mascot.point(234, 228)
  assert.equal(mascot.position(), '50% 50%')
  mascot.cleanup()
})

test('reduced motion, touch devices, offscreen and hidden pages skip pointer tracking', () => {
  for (const options of [
    { reduced: true },
    { finePointer: false },
    { inView: false },
    { pageVisible: false },
  ]) {
    const mascot = mount(options)
    assert.equal(mascot.listeners.size, 0)
    assert.equal(mascot.position(), '50% 50%')
    if (options.inView === false)
      assert.equal(mascot.render().props.children[0].props.style.backgroundImage, 'none')
    mascot.click()
    mascot.advance(120)
    assert.equal(mascot.render().props.children[1].props.style.opacity, 1)
    if (options.reduced) assert.equal(mascot.animations(), 0)
    mascot.cleanup()
  }
})
