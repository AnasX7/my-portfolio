import { getLocale, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/constants'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import '../globals.css'

import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { PageTransition } from '@/components/ui/page-transition'
import { MotionProvider } from '@/components/motion-provider'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { FloatingSocials } from '@/components/floating-socials'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const thmanyahSans = localFont({
  src: [
    {
      path: '../fonts/thmanyahsans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/thmanyahsans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/thmanyahsans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/thmanyahsans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/thmanyahsans-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-thmanyah-sans',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('seo')

  const title = t('title')
  const description = t('description')
  const ogImageAlt = t('ogImageAlt')
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
      apple: '/apple-icon.png',
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: SITE_URL,
      siteName: 'Anas Salem',
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/avatar-light.jpg`,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/avatar-light.jpg`],
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
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const isArabic = locale === 'ar'
  const dir = isArabic ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <meta name='apple-mobile-web-app-title' content='Anas' />
      </head>
      <body
        className={`${inter.variable} ${thmanyahSans.variable} ${
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
                <div className='z-0 flex flex-col'>
                  <PageTransition>{children}</PageTransition>
                  <Toaster />
                </div>
                <Footer />
                <FloatingSocials />
              </ThemeProvider>
            </MotionProvider>
          </NextIntlClientProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
