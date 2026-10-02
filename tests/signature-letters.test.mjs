import assert from 'node:assert/strict'
import test from 'node:test'
import sharp from 'sharp'

test('the four footer layers reconstruct the original wordmark in both themes', async () => {
  for (const theme of ['light', 'dark']) {
    const alpha = (path) => sharp(path).ensureAlpha().extractChannel(3).raw().toBuffer()
    const original = await alpha(`public/brand/wordmark-${theme}.webp`)
    const assembled = Buffer.alloc(original.length)
    for (const letter of ['a1', 'n', 'a2', 's']) {
      const path = `public/brand/letter-${letter}-front-${theme}.webp`
      const { width, height } = await sharp(path).metadata()
      assert.deepEqual([width, height], [1800, 480])
      const layer = await alpha(path)
      assert.ok(
        layer.some((value) => value > 0),
        `${letter} must be visible`,
      )
      for (let i = 0; i < layer.length; i++) assembled[i] = Math.max(assembled[i], layer[i])
      const side = await sharp(`public/brand/letter-${letter}-side-${theme}.webp`).metadata()
      assert.deepEqual([side.width, side.height, side.hasAlpha], [512, 512, true])
    }
    assert.deepEqual(assembled, original, `${theme} letters must align without gaps or clipping`)
  }
})
