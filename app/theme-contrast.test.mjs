import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const globalsCss = await readFile(new URL('./globals.css', import.meta.url), 'utf8')

function getThemeBlock(selector) {
  const block = globalsCss.match(new RegExp(`\\${selector}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1]

  assert.ok(block, `${selector} theme block should exist`)
  return block
}

function getToken(theme, name) {
  const value = theme.match(new RegExp(`^\\s*--${name}:\\s*([^;]+);`, 'm'))?.[1]

  assert.ok(value, `--${name} should exist`)
  return value
}

test('light interaction tokens use the approved accessible contrast values', () => {
  const lightTheme = getThemeBlock(':root')

  assert.equal(getToken(lightTheme, 'ring'), 'oklch(0.26 0.02 80)')
  assert.equal(getToken(lightTheme, 'sidebar-ring'), 'oklch(0.26 0.02 80)')
  assert.equal(getToken(lightTheme, 'destructive'), 'oklch(0.551 0.225 27.325)')
})

test('dark interaction tokens strengthen rings without changing destructive', () => {
  const darkTheme = getThemeBlock('.dark')

  assert.equal(getToken(darkTheme, 'ring'), 'oklch(0.766 0 0)')
  assert.equal(getToken(darkTheme, 'sidebar-ring'), 'oklch(0.766 0 0)')
  assert.equal(getToken(darkTheme, 'destructive'), 'oklch(0.704 0.191 22.216)')
})
