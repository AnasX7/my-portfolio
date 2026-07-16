export type MotionPreferences = {
  prefersReducedMotion: boolean
  hasCoarsePointer: boolean
  hasNarrowViewport: boolean
}

export function shouldEnableRichMotion({
  prefersReducedMotion,
  hasCoarsePointer,
  hasNarrowViewport,
}: MotionPreferences) {
  return !prefersReducedMotion && !hasCoarsePointer && !hasNarrowViewport
}
