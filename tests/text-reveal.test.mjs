import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import * as React from 'react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { clsx } from 'clsx'
import ts from 'typescript'

const source = ts.transpileModule(
  readFileSync(new URL('../components/ui/text-reveal.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText

class WordElement {
  constructor(index) {
    this.index = index
  }
  getAttribute(name) {
    return name === 'data-text-word' ? String(this.index) : null
  }
}

function render(
  props,
  { inView = false, reduced = false, welcoming = false, sequence = null, next = 0 } = {},
) {
  const exports = {}
  const effects = []
  let nextParagraph = next
  const modules = {
    react: {
      ...React,
      useRef: () => ({ current: null }),
      useContext: () => sequence,
      useEffect: (effect) => effects.push(effect),
      useState: () => [
        nextParagraph,
        (update) => {
          nextParagraph = update(nextParagraph)
        },
      ],
      useCallback: (callback) => callback,
    },
    clsx: { clsx },
    'motion/react': { useInView: () => inView },
    '@/hooks/use-hydrated-reduced-motion': { useHydratedReducedMotion: () => reduced },
    '@/components/signature-entrance': { useSignatureWelcome: () => welcoming },
    './text-reveal.module.css': {
      __esModule: true,
      default: {
        reveal: 'text-reveal-module__hash__reveal',
        word: 'text-reveal-module__hash__word',
      },
    },
  }
  runInNewContext(source, { exports, HTMLElement: WordElement, require: (name) => modules[name] })
  const element = exports.TextReveal(props)
  return {
    element,
    html: renderToStaticMarkup(element),
    effects,
    exports,
    nextParagraph: () => nextParagraph,
  }
}

test('word reveal preserves rich styling, whitespace, and one continuous word order', () => {
  const children = [
    createElement('strong', { key: 'lead' }, 'A complete sentence.'),
    ' Its description.',
  ]
  const { element, html } = render({
    as: 'p',
    className: 'text-muted-foreground text-base',
    children,
  })
  assert.equal(element.type, 'p')
  assert.match(html, /class="text-reveal-module__hash__reveal text-muted-foreground text-base"/)
  assert.match(html, /<strong><span/)
  assert.equal(html.replace(/<[^>]*>/g, ''), 'A complete sentence. Its description.')
  assert.deepEqual(
    [...html.matchAll(/data-text-word="(\d+)"/g)].map((match) => Number(match[1])),
    [0, 1, 2, 3, 4],
  )
  assert.doesNotMatch(html, /aria-hidden|sr-only/)
})

test('body text finishes promptly at any length while heading timing stays unchanged', () => {
  const heading = render({ as: 'h2', children: 'A section heading' }).element
  assert.equal(heading.props.style['--text-word-duration'], undefined)
  assert.equal(heading.props.style['--text-word-stagger'], undefined)
  for (const count of [1, 20, 100, 300]) {
    const { element, html } = render({ as: 'p', children: Array(count).fill('word').join(' ') })
    const duration = parseFloat(element.props.style['--text-word-duration'])
    const stagger = parseFloat(element.props.style['--text-word-stagger'])
    assert.ok(duration + (count - 1) * stagger <= 1400.001)
    assert.ok(stagger <= 20)
    assert.equal([...html.matchAll(/data-text-word=/g)].length, count)
  }
})

test('paragraphs hand off when the last word starts, preserving their reading order', () => {
  let completed = 0
  const sequence = { ready: false, complete: () => completed++ }
  const props = {
    as: 'p',
    children: ['First ', createElement('strong', { key: 'last' }, 'last word')],
  }
  const waiting = render(props, { inView: true, sequence })
  assert.equal(waiting.element.props['data-revealed'], false)
  waiting.element.props.onAnimationStart({ target: new WordElement(2) })
  assert.equal(completed, 0)
  const active = render(props, { inView: true, sequence: { ...sequence, ready: true } })
  assert.equal(active.element.props['data-revealed'], true)
  active.element.props.onAnimationStart({ target: new WordElement(0) })
  active.element.props.onAnimationStart({ target: new WordElement(1) })
  assert.equal(completed, 0)
  active.element.props.onAnimationStart({ target: new WordElement(2) })
  assert.equal(completed, 1)
})

test('group opens one paragraph at a time, and stale completions cannot rewind it', () => {
  const runtime = render({ children: 'Heading' })
  const group = runtime.exports.TextRevealGroup({
    children: ['First', 'Second', 'Third'],
    className: 'space-y-7',
  })
  assert.equal(group.type, 'div')
  assert.equal(group.props.className, 'space-y-7')
  assert.deepEqual(
    group.props.children.map((provider) => provider.props.value.ready),
    [true, false, false],
  )
  group.props.children[0].props.value.complete()
  assert.equal(runtime.nextParagraph(), 1)
  group.props.children[1].props.value.complete()
  assert.equal(runtime.nextParagraph(), 2)
  group.props.children[0].props.value.complete()
  assert.equal(runtime.nextParagraph(), 2)
})

test('empty text and reduced motion release a sequence without animation events', () => {
  for (const [children, reduced] of [
    [' \n ', false],
    ['نص عربي كامل', true],
  ]) {
    let completed = 0
    const result = render(
      { as: 'p', children },
      { inView: true, reduced, sequence: { ready: true, complete: () => completed++ } },
    )
    result.effects.forEach((effect) => effect())
    assert.equal(completed, 1)
  }
})

test('welcome gating and reduced motion use the same element without swapping text trees', () => {
  const props = { as: 'h1', id: 'title', children: 'شريكك لبناء تجربة رقمية استثنائية' }
  for (const [state, visible] of [
    [{ inView: false }, false],
    [{ inView: true, welcoming: true }, false],
    [{ inView: true, welcoming: false }, true],
    [{ reduced: true, welcoming: true }, true],
  ]) {
    const { element } = render(props, state)
    assert.equal(element.type, 'h1')
    assert.equal(element.props.id, props.id)
    assert.equal(renderToStaticMarkup(element).replace(/<[^>]*>/g, ''), props.children)
    assert.equal(element.props['data-revealed'], visible)
  }
})
