import { ProjectImageTransition, ScrollReveal } from '@/components/ui/page-transition'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { DATA } from '@/data/resume'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/constants'
import { Link } from '@/i18n/navigation'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { SkillLogo } from '@/components/home/sections/about'
import Projects from '@/components/home/sections/projects'
import Contact from '@/components/home/sections/contact'
import type { Metadata } from 'next'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DATA.projects.cards.map((project) => ({ locale, slug: project.id })),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = DATA.projects.cards.find((item) => item.id === slug)
  if (!project) return {}
  const t = await getTranslations()
  const url = `${SITE_URL}/projects/${slug}`
  return {
    title: t(project.titleKey),
    description: t(project.descriptionKey),
    alternates: { canonical: url },
    openGraph: {
      url,
      title: t(project.titleKey),
      description: t(project.descriptionKey),
      images: [{ url: project.images[0] }],
    },
  }
}

const techIcons: Record<string, string> = {
  'Next.js': 'nextdotjs',
  NestJS: 'nestjs',
  'Tailwind CSS': 'tailwindcss',
  'React Query': 'reactquery',
  'Better Auth': 'betterauth',
  'React Native': 'react',
  Nativewind: '/icons/nativewind.svg',
  Zustand: '/icons/zustand.svg',
  'shadcn/ui': 'shadcnui',
  'TanStack Form': 'tanstack',
  'TanStack Table': 'tanstack',
  'Google Maps': 'googlemaps',
  'Cloudflare R2': 'cloudflare',
  'React Hook Form': 'reacthookform',
  Uniwind: '/icons/uniwind.ico',
  'HeroUI Native': 'heroui',
  'React Native Reanimated': '/icons/reanimated.svg',
  'React Native Skia': '/icons/react-native-skia.png',
  Oxlint: '/icons/oxc.svg',
  Oxfmt: '/icons/oxc.svg',
  'Three.js': 'threedotjs',
  'Cloudflare D1': 'cloudflare',
  'Cloudflare Workers': 'cloudflareworkers',
  'Cal.com': 'caldotcom',
  Playwright: '/icons/playwright.svg',
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = DATA.projects.cards.find((item) => item.id === slug)
  if (!project) notFound()
  const t = await getTranslations()
  const href = project.isLive ? project.liveUrl : project.githubUrl
  const imageIndex = project.id === 'youth-orgs-map' ? 2 : project.id === 'gtk-cash' ? 7 : 1
  const image = (index: number, priority = false) => (
    <ProjectImageTransition name={`project-${project.id}-image-${index}`}>
      <div className='bg-muted relative mx-auto mt-10 aspect-[2/1] max-w-4xl overflow-hidden rounded-3xl'>
        <Image
          src={project.images[index]}
          alt={t(project.imageAltKeys[index])}
          fill
          quality={90}
          priority={priority}
          sizes='(min-width: 944px) 896px, calc(100vw - 48px)'
          className={project.id === 'salaty' ? 'object-contain' : 'object-cover object-top'}
        />
      </div>
    </ProjectImageTransition>
  )
  const domainOverrides: Record<string, string> = {
    'React Native': 'frontend',
    Nativewind: 'frontend',
    Axios: 'frontend',
    Turborepo: 'workflow',
    Uniwind: 'frontend',
    'HeroUI Native': 'frontend',
    'React Native Reanimated': 'frontend',
    'React Native Skia': 'frontend',
    'TanStack Form': 'frontend',
    'TanStack Table': 'frontend',
    'React Hook Form': 'frontend',
    'Google Maps': 'frontend',
    Zod: 'frontend',
    'Cloudflare R2': 'infrastructure',
    Vitest: 'workflow',
    Jest: 'workflow',
    ESLint: 'workflow',
    Prettier: 'workflow',
    Oxlint: 'workflow',
    Oxfmt: 'workflow',
    'Three.js': 'frontend',
    'Cloudflare D1': 'backend',
    Resend: 'backend',
    'Cal.com': 'backend',
    'Cloudflare Workers': 'infrastructure',
    Playwright: 'workflow',
  }
  const toolGroups = DATA.about.card4.skillGroups
    .map((group) => ({
      ...group,
      skills: project.stack
        .filter((tech) =>
          domainOverrides[tech]
            ? domainOverrides[tech] === group.id
            : group.skills.some((skill) => skill.name.toLowerCase() === tech.toLowerCase()),
        )
        .map((tech) => {
          const homeSkill = DATA.about.card4.skillGroups
            .flatMap((group) => group.skills)
            .find((skill) => skill.name === tech)
          const icon = techIcons[tech] ?? tech.toLowerCase().replaceAll(' ', '')
          return {
            name: tech,
            logo:
              homeSkill?.logo ??
              (icon ? (icon.startsWith('/') ? icon : `https://cdn.simpleicons.org/${icon}`) : ''),
          }
        }),
    }))
    .filter((group) => group.skills.length > 0)

  return (
    <main className='main-frame pt-20'>
      <section className='px-4 py-12 text-center sm:px-6 sm:py-16'>
        <h1 className='page-title mx-auto max-w-4xl'>{t(project.titleKey)}</h1>
        <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg md:text-xl'>
          {t(`projects.caseStudies.${slug}.subtitle`)}
        </p>
        {href && (
          <div className='mt-8 flex justify-center'>
            <MagneticLinkPreview
              url={href}
              previewImage={project.images[0]}
              className='[&_.inner]:text-foreground min-h-14 px-8 py-3 [&_.inner]:text-base [&_.inner]:font-semibold'
            >
              {t(project.isLive ? 'projects.live' : 'projects.github')}
            </MagneticLinkPreview>
          </div>
        )}
        {image(0, true)}
      </section>
      <section className='px-4 py-12 sm:px-6 sm:py-16'>
        <ScrollReveal className='mx-auto grid max-w-4xl gap-10'>
          <div>
            <h2 className='section-title'>{t('projects.detail.duration')}</h2>
            <p className='text-muted-foreground mt-4'>
              {t(`projects.caseStudies.${slug}.duration`)}
            </p>
          </div>
          <div>
            <h2 className='section-title'>{t('projects.detail.problem')}</h2>
            <p className='text-muted-foreground mt-4 text-base leading-8 whitespace-pre-line'>
              {t(`projects.caseStudies.${slug}.problem`)}
            </p>
          </div>
        </ScrollReveal>
        {image(imageIndex)}
        <ScrollReveal className='mx-auto mt-12 max-w-4xl'>
          <h2 className='section-title'>{t('projects.detail.solution')}</h2>
          <p className='text-muted-foreground mt-4 text-base leading-8 whitespace-pre-line'>
            {t(`projects.caseStudies.${slug}.solution`)}
          </p>
        </ScrollReveal>
      </section>
      <section className='px-4 py-12 sm:px-6 sm:py-16'>
        <ScrollReveal className='mx-auto max-w-4xl'>
          <h2 className='section-title mb-6'>{t('projects.detail.tools')}</h2>
          <div className='grid gap-y-6 sm:gap-y-8'>
            {toolGroups.map((group) => (
              <div
                key={group.id}
                className='grid grid-cols-1 gap-y-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-0 lg:grid-cols-[13rem_minmax(0,1fr)]'
              >
                <h3 className='text-muted-foreground text-base font-normal sm:text-lg'>
                  {t(group.titleKey)}
                </h3>
                <ul className='flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3'>
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className='text-foreground/75 flex shrink-0 items-center gap-2 text-sm leading-tight whitespace-nowrap sm:text-base'
                    >
                      <SkillLogo
                        name={skill.name}
                        url={skill.logo}
                        fallbackChar={skill.name.charAt(0)}
                      />
                      <span>{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
      <Projects
        excludeId={slug}
        limit={2}
        titleKey='projects.detail.more'
        headerAction={
          <Link
            href='/projects'
            className={buttonVariants({
              variant: 'animated',
              className:
                'min-h-14 px-8 py-3 [&_.inner]:text-base [&_.inner]:font-semibold [&_.inner]:text-foreground',
            })}
          >
            <AnimatedButtonContent>{t('projects.detail.all')}</AnimatedButtonContent>
          </Link>
        }
      />
      <Contact />
    </main>
  )
}
