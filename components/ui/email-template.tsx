import {
  Html,
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface EmailTemplateProps {
  fullName: string
  email: string
  message: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  email,
  message,
}) => (
  <Html>
    <Head />
    <Preview>New Portfolio Message from {fullName}</Preview>
    <Tailwind>
      <Body className='mx-auto my-auto bg-slate-50 font-sans'>
        <Container className='mx-auto my-[40px] max-w-[465px] rounded border border-solid border-slate-200 bg-white p-[20px] shadow-sm'>
          <Heading className='mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-slate-800'>
            New Contact Message
          </Heading>
          <Text className='text-[14px] leading-[24px] text-slate-700'>Hello Anas,</Text>
          <Text className='text-[14px] leading-[24px] text-slate-700'>
            You received a new message from <strong>{fullName}</strong> (
            <a href={`mailto:${email}`} className='text-blue-600 no-underline'>
              {email}
            </a>
            ) on your portfolio website.
          </Text>
          <Section className='my-[32px] rounded-md border border-solid border-slate-100 bg-slate-50 p-[16px]'>
            <Text className='m-0 text-[14px] leading-[24px] text-slate-600 italic'>
              &ldquo;{message}&rdquo;
            </Text>
          </Section>
          <Hr className='mx-0 my-[26px] border border-solid border-slate-200' />
          <Text className='text-[12px] leading-[18px] text-slate-400'>
            This message was sent via the contact form on your portfolio website.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
