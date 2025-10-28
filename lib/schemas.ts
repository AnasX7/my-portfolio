import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'

export const getFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    fullName: z
      .string()
      .min(2, { message: t(DATA.contact.form.fullName.minKey, { min: 2 }) })
      .max(50, { message: t(DATA.contact.form.fullName.maxKey, { max: 50 }) }),
    email: z.email({ message: t(DATA.contact.form.email.requiredKey) }),
    message: z
      .string()
      .min(2, { message: t(DATA.contact.form.message.minKey, { min: 2 }) }),
  })

export type formData = z.infer<ReturnType<typeof getFormSchema>>
