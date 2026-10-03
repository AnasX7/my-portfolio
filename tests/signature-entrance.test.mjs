import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const compile = (file) =>
  ts.transpileModule(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
const welcome = {}
runInNewContext(compile('lib/signature-welcome.ts'), { exports: welcome })

function eventTarget() {
  const listeners = new Map()
  return {
    listeners,
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type).add(callback)
    },
    removeEventListener(type, callback) {
      listeners.get(type)?.delete(callback)
    },
    dispatchEvent(event) {
      listeners.get(event.type)?.forEach((callback) => callback(event))
    },
  }
}

function boot({
  reduced = false,
  denied,
  storage = new Map(),
  dark = false,
  readyState = 'loading',
} = {}) {
  const attributes = new Map(),
    timers = new Map(),
    phases = [],
    images = []
  class Image {
    constructor() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      images.push(this)
    }
    decode() {
      this.decoding = true
      return this.promise
    }
  }
  const root = {
    classList: { contains: (name) => name === 'dark' && dark },
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    getAttribute: (name) => attributes.get(name) ?? null,
  }
  const media = { ...eventTarget(), matches: reduced }
  const document = { ...eventTarget(), documentElement: root, readyState }
  const window = {
    ...eventTarget(),
    matchMedia: () => media,
    setTimeout: (callback, delay) => {
      timers.set(1, { callback, delay })
      return 1
    },
    clearTimeout: (id) => timers.delete(id),
  }
  const dispatch = window.dispatchEvent
  window.dispatchEvent = (event) => {
    if (event.type === welcome.SIGNATURE_WELCOME_EVENT) phases.push(window.__signatureWelcome)
    dispatch(event)
  }
  const context = {
    window,
    document,
    Event,
    Image,
    sessionStorage: {
      getItem: (key) => {
        if (denied === 'read') throw Error('Denied')
        return storage.get(key)
      },
      setItem: (key, value) => {
        if (denied === 'write') throw Error('Denied')
        storage.set(key, value)
      },
    },
  }
  runInNewContext(welcome.signatureWelcomeScript, context)
  return { ...context, root, media, storage, timers, phases, images }
}

const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

const overlay = { hasAttribute: (name) => name === 'data-signature-welcome' }
const child = { hasAttribute: () => false }
const animation = (app, type, target = overlay) => app.document.dispatchEvent({ type, target })
const listenerCount = (app) =>
  [app.window, app.document, app.media].reduce(
    (total, target) =>
      total + [...target.listeners.values()].reduce((sum, set) => sum + set.size, 0),
    0,
  )
function assertFinished(app) {
  assert.equal(app.window.__signatureWelcome, undefined)
  assert.equal(app.root.getAttribute('data-signature-welcome'), null)
  assert.equal(app.timers.size, 0)
  assert.equal(listenerCount(app), 0)
}

test('fresh sessions activate synchronously; returning, reduced-motion, and denied-storage visits skip', () => {
  const fresh = boot()
  assert.equal(fresh.window.__signatureWelcome, 'preparing')
  assert.equal(fresh.root.getAttribute('data-signature-welcome'), 'preparing')
  assert.equal(fresh.storage.get('signature-assembly-seen'), '1')
  assert.equal([...fresh.timers.values()][0].delay, 4000)
  for (const options of [
    { storage: fresh.storage },
    { reduced: true },
    { denied: 'read' },
    { denied: 'write' },
  ])
    assertFinished(boot(options))
  const legacy = boot({ storage: new Map([['signature-seen', '1']]) })
  assert.equal(
    legacy.window.__signatureWelcome,
    'preparing',
    'The old handwriting key must not skip assembly',
  )
  assert.equal(legacy.storage.get('signature-assembly-seen'), '1')
})

test('assembly waits for all four themed images after DOM readiness', async () => {
  for (const [dark, readyState] of [
    [false, 'loading'],
    [true, 'complete'],
  ]) {
    const app = boot({ dark, readyState })
    if (readyState === 'loading') {
      assert.equal(app.images.length, 0)
      app.document.dispatchEvent({ type: 'DOMContentLoaded' })
    }
    assert.deepEqual(
      app.images.map((image) => image.src),
      ['a1', 'n', 'a2', 's'].map(
        (letter) => '/brand/letter-' + letter + '-front-' + (dark ? 'dark' : 'light') + '.webp',
      ),
    )
    assert.ok(app.images.every((image) => image.decoding))
    app.images.slice(0, 3).forEach((image) => image.resolve())
    await flushPromises()
    assert.equal(app.window.__signatureWelcome, 'preparing')
    app.images[3].resolve()
    await flushPromises()
    assert.equal(app.window.__signatureWelcome, 'assembling')
    assert.equal(app.root.getAttribute('data-signature-welcome'), 'assembling')
    animation(app, 'animationend')
    assertFinished(app)
  }
})

