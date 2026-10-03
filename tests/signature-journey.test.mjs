import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { easeInOut, transform } from 'motion/react'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('../components/signature-journey.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
)

test('journey mounts only on desktop with motion allowed and cleans up media changes', () => {
  for (const [width, reduced] of [
    [767, false],
    [768, false],
    [1024, false],
    [1180, false],
    [1279, false],
    [1280, true],
    [1280, false],
  ]) {
    let enabled = false,
      effect,
      queries = 0,
      scrollSubscriptions = 0
    const listeners = new Set(),
      exports = {},
      target = { current: {} }
    const media = {
      matches: width >= 1280 && !reduced,
      addEventListener: (event, callback) => {
        assert.equal(event, 'change')
        listeners.add(callback)
      },
      removeEventListener: (event, callback) => {
        assert.equal(event, 'change')
        assert.ok(listeners.delete(callback), 'Cleanup removes the registered listener')
      },
    }
    const modules = {
      react: {
        useState: () => [
          enabled,
          (value) => {
            enabled = value
          },
        ],
        useEffect: (callback) => {
          effect = callback
        },
      },
      'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
      'react-dom': { createPortal: (node) => node },
      'motion/react': {
        useScroll: (options) => {
          assert.equal(options.target, target)
          scrollSubscriptions++
          return { scrollYProgress: {} }
        },
      },
      './signature-journey.module.css': { default: {} },
    }
    new Function('require', 'exports', 'window', 'document', outputText)(
      (name) => {
        assert.ok(name in modules, `Unexpected dependency: ${name}`)
        return modules[name]
      },
      exports,
      {
        matchMedia: (query) => {
          queries++
          assert.equal(query, '(min-width: 1280px) and (prefers-reduced-motion: no-preference)')
          return media
        },
      },
      { body: {} },
    )
    const render = () => exports.default({ target })
    const check = () => {
      const node = render()
      if (media.matches) {
        assert.equal(node.props.target, target)
        assert.equal(node.type(node.props).props.children.length, 4)
      } else {
        assert.equal(node, null, 'Disabled media conditions never mount the scroll child')
      }
    }
    assert.equal(render(), null, 'Server and initial render have no journey')
    assert.equal(queries, 0, 'Media is only read after hydration')
    assert.equal(scrollSubscriptions, 0)
    const cleanup = effect()
    assert.equal(listeners.size, 1)
    check()
    for (const matches of [true, false, true, false]) {
      media.matches = matches
      listeners.forEach((callback) => callback())
      check()
    }
    cleanup()
    assert.equal(listeners.size, 0)
    const replayCleanup = effect()
    assert.equal(listeners.size, 1, 'StrictMode replay registers exactly one listener')
    replayCleanup()
    assert.equal(listeners.size, 0)
  }
})

test('letters hold high, sweep down before exiting, and retrace mirrored paths', () => {
  let progress = 0
  const exports = {}
  const modules = {
    react: { useState: () => [true, () => {}], useEffect: () => {} },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    'react-dom': { createPortal: (node) => node },
    'motion/react': {
      easeInOut,
      m: { div: 'div' },
      useScroll: () => ({ scrollYProgress: { get: () => progress } }),
      useTransform: (input, range, output, options) => ({
        get: () =>
          typeof input === 'function'
            ? input()
            : typeof range === 'function'
              ? range(input.get())
              : transform(range, output, options)(input.get()),
      }),
    },
    './signature-journey.module.css': { default: {} },
  }
  new Function('require', 'exports', 'document', outputText)((name) => modules[name], exports, {
    body: {},
  })
  const journey = exports.default({ target: { current: {} } })
  const letters = journey.type(journey.props).props.children
  const sample = (index, phase) => {
    progress = (index + phase) / 4
    const style = letters[index].type(letters[index].props).props.children.props.style
    return Object.fromEntries(
      ['x', 'y', 'rotate', 'opacity'].map((key) => [key, Number.parseFloat(style[key].get())]),
    )
  }
  for (const index of [0, 1]) {
    const upper = sample(index, 0.35)
    assert.equal(upper.x, 0)
    assert.equal(upper.y, 0)
    assert.ok(
      sample(index, 0.49).y - sample(index, 0.48).y < sample(index, 0.51).y - sample(index, 0.5).y,
      'The exit must accelerate gently out of the upper hold',
    )
    let previousY = -1
    for (const phase of [0.48, 0.6, 0.72, 0.84, 0.94]) {
      const { y } = sample(index, phase)
      assert.ok(y > previousY, 'Exit must descend continuously')
      previousY = y
    }
    const lower = sample(index, 0.7)
    assert.ok((index ? 34 : 30) + lower.y > 50, 'The letter reaches the lower viewport half')
    assert.ok(lower.opacity > 0.5 && Math.abs(lower.x) < 55, 'It remains visible during descent')
    const outside = sample(index, 0.98)
    assert.ok(Math.abs(Math.abs(outside.x) - 110) < 1e-8)
    assert.equal(outside.y, 40)
    assert.equal(outside.opacity, 0)
  }
  const phases = [0.1, 0.35, 0.55, 0.7, 0.85, 0.98]
  const forward = phases.map((phase) => sample(0, phase))
  for (const phase of phases) {
    const left = sample(0, phase),
      right = sample(1, phase)
    assert.ok(Math.abs(left.x + right.x) < 1e-8)
    assert.ok(Math.abs(left.rotate + right.rotate) < 1e-8)
    assert.ok(Math.abs(left.y - right.y) < 1e-8)
  }
  assert.deepEqual(
    phases.toReversed().map((phase) => sample(0, phase)),
    forward.toReversed(),
  )
})
