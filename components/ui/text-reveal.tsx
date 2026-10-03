'use client'

import {
  Children,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useInView } from 'motion/react'
import { clsx } from 'clsx'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'
import { useSignatureWelcome } from '@/components/signature-entrance'
import styles from './text-reveal.module.css'

type TextRevealProps = {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div'
  className?: string
  id?: string
  delay?: number
}

const SequenceContext = createContext<{ ready: boolean; complete: () => void } | null>(null)

/** Keep paragraphs in reading order, overlapping only their finishing fades. */
export function TextRevealGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [next, setNext] = useState(0)
  const complete = useCallback((index: number) => {
    setNext((current) => Math.max(current, index + 1))
  }, [])

  return createElement(
    'div',
    { className },
    Children.map(children, (child, index) =>
      createElement(
        SequenceContext.Provider,
        { value: { ready: index <= next, complete: () => complete(index) } },
        child,
      ),
    ),
  )
}

function splitWords(children: ReactNode, sequence: { index: number }): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child)
        .split(/(\s+)/u)
        .map((token, index) => {
          if (!token || /^\s+$/u.test(token)) return token
          const wordIndex = sequence.index++
          return createElement(
            'span',
            {
              key: index,
              className: styles.word,
              'data-text-word': wordIndex,
              style: { '--text-word-index': wordIndex } as CSSProperties,
            },
            token,
          )
        })
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children !== undefined) {
      return cloneElement(child, {}, splitWords(child.props.children, sequence))
    }
    return child
  })
}

export function TextReveal({ children, as = 'h2', className, id, delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reducedMotion = useHydratedReducedMotion()
  const welcoming = useSignatureWelcome()
  const sequence = useContext(SequenceContext)
  const words = { index: 0 }
  const content = splitWords(children, words)
  const bodyText = as === 'p' || as === 'div'
  // Keep a paragraph's full reveal within 1.4s, even when it contains many words.
  const stagger = Math.min(20, 800 / Math.max(words.index - 1, 1))
  const revealed = reducedMotion || (inView && !welcoming && (sequence?.ready ?? true))

  useEffect(() => {
    // Reduced motion and empty paragraphs have no animationstart to release the next paragraph.
    if (revealed && (reducedMotion || words.index === 0)) sequence?.complete()
  }, [revealed, reducedMotion, words.index, sequence])

  function onAnimationStart(event: AnimationEvent<HTMLElement>) {
    if (
      revealed &&
      event.target instanceof HTMLElement &&
      event.target.getAttribute('data-text-word') === String(words.index - 1)
    ) {
      sequence?.complete()
    }
  }

  function onAnimationEnd(event: AnimationEvent<HTMLElement>) {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('data-text-word')) {
      event.target.setAttribute('data-text-settled', 'true')
    }
  }

  return createElement(
    as,
    {
      ref,
      id,
      className: clsx(styles.reveal, className),
      'data-text-reveal': '',
      'data-revealed': revealed,
      onAnimationStart,
      onAnimationEnd,
      style: {
        '--text-reveal-delay': `${delay}s`,
        ...(bodyText && {
          '--text-word-duration': '600ms',
          '--text-word-stagger': `${stagger}ms`,
        }),
      } as CSSProperties,
    },
    content,
  )
}
