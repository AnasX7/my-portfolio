'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView } from 'motion/react'

export default function FooterSignature() {
  const trigger = useRef<HTMLSpanElement>(null)
  const [ready, setReady] = useState(false)
  const arrived = useInView(trigger, { once: true })

  useEffect(() => setReady(true), [])

  return (
    <div
      className='footer-wordmark'
      aria-hidden='true'
      data-assemble={ready}
      data-arrived={arrived}
    >
      <span ref={trigger} className='footer-wordmark-trigger' />
      <div className='footer-wordmark-image' />
      <div className='footer-wordmark-letters'>
        {['a1', 'n', 'a2', 's'].map((letter, index) => (
          <div
            key={letter}
            className='footer-letter'
            data-letter={letter}
            style={
              {
                '--letter-light': `url('/brand/letter-${letter}-front-light.webp')`,
                '--letter-dark': `url('/brand/letter-${letter}-front-dark.webp')`,
                '--letter-x': ['-7%', '4%', '-4%', '7%'][index],
                '--letter-turn': ['-18deg', '14deg', '-14deg', '18deg'][index],
                '--letter-delay': `${0.08 + index * 0.08}s`,
                transformOrigin: `${[18, 45, 66, 86][index]}% 75%`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
