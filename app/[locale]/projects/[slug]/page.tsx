import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DATA } from '@/data/resume'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import BackLink from '@/components/ui/project-back-link'
import ProjectHero from '@/components/ui/project-hero'
import ProjectGallery from '@/components/ui/project-gallery'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = []
  routing.locales.forEach((locale) => {
    DATA.projects.cards.forEach((project) => {
      paths.push({ locale, slug: project.id })
    })
  })
  return paths
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = DATA.projects.cards.find((p) => p.id === slug)
  if (!project) return {}

  const t = await getTranslations({ locale })
  const title = t(project.titleKey)
  const description = t(project.descriptionKey)

  return {
    title: `${title} | Projects`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: project.images[0] }],
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = DATA.projects.cards.find((p) => p.id === slug)
  if (!project) {
    notFound()
  }

  const t = await getTranslations({ locale })
  const title = t(project.titleKey)
  const description = t(project.descriptionKey)
  const isRtl = locale === 'ar'

  const remainingImages = project.images.slice(1)
  const imageAlts = project.imageAltKeys.map((key) => t(key)).slice(1)

  return (
    <main className='min-h-screen py-24 md:py-32'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Back Link */}
        <div className='mb-8'>
          <BackLink isRtl={isRtl} label={isRtl ? 'العودة إلى الرئيسية' : 'Back to Home'} />
        </div>

        {/* Hero Section */}
        <ProjectHero
          project={project as any}
          title={title}
          description={description}
          isRtl={isRtl}
        />

        {/* Detailed Image Grid Showcase */}
        {remainingImages.length > 0 ? (
          <ProjectGallery
            images={remainingImages}
            imageAlts={imageAlts}
            title={title}
            isRtl={isRtl}
          />
        ) : null}
      </div>
    </main>
  )
}
