import 'server-only'

export async function verifyTurnstileToken(token: string, secretKey: string) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    }
  )

  return await response.json()
}
