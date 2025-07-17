import { FolderGit2, Medal } from 'lucide-react'

export const DATA = {
  profile: {
    nameKey: 'common.name',
    initialsKey: 'common.initials',
    roleKey: 'common.role',
    avatar: '/og-image.jpg',
    resumeURL: 'https://flowcv.com/resume/j9n4st328u',
  },

  navItems: [
    { nameKey: 'header.home', href: '#home' },
    { nameKey: 'header.about', href: '#about' },
    { nameKey: 'header.projects', href: '#projects' },
    { nameKey: 'header.contact', href: '#contact' },
  ],

  hero: {
    welcomeKey: 'hero.welcome',
    titleKey: 'hero.title',
    highlightKey: 'hero.highlight',
    subtitle: 'hero.subtitle',
    cta: 'hero.cta',
  },

  techLogos: {
    titleKey: 'techLogos.title',
  },

  about: {
    titleKey: 'about.title',
    card1: {
      titleKey: 'about.card1.title',
      descriptionKey: 'about.card1.description',
    },
    card2: {
      titleKey: 'about.card2.title',
      analytics: [
        {
          icon: FolderGit2,
          value: 4,
          labelKey: 'about.card2.projects',
          showPlus: true,
        },
        {
          icon: Medal,
          value: 3,
          labelKey: 'about.card2.certificates',
          showPlus: true,
        },
      ],
    },
    card3: {
      titleKey: 'about.card3.title',
    },
    card4: {
      titleKey: 'about.card4.title',
      skills: [
        {
          name: 'Next.js',
          delay: 2500,
        },
        {
          name: 'React',
          delay: 2800,
        },
        {
          name: 'Expo',
          delay: 3100,
        },
        {
          name: 'Tailwindcss',
          delay: 3400,
        },
        {
          name: 'TypeScript',
          delay: 3700,
        },
        {
          name: 'JavaScript',
          delay: 4000,
        },
        {
          name: 'Laravel',
          delay: 4300,
        },
        {
          name: 'Git',
          delay: 4600,
        },
        {
          name: 'GitHub',
          delay: 4900,
        },
        {
          name: 'Figma',
          delay: 5200,
        },
      ],
    },
  },

  timeline: {
    DefaultValue: 3,
    entries: [
      {
        id: 1,
        dateKey: 'timeline.0.date',
        titleKey: 'timeline.0.title',
        descriptionKey: 'timeline.0.description',
      },
      {
        id: 2,
        dateKey: 'timeline.1.date',
        titleKey: 'timeline.1.title',
        descriptionKey: 'timeline.1.description',
      },
      {
        id: 3,
        dateKey: 'timeline.2.date',
        titleKey: 'timeline.2.title',
        descriptionKey: 'timeline.2.description',
      },
      {
        id: 4,
        dateKey: 'timeline.3.date',
        titleKey: 'timeline.3.title',
        descriptionKey: 'timeline.3.description',
      },
    ],
  },
}
