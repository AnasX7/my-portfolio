'use client'

import { useEffect, useRef } from 'react'
import { getFormSchema, formData } from '@/lib/schemas'

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
import { motion } from 'motion/react'

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

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      )
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const turnstileInput = formRef.current?.querySelector(
        'input[name="cf-turnstile-response"]'
      ) as HTMLInputElement | null

      const turnstileResponse = turnstileInput?.value

      if (!turnstileResponse) {
        toast.error(t(DATA.toast.errorKey))
        return
      }

      const promiseWrapper = toast.promise(send(values, turnstileResponse), {
        loading: t(DATA.toast.loadingKey),
        success: () => t(DATA.toast.successKey),
      })

      await promiseWrapper.unwrap()
      form.reset()
    } catch {
      toast.error(t(DATA.toast.errorKey))
    }
  }

  return (
    <Card className='relative bg-card/65 rounded-none'>
      <CardDecorator />
      <CardContent className='grid grid-rows-1 lg:grid-rows-none lg:grid-cols-2 gap-8'>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'>
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(DATA.contact.form.fullName.labelKey)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          DATA.contact.form.fullName.placeholderKey
                        )}
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
                      <Input
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
                    <FormLabel>
                      {t(DATA.contact.form.message.labelKey)}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id='message'
                        placeholder={t(
                          DATA.contact.form.message.placeholderKey
                        )}
                        className='min-h-[120px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className='cf-turnstile'
              data-sitekey={TURNSTILE_SITE_KEY}></div>
            <Button type='submit' variant='animated' className='w-full'>
              {t(DATA.contact.form.submitKey)}
            </Button>
          </form>
        </Form>

        {/*  Illustration */}
        <motion.div
          initial={{
            opacity: 0,
            x: isRtl ? -20 : 20,
            scale: 0.95,
            filter: 'blur(10px)',
          }}
          whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className='hidden lg:flex flex-col justify-center items-center text-center p-6 bg-muted/45 border-2 border-border rounded-4xl shadow-md'>
          <div className='w-48 h-48 mb-4 animate-bounce animation-duration-[3000ms]'>
            <PaperPlane className={`${isRtl && 'rotate-270'}`} />
          </div>
          <h3 className='text-xl font-semibold text-foreground mb-2'>
            {t(DATA.contact.Illustration.titleKey)}
          </h3>
          <p className='text-muted-foreground text-sm max-w-xs'>
            {t(DATA.contact.Illustration.subtitleKey)}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
}
