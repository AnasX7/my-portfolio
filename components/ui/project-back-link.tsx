'use client'

import { Link, useRouter } from '@/i18n/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeftIcon } from '@hugeicons/core-free-icons'

interface BackLinkProps {
  isRtl: boolean
  label: string
}

export default function BackLink({ isRtl, label }: BackLinkProps) {
  const router = useRouter()

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/#projects')
  }

  return (
    <Link
      href='/#projects'
      onClick={handleBack}
      className='text-muted-foreground hover:text-foreground group focus-visible:ring-foreground inline-flex min-h-11 items-center gap-3 text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2'
    >
      <span className='border-foreground/15 flex size-9 items-center justify-center rounded-full border transition-transform duration-150 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5'>
        <HugeiconsIcon icon={ArrowLeftIcon} className={`size-4 ${isRtl ? 'rotate-180' : ''}`} />
      </span>
      <span className='border-b border-transparent pb-0.5 transition-colors duration-150 group-hover:border-current'>
        {label}
      </span>
    </Link>
  )
}
