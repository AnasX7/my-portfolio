import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('../components/signature-entrance.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
)

function mount({ seen = false, reduced = false, denied, dark = true } = {}) {
  let state = null,
    effect,
    now = 0,
    updates = 0
  const ready = [],
    exports = {},
    storage = new Map(seen ? [['signature-seen', '1']] : [])
  const modules = {
    react: {
      useState: () => [
        state,
        (value) => {
          state = value
          updates++
        },
      ],
      useEffect: (callback) => {
        effect = callback
      },
      useRef: () => ({ current: { setAttribute: (...args) => ready.push(args) } }),
    },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
    'react-dom': { createPortal: (node) => node },
    'next/image': { default: 'img' },
    './signature-entrance.module.css': { default: {} },
  }
  new Function(
    'require',
    'exports',
    'window',
    'sessionStorage',
    'document',
    'performance',
    outputText,
  )(
    (name) => {
      assert.ok(name in modules, `Unexpected dependency: ${name}`)
      return modules[name]
    },
    exports,
    { matchMedia: () => ({ matches: reduced }) },
    {
      getItem: (key) => {
        if (denied === 'read') throw Error('Denied')
        return storage.get(key)
      },
      setItem: (key, value) => {
        if (denied === 'write') throw Error('Denied')
        storage.set(key, value)
      },
    },
    { documentElement: { classList: { contains: () => dark } }, body: {} },
    { now: () => now },
  )
  assert.equal(exports.default(), null, 'The server/initial render is empty')
  return {
    render: exports.default,
    effect: () => effect(),
    ready,
    storage,
    advance: (time) => {
      now = time
    },
    get state() {
      return state
    },
    get updates() {
      return updates
    },
  }
}

test('entrance runs once per session and survives StrictMode effect replay', () => {
  for (const dark of [true, false]) {
    const app = mount({ dark })
    app.effect()
    assert.equal(app.state.theme, dark ? 'dark' : 'light')
    assert.equal(app.storage.get('signature-seen'), '1')
    app.effect()
    assert.equal(app.updates, 1)
    const layer = app.render()
    layer.props.onAnimationEnd({ target: {}, currentTarget: layer })
    assert.ok(app.state, 'A child animation cannot dismiss the entrance')
    layer.props.onAnimationEnd({ target: layer, currentTarget: layer })
    assert.equal(app.state, null)
  }
})

test('returning visits, reduced motion, and denied storage skip the entrance', () => {
  for (const options of [
    { seen: true },
    { reduced: true },
    { denied: 'read' },
    { denied: 'write' },
  ]) {
    const app = mount(options)
    app.effect()
    assert.equal(app.render(), null)
    assert.equal(app.updates, 0)
  }
})

test('fast assets reveal the entrance; slow or failed assets dismiss it', () => {
  for (const elapsed of [250, 251]) {
    const app = mount()
    app.effect()
    const image = app.render().props.children
    app.advance(elapsed)
    image.props.onLoad()
    assert.equal(Boolean(app.state), elapsed === 250)
    assert.deepEqual(app.ready, elapsed === 250 ? [['data-ready', 'true']] : [])
    image.props.onError()
    assert.equal(app.state, null)
  }
})
