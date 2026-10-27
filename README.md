# Anas Salem — Portfolio

My personal portfolio, presenting selected projects, professional experience, and the technologies I work with. Built with Next.js, React, and TypeScript, with English and Arabic support.

[Visit the portfolio](https://anassalem.com) · [English](https://anassalem.com/en) · [العربية](https://anassalem.com/ar)

## Highlights

- English and Arabic routes with right-to-left layouts and localized typography.
- Project case studies with image galleries, alongside work experience and education.
- A GitHub contribution heatmap covering the last 12 months.
- A portrait-based header mascot that follows the cursor and reacts to clicks, with artwork for both themes.
- Light and dark themes, a scroll-driven portrait, and a custom animated signature rendered from Blender artwork.
- Reduced-motion support and animation fallbacks for unsupported browser APIs.
- A contact form with Zod validation, server-side Cloudflare Turnstile verification, and email delivery through Resend.
- Localized canonical URLs, social previews, structured data, and a generated sitemap.

## Stack

Next.js App Router · React · TypeScript · Tailwind CSS · next-intl · Motion · React Hook Form · Zod · Resend

## Explore the code

| Area                                    | Location                                                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Localized pages and project routes      | [`app/[locale]/`](app/%5Blocale%5D/)                                                                                                       |
| Homepage sections                       | [`components/home/sections/`](components/home/sections/)                                                                                   |
| Portrait animation and browser fallback | [`portrait-journey.tsx`](components/home/portrait-journey.tsx), [`portrait-native-journey.ts`](components/home/portrait-native-journey.ts) |
| Production artwork                      | [`public/brand/`](public/brand/), [`public/mascots/`](public/mascots/)                                                                     |
| Third-party licenses                    | [`licenses/`](licenses/)                                                                                                                   |
| Profile and project content             | [`data/resume.ts`](data/resume.ts), [`messages/`](messages/)                                                                               |
| Contact delivery and verification       | [`lib/email.ts`](lib/email.ts), [`lib/turnstile.ts`](lib/turnstile.ts)                                                                     |
| Motion behavior and SEO tests           | [`tests/`](tests/)                                                                                                                         |

## Run locally

Use Node.js **24.22.1** and pnpm **12.15.0**, pinned in `.nvmrc` and `package.json`.

```bash
git clone https://github.com/AnasX7/my-portfolio.git
cd my-portfolio
nvm install
nvm use
```

With pnpm installed:

```bash
pnpm install --frozen-lockfile
cp .example.env .env.local
```

Fill in `.env.local` before starting the app:

| Variable                         | Purpose                                                               |
| -------------------------------- | --------------------------------------------------------------------- |
| `SITE_URL`                       | Absolute site URL; use `http://localhost:3000` for local development. |
| `RESEND_API_KEY`                 | Server-side Resend API key for contact emails.                        |
| `EMAIL_TO`                       | Recipient of contact form messages.                                   |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Turnstile site key configured for the development hostname.    |
| `TURNSTILE_SECRET_KEY`           | Server-side Turnstile secret for token verification.                  |

```bash
pnpm dev
```

Open [localhost:3000/en](http://localhost:3000/en) or [localhost:3000/ar](http://localhost:3000/ar).

For production, set `SITE_URL` to the deployed origin and configure the contact sender in [`lib/email.ts`](lib/email.ts) for your Resend account and sending domain. Keep secret keys in environment variables.

GitHub activity uses the public [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api), cached on the server for one hour. It uses the GitHub profile in `data/resume.ts` and requires no token. If the service is unavailable, the section keeps a link to GitHub instead of displaying fabricated activity.

## Checks and production build

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
pnpm start
```

Tests cover motion sequencing, cleanup and fallbacks, localized SEO metadata, sitemap URLs, and structured data serialization. Oxfmt handles formatting and Oxlint handles linting.
