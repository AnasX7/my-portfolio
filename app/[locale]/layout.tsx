import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { Inter, Tajawal } from 'next/font/google'
import '../globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import ScrollProgressProvider from '@/components/scroll-progress-provider'
import { ReactLenis } from 'lenis/react'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Anas Salem',
  description:
    'I’m a Software Engineer with a passion for building scalable web applications and intuitive user experiences. I specialize in both front-end and back-end development, using modern technologies like JavaScript, TypeScript, React, Node.js, and Laravel. I enjoy solving real-world problems with clean, efficient code and love working on products that make a positive impact. Always learning, always improving.',
  applicationName: 'Portfolio',
  generator: 'Next.js 15',
  keywords: [
    'Software Engineer',
    'Software Development',
    'Full Stack Developer',
    'Front-end',
    'Back-end',
    'Next.js',
    'React',
    'TypeScript',
    'JavaScript',
    'Laravel',
    'Tailwind CSS',
    'Node.js',
    'Express',
    'Web Developer',
    'Mobile Developer',
    'Figma',
    'UI/UX',
    'Portfolio',
    'UST',
    'University of Science and Technology',
    'Yemen',
    'UAE',
  ],
  authors: [{ name: 'Anas Salem', url: 'https://anassalem.com' }],
  creator: 'Anas Salem',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anassalem.com',
    siteName: 'Anas Salem',
    title: 'Anas Salem',
    description:
      'I’m a Software Engineer with a passion for building scalable web applications and intuitive user experiences. I specialize in both front-end and back-end development, using modern technologies like JavaScript, TypeScript, React, Node.js, and Laravel. I enjoy solving real-world problems with clean, efficient code and love working on products that make a positive impact. Always learning, always improving.',
    images: [
      {
        url: 'https://anassalem.com/og-image.jpg',
        alt: 'My Portfolio Open Graph Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anas Salem',
    description:
      'I’m a Software Engineer with a passion for building scalable web applications and intuitive user experiences. I specialize in both front-end and back-end development, using modern technologies like JavaScript, TypeScript, React, Node.js, and Laravel. I enjoy solving real-world problems with clean, efficient code and love working on products that make a positive impact. Always learning, always improving.',
    images: ['https://anassalem.com/og-image.jpg'],
    creator: '@An_xr7',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  metadataBase: new URL('https://anassalem.com'),
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
      <ReactLenis
        root
        options={{
          lerp: 0.12,
          smoothWheel: true,
          wheelMultiplier: 1.2,
          touchMultiplier: 1,
        }}>
        <body
          className={`${inter.variable} ${tajawal.variable} ${
            isArabic ? 'font-tajawal' : 'font-inter'
          } antialiased min-h-screen`}>
          <NextIntlClientProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange>
              <Header />
              <ScrollProgressProvider>
                {children}
                <Toaster />
              </ScrollProgressProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </ReactLenis>
    </html>
  )
}
