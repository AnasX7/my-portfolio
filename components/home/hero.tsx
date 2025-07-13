import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div className='relative flex flex-col items-center justify-center w-full px-4 py-16 overflow-hidden sm:px-6 lg:px-8'>
      <section className='w-full'>
        <div className='leading-0 mx-auto max-w-3xl space-y-5 text-center lg:leading-5'>
          <h1 className='font-geist group mx-auto w-fit rounded-3xl border-[2px] border-white/5 bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent px-5 py-2 text-sm text-gray-400'>
            Build products for everyone
            <ArrowRight className='ml-2 inline h-4 w-4 duration-300 group-hover:translate-x-1' />
          </h1>

          <h2 className='font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl tracking-tighter text-transparent md:text-6xl'>
            Designing your projects faster with{' '}
            <span className='bg-gradient-to-r from-purple-300 to-orange-200 bg-clip-text text-transparent'>
              the largest figma UI kit.
            </span>
          </h2>

          <p className='mx-auto max-w-2xl text-gray-300'>
            Sed ut perspiciatis unde omnis iste natus voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae.
          </p>
          <div className='flex items-center justify-center gap-x-3 space-y-3 sm:space-y-0'>
            <span className='relative inline-block overflow-hidden rounded-full p-[1.5px]'>
              <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
              <div className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 text-xs font-medium text-gray-50 backdrop-blur-3xl'>
                <a
                  href='#'
                  className='group inline-flex w-full items-center justify-center rounded-full border-[1px] border-input bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 sm:w-auto'>
                  Browse courses
                </a>
              </div>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
