'use client'

import { useLayoutEffect, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { SIGNATURE_WELCOME_EVENT } from '@/lib/signature-welcome'
import styles from './signature-entrance.module.css'

function subscribe(onChange: () => void) {
  window.addEventListener(SIGNATURE_WELCOME_EVENT, onChange)
  return () => window.removeEventListener(SIGNATURE_WELCOME_EVENT, onChange)
}

export function useSignatureWelcome() {
  return useSyncExternalStore(
    subscribe,
    () => window.__signatureWelcome === 'preparing' || window.__signatureWelcome === 'assembling',
    () => true,
  )
}

export default function SignatureEntrance({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    // React's development remount can clear the pre-paint attribute.
    if (window.__signatureWelcome) {
      document.documentElement.setAttribute('data-signature-welcome', window.__signatureWelcome)
    }
  }, [])

  return (
    <>
      <div
        className={styles.entrance}
        data-signature-welcome=''
        data-lenis-prevent=''
        aria-hidden='true'
      >
        <div className={styles.mark}>
          {['a1', 'n', 'a2', 's'].map((letter, index) => (
            <div
              key={letter}
              className={styles.letter}
              data-signature-letter={letter}
              style={
                {
                  '--letter-light': `url('/brand/letter-${letter}-front-light.webp')`,
                  '--letter-dark': `url('/brand/letter-${letter}-front-dark.webp')`,
                  '--letter-x': ['-8%', '-2%', '2%', '8%'][index],
                  '--letter-y': ['18%', '-24%', '22%', '-18%'][index],
                  '--letter-turn': ['-9deg', '7deg', '-7deg', '9deg'][index],
                  '--letter-delay': `${80 + index * 80}ms`,
                  transformOrigin: `${[18, 45, 66, 86][index]}% 65%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className={styles.site}>{children}</div>
    </>
  )
}
