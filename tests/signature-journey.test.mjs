import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('../components/signature-journey.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
)

test('journey mounts only on desktop with motion allowed and cleans up media changes', () => {
  for (const [width, reduced] of [
    [767, false],
    [1200, true],
    [1200, false],
  ]) {
    let enabled = false,
      effect,
      queries = 0,
      scrollSubscriptions = 0
    const listeners = new Set(),
      exports = {},
      target = { current: {} }
    const media = {
      matches: width >= 768 && !reduced,
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
          assert.equal(query, '(min-width: 768px) and (prefers-reduced-motion: no-preference)')
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