test('child animations are ignored; the overlay releases the hero before finishing', async () => {
  const app = boot({ readyState: 'complete' })
  app.images.forEach((image) => image.resolve())
  await flushPromises()
  animation(app, 'animationstart', child)
  animation(app, 'animationend', child)
  assert.deepEqual(app.phases, ['preparing', 'assembling'])
  animation(app, 'animationstart')
  assert.equal(app.root.getAttribute('data-signature-welcome'), 'leaving')
  assert.deepEqual(app.phases, ['preparing', 'assembling', 'leaving'])
  animation(app, 'animationend')
  assertFinished(app)
  assert.deepEqual(app.phases, ['preparing', 'assembling', 'leaving', undefined])
})

test('watchdog, Escape, reduced-motion changes, and pagehide fail open and clean up once', () => {
  for (const reason of ['watchdog', 'Escape', 'reduced', 'pagehide']) {
    const app = boot()
    const watchdog = [...app.timers.values()][0].callback
    app.document.dispatchEvent({ type: 'keydown', key: 'Tab' })
    app.media.dispatchEvent({ type: 'change' })
    assert.equal(app.window.__signatureWelcome, 'preparing')
    if (reason === 'watchdog') watchdog()
    if (reason === 'Escape') app.document.dispatchEvent({ type: 'keydown', key: 'Escape' })
    if (reason === 'reduced') {
      app.media.matches = true
      app.media.dispatchEvent({ type: 'change' })
    }
    if (reason === 'pagehide') app.window.dispatchEvent({ type: 'pagehide' })
    assertFinished(app)
    const publications = app.phases.length
    watchdog()
    animation(app, 'animationend')
    app.window.dispatchEvent({ type: 'pagehide' })
    app.document.dispatchEvent({ type: 'DOMContentLoaded' })
    assert.equal(app.images.length, 0, 'Completion removes the pending DOM readiness listener')
    assert.equal(app.phases.length, publications, 'Repeated completion must be harmless')
  }
})

test('decode failure and late image readiness cannot relock a completed welcome', async () => {
  for (const reason of ['decode', 'watchdog', 'Escape']) {
    const app = boot({ readyState: 'complete' })
    if (reason === 'decode') app.images[0].reject(new Error('Image decoding failed'))
    if (reason === 'watchdog') [...app.timers.values()][0].callback()
    if (reason === 'Escape') app.document.dispatchEvent({ type: 'keydown', key: 'Escape' })
    await flushPromises()
    assertFinished(app)
    const publications = app.phases.length
    app.images.forEach((image) => image.resolve())
    await flushPromises()
    assertFinished(app)
    assert.equal(app.phases.length, publications)
  }
})

test('SSR retains four letters and site children; hook and StrictMode restore share all phases', async () => {
  const app = boot({ readyState: 'complete' }),
    exports = {}
  let layoutEffect,
    store,
    updates = 0
  const jsx = (type, props) => ({ type, props })
  const modules = {
    react: {
      useLayoutEffect: (callback) => {
        layoutEffect = callback
      },
      useSyncExternalStore: (subscribe, snapshot, serverSnapshot) => {
        store = { subscribe, snapshot, serverSnapshot }
        return snapshot()
      },
    },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    '@/lib/signature-welcome': welcome,
    './signature-entrance.module.css': { default: { entrance: 'entrance', site: 'site' } },
  }
  runInNewContext(compile('components/signature-entrance.tsx'), {
    exports,
    require: (name) => modules[name],
    window: app.window,
    document: app.document,
  })
  const screen = exports.default({ children: 'site content' })
  assert.equal(screen.props.children[0].props['data-signature-welcome'], '')
  assert.equal(screen.props.children[0].props['aria-hidden'], 'true')
  assert.equal(screen.props.children[1].props.children, 'site content')
  const letters = screen.props.children[0].props.children.props.children
  assert.deepEqual(
    Array.from(letters, (letter) => letter.props['data-signature-letter']),
    ['a1', 'n', 'a2', 's'],
  )
  for (const letter of letters) {
    for (const theme of ['light', 'dark']) {
      assert.equal(
        letter.props.style['--letter-' + theme],
        "url('/brand/letter-" +
          letter.props['data-signature-letter'] +
          '-front-' +
          theme +
          ".webp')",
      )
    }
  }
  assert.equal(exports.useSignatureWelcome(), true)
  assert.equal(store.serverSnapshot(), true)
  const unsubscribe = store.subscribe(() => updates++)
  app.root.removeAttribute('data-signature-welcome')
  layoutEffect()
  assert.equal(app.root.getAttribute('data-signature-welcome'), 'preparing')
  app.images.forEach((image) => image.resolve())
  await flushPromises()
  assert.equal(store.snapshot(), true, 'The hero remains paused while letters assemble')
  app.root.removeAttribute('data-signature-welcome')
  layoutEffect()
  assert.equal(app.root.getAttribute('data-signature-welcome'), 'assembling')
  animation(app, 'animationstart')
  assert.equal(store.snapshot(), false)
  assert.equal(updates, 2)
  app.root.removeAttribute('data-signature-welcome')
  layoutEffect()
  assert.equal(app.root.getAttribute('data-signature-welcome'), 'leaving')
  animation(app, 'animationend')
  layoutEffect()
  assert.equal(store.snapshot(), false)
  assert.equal(updates, 3)
  unsubscribe()
  assertFinished(app)
})
