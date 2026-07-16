import { setRequestLocale, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/constants'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import '../globals.css'

import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import ScrollProgressProvider from '@/components/scroll-progress-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { MotionProvider } from '@/components/motion-provider'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const fontSans = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })

  const title = t('title')
  const description = t('description')
  const ogImageAlt = t('ogImageAlt')
  const localeUrl = `${SITE_URL}/${locale}`
  const ogLocale = locale === 'ar' ? 'ar_AE' : 'en_US'

  return {
    title,
    description,
    applicationName: 'Portfolio',
    generator: 'Next.js 16',
    authors: [{ name: 'Anas Salem', url: SITE_URL }],
    creator: 'Anas Salem',
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    alternates: {
      canonical: localeUrl,
      languages: {
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        'x-default': `${SITE_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: localeUrl,
      siteName: 'Anas Salem',
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/avatar-1.jpg`,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/avatar-1.jpg`],
      creator: '@An_xr7',
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(SITE_URL),
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const isArabic = locale === 'ar'
  const dir = isArabic ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <meta name='apple-mobile-web-app-title' content='Portfolio' />
      </head>
      <body
        className={`${inter.variable} ${fontSans.variable} ${
          isArabic ? 'font-sans' : 'font-inter'
        } min-h-dvh antialiased`}
      >
        <SmoothScrollProvider>
          <NextIntlClientProvider>
            <MotionProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='dark'
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                <ScrollProgressProvider>
                  {children}
                  <Toaster />
                </ScrollProgressProvider>
                <Footer />
              </ThemeProvider>
            </MotionProvider>
          </NextIntlClientProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
