'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDecorator, CardHeader } from '@/components/ui/card'
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/ui/terminal'
import ExperinceTimeline from '@/components/home/experince-timeline'
import AnimatedNumber from '@/components/ui/animated-number'
import { UserRound, ChartLine, ToolCase, BriefcaseBusiness, LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'

export default function About() {
  const t = useTranslations()

  return (
    <section id='about' className='mt-18 sm:mt-20'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <motion.div
          className='mx-auto grid gap-6 sm:gap-6 lg:grid-cols-2'
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
          {/* Introduction Card */}
          <AboutCard className='bg-card/65 gap-0 pb-0'>
            <CardHeader className='pb-0'>
              <CardHeading
                icon={UserRound}
                title={t(DATA.about.card1.titleKey)}
                description={t(DATA.about.card1.descriptionKey)}
              />
            </CardHeader>

            <div className='overflow-hidden'>
              <div className='relative -mr-6 -mb-6 h-48 rounded-tl-(--radius) border-t border-l p-6 py-6 sm:ml-6'>
                <div className='absolute top-2 left-3 flex gap-1'>
                  <span className='block size-2 rounded-full border dark:border-white/10 dark:bg-white/10'></span>
                  <span className='block size-2 rounded-full border dark:border-white/10 dark:bg-white/10'></span>
                  <span className='block size-2 rounded-full border dark:border-white/10 dark:bg-white/10'></span>
                </div>
                <svg
                  className='w-full sm:w-[150%]'
                  viewBox='0 0 366 231'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <defs>
                    <linearGradient
                      id='paint0_linear_0_705'
                      x1='0.85108'
                      y1='0.947876'
                      x2='0.85108'
                      y2='230.114'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop
                        className='text-primary/15 dark:text-primary/35'
                        stopColor='currentColor'
                      />
                      <stop
                        className='text-transparent'
                        offset='1'
                        stopColor='currentColor'
                        stopOpacity='0.01'
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </AboutCard>

          {/* Analytics Card */}
          <AboutCard className='bg-card/65 gap-0'>
            <CardHeader>
              <CardHeading icon={ChartLine} title={t(DATA.about.card2.titleKey)} />
            </CardHeader>

            <div className='mt-3 flex flex-col justify-center gap-3 px-6'>
              {DATA.about.card2.analytics.map((analytic) => (
                <AnalyticCard
                  key={analytic.labelKey}
                  icon={analytic.icon}
                  value={analytic.value}
                  label={t(analytic.labelKey)}
                  delay={1000}
                  showPlus={analytic.showPlus}
                />
              ))}
            </div>
          </AboutCard>

          {/* Experience Card */}
          <AboutCard className='bg-card/65'>
            <CardHeader>
              <CardHeading icon={BriefcaseBusiness} title={t(DATA.about.card3.titleKey)} />
            </CardHeader>

            <CardContent>
              <ExperinceTimeline />
            </CardContent>
          </AboutCard>

          {/* Tech Skills Card */}
          <AboutCard className='bg-card/65 pb-0'>
            <CardHeader className='pb-3'>
              <CardHeading icon={ToolCase} title={t(DATA.about.card4.titleKey)} />
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
        </motion.div>
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
  icon: LucideIcon
  title: string
  description?: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div>
    <span className='text-muted-foreground flex items-center gap-2 text-xl md:text-2xl'>
      <Icon className='size-5 md:size-6' />
      {title}
    </span>
    {description ? <p className='my-2 text-sm text-pretty md:text-base'>{description}</p> : null}
  </div>
)

interface AnalyticCardProps {
  icon: LucideIcon
  value: number
  label: string
  delay?: number
  showPlus?: boolean
}

const AnalyticCard = ({
  icon: Icon,
  value,
  label,
  delay = 0,
  showPlus = false,
}: AnalyticCardProps) => (
  <div className='flex items-center gap-6 rounded-lg border p-4 dark:border-white/10'>
    <div className='rounded-full border p-2 dark:border-white/10'>
      <Icon className='text-primary size-5' />
    </div>
    <div className='flex flex-col gap-1'>
      <div className='flex items-baseline'>
        <AnimatedNumber value={value} delay={delay} className='text-2xl font-bold' />
        {showPlus ? <span className='text-2xl font-bold'>+</span> : null}
      </div>
      <span className='text-muted-foreground text-sm'>{label}</span>
    </div>
  </div>
)
