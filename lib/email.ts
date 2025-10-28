'use server'

import { EmailTemplate } from '@/components/ui/email-template'
import { Resend } from 'resend'
import { formData } from '@/lib/schemas'
import { verifyTurnstileToken } from '@/lib/turnstile'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function send(emailFormData: formData, turnstileResponse: string) {
  try {
    const verificationResult = await verifyTurnstileToken(
      turnstileResponse,
      process.env.TURNSTILE_SECRET_KEY!
    )

    if (!verificationResult.success) {
      throw new Error('Turnstile verification failed')
    }

    const { fullName, email, message } = emailFormData

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_TO!,
      subject: `New contact from ${fullName}`,
      react: await EmailTemplate({
        fullName,
        email,
        message,
      }),
      text: `Hello, you have a new contact from ${fullName} (${email}) with the following message: ${message}`,
    })

    if (error) {
      throw error
    }
  } catch (e) {
    throw e
  }
}
