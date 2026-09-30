import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('contact.privacy')
  return { title: t('title') }
}

export default async function PrivacyPage() {
  const t = await getTranslations('contact.privacy')
  return (
    <main className='main-frame px-6 pt-32 pb-16'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='page-title mb-8'>{t('title')}</h1>
        <div className='text-muted-foreground space-y-6 text-base leading-relaxed'>
          <p>{t('message')}</p>
          <p>{t('verification')}</p>
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
