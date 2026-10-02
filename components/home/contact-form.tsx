'use client'

import {
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
  type BaseSyntheticEvent,
} from 'react'
import { getFormSchema, formData } from '@/lib/schemas'
import Script from 'next/script'

import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useTranslations } from 'next-intl'
import { useInView } from 'motion/react'

import { z } from 'zod'
import { send } from '@/lib/email'
import { toast } from 'sonner'

import { DATA } from '@/data/resume'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!

const subscribeThemeClass = (onStoreChange: () => void) => {
  if (typeof document === 'undefined') {
    return () => {}
  }

  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => observer.disconnect()
}

const getThemeSnapshot = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

const getServerThemeSnapshot = () => false

export default function ContactForm() {
  const t = useTranslations()
  const formSchema = getFormSchema(t)

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  })

  const isDark = useSyncExternalStore(subscribeThemeClass, getThemeSnapshot, getServerThemeSnapshot)
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const shouldLoadTurnstile = useInView(formRef, { once: true, margin: '300px 0px' })

  // Explicitly render Turnstile widget
  const renderWidget = useCallback(() => {
    const turnstile = (window as any).turnstile
    if (turnstile && containerRef.current && !widgetIdRef.current) {
      try {
        containerRef.current.innerHTML = ''
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: isDark ? 'dark' : 'light',
          appearance: 'interaction-only',
        })
      } catch (err) {
        console.error('Error rendering Turnstile widget:', err)
      }
    }
  }, [isDark])

  useEffect(() => {
    // If turnstile script is already loaded, render/re-render
    const turnstile = (window as any).turnstile
    if (turnstile) {
      renderWidget()
    }

    return () => {
      // Clean up widget instance when component unmounts or theme changes
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          ;(window as any).turnstile.remove(widgetIdRef.current)
        } catch (err) {
          console.error('Error removing Turnstile widget:', err)
        }
        widgetIdRef.current = null
      }
    }
  }, [isDark, renderWidget])

  async function onSubmit(values: z.infer<typeof formSchema>, event?: BaseSyntheticEvent) {
    const formElement = event?.target
    const submittedFormData =
      formElement instanceof HTMLFormElement ? new FormData(formElement) : null
    const turnstileResponse = submittedFormData?.get('cf-turnstile-response')

    if (typeof turnstileResponse !== 'string' || turnstileResponse.length === 0) {
      toast.error(t(DATA.toast.errorKey))
      return
    }

    const sendPromise = send(values, turnstileResponse)
    toast.promise(sendPromise, {
      loading: t(DATA.toast.loadingKey),
      success: () => t(DATA.toast.successKey),
      error: () => t(DATA.toast.errorKey),
    })

    const isSent = await sendPromise.then(() => true).catch(() => false)

    // Reset Turnstile token after form submission attempt (success or failure)
    if (widgetIdRef.current && (window as any).turnstile) {
      try {
        ;(window as any).turnstile.reset(widgetIdRef.current)
      } catch (err) {
        console.error('Error resetting Turnstile widget:', err)
      }
    }

    if (!isSent) {
      return
    }

    form.reset()
  }

  return (
    <div id='contact-form' className='contact-panel scroll-mt-24 rounded-[2.5rem] p-6 sm:p-10'>
      <h3 className='mb-8 text-3xl leading-tight font-semibold sm:text-4xl'>
        {t('contact.title')}
      </h3>
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>
                    {t(DATA.contact.form.fullName.labelKey)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='name'
                      className='contact-input h-16 rounded-2xl px-5 md:text-base'
                      placeholder={t(DATA.contact.form.fullName.placeholderKey)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>{t(DATA.contact.form.email.labelKey)}</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      autoComplete='email'
                      dir='ltr'
                      className='contact-input h-16 rounded-2xl px-5 md:text-base rtl:placeholder:text-right'
                      placeholder={t(DATA.contact.form.email.placeholderKey)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='sr-only'>{t(DATA.contact.form.message.labelKey)}</FormLabel>
                  <FormControl>
                    <Textarea
                      id='message'
                      placeholder={t(DATA.contact.form.message.placeholderKey)}
                      className='contact-input min-h-40 rounded-2xl px-5 py-5 md:text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div key={isDark ? 'dark' : 'light'} ref={containerRef} />
          {shouldLoadTurnstile ? (
            <Script
              src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
              strategy='lazyOnload'
              onLoad={renderWidget}
            />
          ) : null}
          <Button
            type='submit'
            variant='inverse'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='w-full'
          >
            {t(DATA.contact.form.submitKey)}
          </Button>
        </form>
      </Form>
    </div>
  )
}
