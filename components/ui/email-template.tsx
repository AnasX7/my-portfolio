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
  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 16, color: '#333' }}>
    <h1 style={{ fontSize: 24, marginBottom: 16 }}>
      New Contact from {fullName}
    </h1>
    <p style={{ marginBottom: 16 }}>
      <strong>Email:</strong> {email}
    </p>
    <p style={{ marginBottom: 16 }}>
      <strong>Message:</strong>
      <br />
      {message}
    </p>
  </div>
)
