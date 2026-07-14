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
      className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors'
    >
      <HugeiconsIcon icon={ArrowLeftIcon} className={`size-4 ${isRtl ? 'rotate-180' : ''}`} />
      {label}
    </Link>
  )
}
