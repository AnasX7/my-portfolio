const easeOut = [0.22, 1, 0.36, 1] as const

export function getAboutMotion(reduceMotion: boolean, direction: 1 | -1 = 1) {
  const duration = reduceMotion ? 0 : 0.55

  return {
    list: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.09,
          delayChildren: reduceMotion ? 0 : 0.04,
        },
      },
    },
    section: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : 0.14,
        },
      },
    },
    heading: {
      hidden: {
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 18,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: easeOut },
      },
    },
    skill: {
      hidden: {
        opacity: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 14,
        scale: reduceMotion ? 1 : 0.96,
      },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: reduceMotion ? 0 : 0.45, ease: easeOut },
      },
    },
    item: {
      hidden: {
        opacity: reduceMotion ? 1 : 0,
        x: reduceMotion ? 0 : 18 * direction,
        y: reduceMotion ? 0 : 8,
      },
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration, ease: easeOut },
      },
    },
    timeline: {
      hidden: {
        opacity: reduceMotion ? 1 : 0,
        scaleY: reduceMotion ? 1 : 0,
      },
      show: {
        opacity: 1,
        scaleY: 1,
        transition: { duration: reduceMotion ? 0 : 0.65, ease: easeOut },
      },
    },
  }
}

export const aboutViewport = {
  once: true,
  amount: 0.15,
  margin: '0px 0px -64px',
} as const
