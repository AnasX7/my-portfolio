import { Link } from '@/i18n/navigation'
// import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { Year } from '@/components/ui/year'
import { getTranslations } from 'next-intl/server'

export default async function Footer() {
  const t = await getTranslations()

  return (
    <footer className='py-4 mt-20 sm:mt-32 border-t border-border/50 bg-card/50 shadow-sm backdrop-blur-md rounded-t-4xl'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col-reverse gap-8 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800'>
        <span className='text-muted-foreground block text-center text-sm'>
          {' '}
          © <Year /> 𝓐𝓷𝖆𝔖, {t(DATA.footer.copyrightKey)}
        </span>

        <ul className='flex justify-center gap-6 lg:justify-end'>
          <li>
            <Link
              href='https://www.instagram.com/an_xr7/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
              className='text-muted-foreground transition hover:text-primary block'>
              <svg
                className='size-6'
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3'></path>
              </svg>
            </Link>
          </li>

          <li>
            <Link
              href='https://x.com/An_xr7'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='X/Twitter'
              className='text-muted-foreground transition hover:text-primary block'>
              <svg
                className='size-6'
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z'></path>
              </svg>
            </Link>
          </li>

          <li>
            <Link
              href='https://www.linkedin.com/in/anassalem7/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='text-muted-foreground transition hover:text-primary block'>
              <svg
                className='size-6'
                xmlns='http://www.w3.org/2000/svg'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z'></path>
              </svg>
            </Link>
          </li>

          <li>
            <Link
              href='https://github.com/AnasX7'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='text-muted-foreground transition hover:text-primary block'>
              <svg
                className='size-6'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'>
                <path
                  fillRule='evenodd'
                  d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
