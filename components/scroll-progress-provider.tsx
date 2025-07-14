'use client'

import { useRef } from 'react'
import { ScrollProgress } from './ui/scroll-progress'
import { GridPattern } from './ui/grid-pattern'
import { cn } from '@/lib/utils'

export default function ScrollProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Full-page grid background */}
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={'4 2'}
        className={cn(
          'fixed inset-0 z-0 h-full w-full pointer-events-none',
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
        )}
      />
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
        className='flex min-h-screen flex-col items-center justify-between relative z-0'
        ref={containerRef}>
        {children}
      </main>
    </>
  )
}
