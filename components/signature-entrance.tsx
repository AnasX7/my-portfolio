'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './signature-entrance.module.css'

export default function SignatureEntrance() {
  const [entrance, setEntrance] = useState<{ theme: string; startedAt: number } | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    try {
      if (sessionStorage.getItem('signature-seen')) return
      sessionStorage.setItem('signature-seen', '1')
    } catch {
      return
    }

    setEntrance({
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      startedAt: performance.now(),
    })
  }, [])

  if (!entrance) return null

  return createPortal(
    <div
      ref={layerRef}
      className={styles.entrance}
      aria-hidden='true'
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) setEntrance(null)
      }}
    >
      <Image
        src={`/brand/wordmark-${entrance.theme}.webp`}
        alt=''
        width={1800}
        height={480}
        unoptimized
        loading='eager'
        className={styles.mark}
        onLoad={() => {
          // Skip a slow asset; loading never restarts the entrance timeline.
          if (performance.now() - entrance.startedAt > 250) {
            setEntrance(null)
          } else {
            layerRef.current?.setAttribute('data-ready', 'true')
          }
        }}
        onError={() => setEntrance(null)}
      />
    </div>,
    document.body,
  )
}
