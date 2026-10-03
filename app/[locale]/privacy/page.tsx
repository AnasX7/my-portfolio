import { TextReveal, TextRevealGroup } from '@/components/ui/text-reveal'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('contact.privacy')
  return { title: t('title') }
}

export default async function PrivacyPage() {
  const t = await getTranslations('contact.privacy')
  return (
    <main className='main-frame px-6 pt-32 pb-24 sm:px-8 sm:pb-28 lg:px-10'>
      <div className='mx-auto max-w-2xl'>
        <TextReveal as='h1' className='page-title mb-8'>
          {t('title')}
        </TextReveal>
        <div className='text-muted-foreground space-y-6 text-base leading-relaxed'>
          <TextRevealGroup className='space-y-6'>
            <TextReveal as='p'>{t('message')}</TextReveal>
            <TextReveal as='p'>{t('verification')}</TextReveal>
          </TextRevealGroup>
          <a
            className='text-foreground underline underline-offset-4'
            href='https://www.cloudflare.com/turnstile-privacy-policy/'
          >
            {t('cloudflare')}
          </a>
        </div>
      </div>
    </main>
  )
}
