'use client'

import { useRef } from 'react'
import { ScrollProgress } from './ui/scroll-progress'

export default function ScrollProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className='pointer-events-none fixed left-0 top-16 z-40 w-full'>
        <ScrollProgress
          className='h-0.5 w-full bg-[linear-gradient(to_right,rgba(0,0,0,0),#111111_75%,#111111_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0),#ffffff_75%,#ffffff_100%)]'
          springOptions={{
            stiffness: 280,
            damping: 18,
            mass: 0.3,
          }}
        />
      </div>
      <main
        className='flex flex-col min-h-dvh z-0'
        ref={containerRef}>
        {children}
      </main>
    </>
  )
}
