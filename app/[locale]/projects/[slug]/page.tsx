import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DATA } from '@/data/resume'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import BackLink from '@/components/ui/project-back-link'
import ProjectHero from '@/components/ui/project-hero'
import ProjectGallery from '@/components/ui/project-gallery'
import { PROJECT_DETAILS_PUBLIC } from '@/lib/features'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  if (!PROJECT_DETAILS_PUBLIC) return []

  const paths: { locale: string; slug: string }[] = []
  routing.locales.forEach((locale) => {
    DATA.projects.cards.forEach((project) => {
      paths.push({ locale, slug: project.id })
    })
  })
  return paths
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!PROJECT_DETAILS_PUBLIC) {
    return { robots: { index: false, follow: false } }
  }

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
  if (!PROJECT_DETAILS_PUBLIC) {
    notFound()
  }

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
  const projectNumber = DATA.projects.cards.findIndex((item) => item.id === project.id) + 1

  const remainingImages = project.images.slice(1)
  const imageAlts = project.imageAltKeys.map((key) => t(key)).slice(1)
  const heroAlt = t(project.imageAltKeys[0])

  return (
    <main className='min-h-screen pt-20'>
      <div className='mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8'>
        <div className='mb-5'>
          <BackLink isRtl={isRtl} label={isRtl ? 'العودة إلى الرئيسية' : 'Back to Home'} />
        </div>

        <ProjectHero
          project={project}
          title={title}
          description={description}
          heroAlt={heroAlt}
          isRtl={isRtl}
          projectNumber={projectNumber}
          labels={{
            project: isRtl ? 'مشروع' : 'Project',
            github: t('projects.github'),
            live: t('projects.live'),
            technologies: isRtl ? 'التقنيات المستخدمة' : 'Technologies Used',
            demoAccount: isRtl ? 'حساب تجريبي' : 'Demo Account',
            email: isRtl ? 'البريد' : 'Email',
            password: isRtl ? 'الرمز' : 'Password',
            copy: isRtl ? 'نسخ' : 'Copy',
            copied: isRtl ? 'تم النسخ' : 'Copied',
          }}
        />

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
