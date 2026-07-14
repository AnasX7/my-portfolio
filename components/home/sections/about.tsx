'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDecorator, CardHeader } from '@/components/ui/card'
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/ui/terminal'
import ExperinceTimeline from '@/components/home/experince-timeline'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import { ToolCaseIcon, BriefcaseBusinessIcon } from '@hugeicons/core-free-icons'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'

export default function About() {
  const t = useTranslations()

  return (
    <section className='mt-12 sm:mt-16'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <m.div
          className='mx-auto flex flex-col gap-6'
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {/* Tech Skills Card */}
          <AboutCard className='bg-card/65 pb-0'>
            <CardHeader className='pb-3'>
              <CardHeading icon={ToolCaseIcon} title={t(DATA.about.card4.titleKey)} />
            </CardHeader>

            <div className='relative h-full'>
              <div className='absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-purple-300),var(--color-orange-300)_100%)]'></div>
              <div dir='ltr' className='aspect-44/48 px-6 py-1 sm:aspect-76/59'>
                <Terminal className='bg-background/75 absolute inset-0 mx-auto h-fit w-[calc(100%-1.5rem)] rounded-lg border p-4'>
                  {(start) => (
                    <>
                      <TypingAnimation start={start}>&gt; npx anas@latest skills</TypingAnimation>

                      {DATA.about.card4.skills.map((skill) => (
                        <AnimatedSpan
                          key={skill.name}
                          delay={skill.delay}
                          className='text-green-500'
                          start={start}
                        >
                          <span>✔ {skill.name}</span>
                        </AnimatedSpan>
                      ))}
                    </>
                  )}
                </Terminal>
              </div>
            </div>
          </AboutCard>

          {/* Experience Card */}
          <AboutCard className='bg-card/65'>
            <CardHeader>
              <CardHeading icon={BriefcaseBusinessIcon} title={t(DATA.about.card3.titleKey)} />
            </CardHeader>

            <CardContent>
              <ExperinceTimeline />
            </CardContent>
          </AboutCard>
        </m.div>
      </div>
    </section>
  )
}

interface AboutCardProps {
  children: ReactNode
  className?: string
}

const AboutCard = ({ children, className }: AboutCardProps) => (
  <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
    <CardDecorator />
    {children}
  </Card>
)

interface CardHeadingProps {
  icon: IconSvgElement
  title: string
  description?: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div>
    <span className='text-muted-foreground flex items-center gap-2 text-xl md:text-2xl'>
      <HugeiconsIcon icon={Icon} className='size-5 md:size-6' />
      {title}
    </span>
    {description ? <p className='my-2 text-sm text-pretty md:text-base'>{description}</p> : null}
  </div>
)
