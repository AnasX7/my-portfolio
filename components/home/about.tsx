'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from '@/components/ui/terminal'
import Experince from './experince'
import {
  UserRound,
  ChartLine,
  ToolCase,
  BriefcaseBusiness,
  LucideIcon,
  Sparkles,
} from 'lucide-react'
import { motion } from 'motion/react'
import AnimatedNumber from '@/components/ui/animated-number'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'

export default function About() {
  const t = useTranslations()

  return (
    <section id='about' className='overflow-hidden'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-5xl'>
        <motion.div
          className='mb-4 sm:mb-6 lg:mb-8 flex justify-center'
          initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}>
          <Badge
            variant='outline'
            className='rounded-full border-primary/20 bg-primary/5 px-3 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-sm font-medium'>
            <Sparkles className='mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary' />
            {t(DATA.about.titleKey)}
          </Badge>
        </motion.div>
        <motion.div
          className='mx-auto grid gap-4 sm:gap-6 lg:grid-cols-2'
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
          }}>
          <FeatureCard className='bg-background/65 gap-0 pb-0'>
            <CardHeader className='pb-0'>
              <CardHeading
                icon={UserRound}
                title={t(DATA.about.card1.titleKey)}
                description={t(DATA.about.card1.descriptionKey)}
              />
            </CardHeader>

            <div className='overflow-hidden'>
              <div className='rounded-tl-(--radius) relative -mb-6 -mr-6 h-48 border-l border-t p-6 py-6 sm:ml-6'>
                <div className='absolute left-3 top-2 flex gap-1'>
                  <span className='block size-2 rounded-full border dark:border-white/10 dark:bg-white/10'></span>
                  <span className='block size-2 rounded-full border dark:border-white/10 dark:bg-white/10'></span>
                  <span className='block size-2 rounded-full border dark:border-white/10 dark:bg-white/10'></span>
                </div>
                <svg
                  className='w-full sm:w-[150%]'
                  viewBox='0 0 366 231'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <defs>
                    <linearGradient
                      id='paint0_linear_0_705'
                      x1='0.85108'
                      y1='0.947876'
                      x2='0.85108'
                      y2='230.114'
                      gradientUnits='userSpaceOnUse'>
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
          </FeatureCard>

          <FeatureCard className='bg-background/65 gap-0'>
            <CardHeader>
              <CardHeading
                icon={ChartLine}
                title={t(DATA.about.card2.titleKey)}
              />
            </CardHeader>

            <div className='flex flex-col px-6 justify-center gap-3'>
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
          </FeatureCard>

          <FeatureCard className='bg-background/65'>
            <CardHeader>
              <CardHeading
                icon={BriefcaseBusiness}
                title={t(DATA.about.card3.titleKey)}
              />
            </CardHeader>

            <CardContent>
              <Experince />
            </CardContent>
          </FeatureCard>

          <FeatureCard className='bg-background/65 pb-0'>
            <CardHeader className='pb-3'>
              <CardHeading
                icon={ToolCase}
                title={t(DATA.about.card4.titleKey)}
              />
            </CardHeader>

            <div className='relative h-full'>
              <div className='absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-300),var(--color-white)_100%)]'></div>
              <div dir='ltr' className='aspect-44/48 sm:aspect-76/59  p-1 px-6'>
                <Terminal className='absolute inset-0 mx-auto h-fit w-[calc(100%-1.5rem)] rounded-lg border bg-background/75 p-4'>
                  {(start) => (
                    <>
                      <TypingAnimation start={start}>
                        &gt; npx anas@latest tech-skills
                      </TypingAnimation>

                      {DATA.about.card4.skills.map((skill) => (
                        <AnimatedSpan
                          key={skill.name}
                          delay={skill.delay}
                          className='text-green-500'
                          start={start}>
                          <span>✔ {skill.name}</span>
                        </AnimatedSpan>
                      ))}
                    </>
                  )}
                </Terminal>
              </div>
            </div>
          </FeatureCard>
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  children: ReactNode
  className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card
    className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
    <CardDecorator />
    {children}
  </Card>
)

const CardDecorator = () => (
  <>
    <span className='border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2'></span>
    <span className='border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2'></span>
    <span className='border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2'></span>
    <span className='border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2'></span>
  </>
)

interface CardHeadingProps {
  icon: LucideIcon
  title: string
  description?: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className='p-6'>
    <span className='text-muted-foreground flex items-center gap-2'>
      <Icon className='size-4' />
      {title}
    </span>
    {description && <p className='mt-2 text-sm  font-semibold'>{description}</p>}
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
  <div className='flex gap-6 items-center rounded-lg border p-4 dark:border-white/10'>
    <div className='rounded-full border p-2 dark:border-white/10'>
      <Icon className='size-5 text-primary' />
    </div>
    <div className='flex flex-col gap-1'>
      <div className='flex items-baseline'>
        <AnimatedNumber
          value={value}
          delay={delay}
          className='text-2xl font-bold'
        />
        {showPlus && <span className='text-2xl font-bold'>+</span>}
      </div>
      <span className='text-sm text-muted-foreground'>{label}</span>
    </div>
  </div>
)
