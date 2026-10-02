import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('../components/footer-signature.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
)

test('footer keeps its fallback and starts a short stagger when the watermark enters view', () => {
  let ready = false,
    inView = false,
    effect,
    observed
  const trigger = { current: null },
    exports = {}
  const jsx = (type, props) => ({ type, props })
  const modules = {
    react: {
      useRef: () => trigger,
      useState: () => [
        ready,
        (value) => {
          ready = value
        },
      ],
      useEffect: (callback) => {
        effect = callback
      },
    },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'motion/react': {
      useInView: (ref, options) => {
        observed = { ref, options }
        return inView
      },
    },
  }
  new Function('require', 'exports', outputText)((name) => {
    assert.ok(name in modules, `Unexpected dependency: ${name}`)
    return modules[name]
  }, exports)

  const initial = exports.default()
  assert.equal(initial.props['aria-hidden'], 'true')
  assert.equal(initial.props['data-assemble'], false, 'SSR retains the complete static wordmark')
  assert.equal(initial.props['data-arrived'], false)
  assert.equal(initial.props.children[1].props.className, 'footer-wordmark-image')
  assert.equal(observed.ref, initial.props.children[0].props.ref)
  assert.equal(initial.props.children[0].props.className, 'footer-wordmark-trigger')
  assert.deepEqual(observed.options, { once: true })

  effect()
  const waiting = exports.default()
  assert.equal(waiting.props['data-assemble'], true)
  assert.equal(waiting.props['data-arrived'], false, 'Hydration alone must not start the animation')

  inView = true
  const arrived = exports.default()
  assert.equal(arrived.props['data-arrived'], true)
  const letters = arrived.props.children[2].props.children
  assert.equal(letters[0].props.style['--letter-delay'], '0.08s')
  assert.equal(letters.at(-1).props.style['--letter-delay'], '0.32s')
  assert.deepEqual(
    letters.map((letter) => letter.props['data-letter']),
    ['a1', 'n', 'a2', 's'],
  )
  let previousDelay = 0
  for (const [index, letter] of letters.entries()) {
    const style = letter.props.style
    const delay = Number.parseFloat(style['--letter-delay'])
    assert.ok(delay > previousDelay, 'Each letter gets time to arrive after the preceding one')
    previousDelay = delay
    const direction = index % 2 ? 1 : -1
    assert.equal(Math.sign(Number.parseFloat(style['--letter-x'])), direction)
    assert.equal(Math.sign(Number.parseFloat(style['--letter-turn'])), direction)
    assert.ok(style['--letter-light'].includes(`letter-${letter.props['data-letter']}-front-light`))
    assert.ok(style['--letter-dark'].includes(`letter-${letter.props['data-letter']}-front-dark`))
  }
})
