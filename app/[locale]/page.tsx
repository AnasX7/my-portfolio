import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const isArabic = locale === 'ar'

  return {
    title: isArabic ? 'Portfolio | الصفحة الرئيسية' : 'Portfolio | Home',
  }
}

export default function Home() {
  const t = useTranslations('HomePage')

  return (
    <main>
      <h1>{t('title')}</h1>
      <Link href='/about'>{t('about')}</Link>
    </main>
  )
}
