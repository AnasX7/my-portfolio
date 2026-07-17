'use client'

import { useEffect, useRef, useCallback, type BaseSyntheticEvent } from 'react'
import { getFormSchema, formData } from '@/lib/schemas'
import Script from 'next/script'
import { useTheme } from 'next-themes'

import { Card, CardContent, CardDecorator } from '@/components/ui/card'
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
import { PaperPlane } from '@/components/icons/paper-plane'
import { useTranslations, useLocale } from 'next-intl'
import { m, useInView } from 'motion/react'

import { z } from 'zod'
import { send } from '@/lib/email'
import { toast } from 'sonner'

import { DATA } from '@/data/resume'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!

export default function ContactForm() {
  const t = useTranslations()
  const formSchema = getFormSchema(t)

  const local = useLocale()
  const isRtl = local === 'ar'

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  })

  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const shouldLoadTurnstile = useInView(formRef, { once: true, margin: '300px 0px' })

  // Explicitly render Turnstile widget
  const renderWidget = useCallback(() => {
    const turnstile = (window as any).turnstile
    if (turnstile && containerRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        })
      } catch (err) {
        console.error('Error rendering Turnstile widget:', err)
      }
    }
  }, [resolvedTheme])

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
  }, [resolvedTheme, renderWidget])

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
    <Card className='bg-card relative overflow-hidden shadow-md transition-all duration-300 hover:scale-[1.005] hover:brightness-[1.03] dark:shadow-2xl'>
      <CardDecorator />
      <CardContent className='grid grid-rows-1 gap-8 lg:grid-cols-2 lg:grid-rows-none'>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(DATA.contact.form.fullName.labelKey)}</FormLabel>
                    <FormControl>
                      <Input
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
                    <FormLabel>{t(DATA.contact.form.email.labelKey)}</FormLabel>
                    <FormControl>
                      <Input placeholder={t(DATA.contact.form.email.placeholderKey)} {...field} />
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
                    <FormLabel>{t(DATA.contact.form.message.labelKey)}</FormLabel>
                    <FormControl>
                      <Textarea
                        id='message'
                        placeholder={t(DATA.contact.form.message.placeholderKey)}
                        className='min-h-30'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div ref={containerRef} />
            {shouldLoadTurnstile ? (
              <Script
                src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
                strategy='lazyOnload'
                onLoad={renderWidget}
              />
            ) : null}
            <Button type='submit' variant='animated' className='w-full'>
              {t(DATA.contact.form.submitKey)}
            </Button>
          </form>
        </Form>

        {/*  Illustration */}
        <m.div
          initial={{
            opacity: 0,
            x: isRtl ? -20 : 20,
            scale: 0.95,
          }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className='bg-muted/45 border-border hidden flex-col items-center justify-center rounded-xl border-2 p-6 text-center shadow-md lg:flex'
        >
          <m.div
            initial={{ y: 0 }}
            whileInView={{ y: [0, -10, 0] }}
            transition={{ duration: 2.4, repeat: 2, ease: 'easeInOut' }}
            viewport={{ once: true, amount: 0.5 }}
            className='mb-4 size-48'
          >
            <PaperPlane className={`${isRtl && 'rotate-270'}`} />
          </m.div>
          <h3 className='text-foreground mb-2 text-xl font-semibold text-balance'>
            {t(DATA.contact.Illustration.titleKey)}
          </h3>
          <p className='text-muted-foreground max-w-xs text-sm text-pretty'>
            {t(DATA.contact.Illustration.subtitleKey)}
          </p>
        </m.div>
      </CardContent>
    </Card>
  )
}
