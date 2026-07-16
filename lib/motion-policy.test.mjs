import assert from 'node:assert/strict'
import test from 'node:test'

test('enables rich motion only for fine pointers without Reduced Motion', async () => {
  const { shouldEnableRichMotion } = await import('./motion-policy.ts')

  assert.equal(
    shouldEnableRichMotion({
      prefersReducedMotion: false,
      hasCoarsePointer: false,
      hasNarrowViewport: false,
    }),
    true,
  )
})

test('disables rich motion when Reduced Motion is requested', async () => {
  const { shouldEnableRichMotion } = await import('./motion-policy.ts')

  assert.equal(
    shouldEnableRichMotion({
      prefersReducedMotion: true,
      hasCoarsePointer: false,
      hasNarrowViewport: false,
    }),
    false,
  )
})

test('disables rich motion for coarse pointers', async () => {
  const { shouldEnableRichMotion } = await import('./motion-policy.ts')

  assert.equal(
    shouldEnableRichMotion({
      prefersReducedMotion: false,
      hasCoarsePointer: true,
      hasNarrowViewport: false,
    }),
    false,
  )
})

test('disables rich motion for narrow viewports', async () => {
  const { shouldEnableRichMotion } = await import('./motion-policy.ts')

  assert.equal(
    shouldEnableRichMotion({
      prefersReducedMotion: false,
      hasCoarsePointer: false,
      hasNarrowViewport: true,
    }),
    false,
  )
})
