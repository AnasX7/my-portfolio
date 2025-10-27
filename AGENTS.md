# Repository Guidelines

## Project Structure & Module Organization
- `app/[locale]/`: Next.js App Router entry points per locale; layouts wire shared UI, sections live in `components/home`.
- `components/`: Reusable server and client components, case-studied by feature (e.g. `ui/`, `home/sections/`).
- `lib/` & `data/`: Utility helpers and typed content sources consumed by sections.
- `i18n/` & `messages/`: Locale configuration and dictionaries used by `next-intl`.
- `public/`: Static assets, favicons, and images referenced via `next/image`.

## Build, Test, and Development Commands
- `npm install`: Sync dependencies before your first run or after package updates.
- `npm run dev`: Start the Next.js dev server with Turbopack at `http://localhost:3000`.
- `npm run build`: Produce the optimized production bundle; fails on type or lint errors.
- `npm run start`: Serve the production bundle; use to verify deployment behavior.
- `npm run lint`: Run the shared ESLint config (Next + Tailwind rules) to enforce style and catch common issues.

## Coding Style & Naming Conventions
- Use TypeScript with React function components; mark client components via `'use client'` when hooks or browser APIs are used.
- Prefer 2-space indentation, single quotes for strings, and Tailwind utility classes grouped by layout → spacing → color.
- Co-locate variants and utility logic in `lib/` or `components/ui/` and leverage `class-variance-authority` for styled variants when applicable.
- Keep filenames in kebab-case (e.g. `projects-grid.tsx`); colocate supportive assets (SVG, JSON) beside their consumer.

## Testing Guidelines
- Automated tests are not yet configured; at minimum, run `npm run lint` and smoke test key routes (`/`, `/[locale]/projects`) in multiple locales.
- When adding a test setup, prefer colocated component tests (e.g. `components/__tests__/component.test.tsx`) with React Testing Library and ensure they run via an npm script before opening a PR.
- Document any manual verification steps in your PR if new UI states, locales, or forms are introduced.

## Commit & Pull Request Guidelines
- Follow the emerging conventional commit style seen in history (`feat:`, `fix:`, `add ...`); scope commits to one logical change and include affected area when helpful (e.g. `feat(home): add testimonials section`).
- Reference related issues in the PR body, summarize user-facing impact, and attach screenshots or recordings for visual tweaks.
- Flag strings or data updates that require translator review, and call out environment variable changes or new deployment steps.
