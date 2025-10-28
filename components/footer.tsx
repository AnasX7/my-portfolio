import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Year } from '@/components/ui/year'
import { getTranslations } from 'next-intl/server'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

export default async function Footer() {
  const t = await getTranslations()

  const socialLinks = [
    {
      icon: FacebookIcon,
      link: '#',
    },
    {
      icon: GithubIcon,
      link: '#',
    },
    {
      icon: InstagramIcon,
      link: '#',
    },
    {
      icon: LinkedinIcon,
      link: '#',
    },
    {
      icon: TwitterIcon,
      link: '#',
    },
    {
      icon: YoutubeIcon,
      link: '#',
    },
  ]
  return (
    <footer className='relative mt-20'>
      <div
        className={cn(
          'mx-auto max-w-5xl lg:border-x',
          'dark:bg-[radial-gradient(35%_80%_at_30%_0%,--theme(--color-foreground/.1),transparent)]'
        )}>
        <div className='absolute inset-x-0 h-px w-full bg-border' />
        <div className='grid max-w-5xl grid-cols-6 gap-6 p-4'>
          <div className='col-span-6 flex flex-col gap-4 pt-5 md:col-span-4'>
            <Link className='w-max text-xl' href='#hero'>
              𝓐𝓷𝖆𝔖
            </Link>
            <p className='max-w-sm text-balance font-mono text-muted-foreground text-sm'>
              A comprehensive financial technology platform.
            </p>
            <div className='flex gap-2'>
              {socialLinks.map((item, index) => (
                <Button
                  key={`social-${item.link}-${index}`}
                  size='icon-sm'
                  variant='outline'>
                  <a href={item.link} target='_blank'>
                    <item.icon className='size-3.5' />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          <div className='col-span-3 px-4 w-full md:col-span-1'>
            <span className='text-muted-foreground text-xs'>
              {t(DATA.projects.titleKey)}
            </span>
            <div className='mt-2 flex flex-col gap-2'>
              {DATA.projects.cards.map(({ githubUrl, titleKey }) => (
                <a
                  className='w-max text-sm hover:underline'
                  href={githubUrl}
                  key={t(titleKey)}>
                  {t(titleKey)}
                </a>
              ))}
            </div>
          </div>
          <div className='col-span-3 px-4 w-full md:col-span-1'>
            <span className='text-muted-foreground text-xs'>
              {t(DATA.sections.titleKey)}
            </span>
            <div className='mt-2 flex flex-col gap-2'>
              {DATA.navItems.map(({ href, nameKey }) => (
                <a
                  className='w-max text-sm hover:underline'
                  href={href}
                  key={nameKey}>
                  {t(nameKey)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className='absolute inset-x-0 h-px w-full bg-border' />
        <div className='flex flex-col justify-between py-4'>
          <p className='text-center font-light text-muted-foreground text-sm'>
            &copy; <Year /> 𝓐𝓷𝖆𝔖, {t(DATA.footer.copyrightKey)}
          </p>
        </div>
      </div>
    </footer>
  )
}
