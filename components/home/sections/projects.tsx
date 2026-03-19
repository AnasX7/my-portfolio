'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { DATA } from '@/data/resume'
import { Badge } from '@/components/ui/badge'
import { Card, CardDecorator, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ImageCarousel from '@/components/ui/image-carousel'
import { Link } from '@/i18n/navigation'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'

export default function Projects() {
  const t = useTranslations()

  return (
    <section id='projects' className='mt-20 sm:mt-32'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)',
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className='relative mb-28 flex flex-col items-center py-10 md:mb-36 lg:mb-44'
        >
          <h2 className='text-foreground dark:text-foreground mb-4 text-center text-2xl font-bold md:text-4xl'>
            {t(DATA.projects.titleKey)}
          </h2>
          <p className='text-muted-foreground dark:text-muted-foreground max-w-2xl text-center text-sm md:text-lg'>
            {t(DATA.projects.subtitleKey)}
          </p>
          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className='after:border-border after:bg-secondary pointer-events-none absolute top-full right-0 left-0 -z-10 -mt-32 h-64 w-full overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,oklch(0.88_0.02_80),transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t md:-mt-44 md:h-96 dark:before:bg-[radial-gradient(circle_at_bottom_center,#ffffff,transparent_70%)] dark:after:border-[#ffffff66] dark:after:bg-zinc-900'
          />
        </motion.div>

        <div className='mt-6 flex flex-col gap-6 md:mt-8 lg:mt-14 lg:gap-25'>
          {DATA.projects.cards.map((project, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.95,
                filter: 'blur(10px)',
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
              }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <ProjectCard
                title={t(project.titleKey)}
                description={t(project.descriptionKey)}
                stack={project.stack}
                githubUrl={project.githubUrl}
                isLive={project.isLive}
                liveUrl={project.liveUrl}
                images={project.images}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  title: string
  description: string
  stack: string[]
  githubUrl: string
  isLive: boolean
  liveUrl?: string | null
  images: string[]
}

function ProjectCard({
  title,
  description,
  stack,
  githubUrl,
  isLive,
  liveUrl,
  images,
}: ProjectCardProps) {
  const t = useTranslations()
  const local = useLocale()
  const isRtl = local === 'ar'

  return (
    <Card className='bg-card/65 relative flex h-160 flex-col gap-0 rounded-none sm:h-180 lg:h-80 lg:flex-row'>
      <CardDecorator />
      <CardHeader className='z-10 flex h-full w-full flex-col gap-6 lg:w-[50%] lg:gap-4'>
        <CardTitle className='text-xl font-semibold md:text-2xl'>{title}</CardTitle>
        <CardDescription className='text-sm md:text-base'>{description}</CardDescription>
        <div className='flex flex-wrap gap-2'>
          {stack.map((item, index) => (
            <Badge
              key={index}
              variant='outline'
              className='font-inter border-primary/20 bg-primary/5 rounded-full px-3 py-0.5 text-xs font-medium sm:px-4 sm:py-1 sm:text-sm'
            >
              {item}
            </Badge>
          ))}
        </div>
        <div className='flex w-full items-center gap-4'>
          <Button asChild variant='animated' className='w-auto'>
            <Link href={githubUrl} target='_blank'>
              <div className='flex items-center gap-2'>
                <svg
                  role='img'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  className='fill-foreground dark:fill-foreground h-6 w-6'
                >
                  <title>GitHub</title>
                  <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
                </svg>
                <span className='text-sm font-medium'>{t('projects.github')}</span>
              </div>
            </Link>
          </Button>

          {isLive && liveUrl && (
            <MagneticLinkPreview
              url={liveUrl}
              icon={isRtl ? ArrowUpLeft : ArrowUpRight}
              className='rounded-full sm:py-3'
            >
              {t('projects.live')}
            </MagneticLinkPreview>
          )}
        </div>
      </CardHeader>

      <ImageCarousel images={images} />
    </Card>
  )
}
