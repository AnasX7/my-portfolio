# Motion Performance Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Preserve the portfolio's visual character while making scrolling and animation stable on iPhones, touch devices, and Reduced Motion configurations.

**Architecture:** Replace the JavaScript-driven project card stack with a CSS sticky enhancement that only activates for fine pointers without Reduced Motion. Centralize motion capability detection so Lenis does not run its animation loop on touch or Reduced Motion devices, configure Motion globally to honor user preferences, and remove or defer filter-heavy and always-running effects.

**Tech Stack:** Next.js 16, React 19, TypeScript, Motion for React, Lenis, Tailwind CSS, Node test runner, Playwright CLI.

---

### Task 1: Lock in motion policy behavior

**Files:**

- Create: `lib/motion-policy.test.mjs`
- Create: `lib/motion-policy.ts`
- Create: `components/smooth-scroll-provider.tsx`
- Modify: `components/motion-provider.tsx`
- Modify: `app/[locale]/layout.tsx`
- Modify: `components/header.tsx`
- Modify: `components/footer.tsx`

1. Add failing tests proving smooth scrolling is disabled for Reduced Motion and coarse pointers.
2. Run `node --test lib/motion-policy.test.mjs` and confirm failure because the policy module is missing.
3. Implement the pure policy helper and client smooth-scroll provider.
4. Configure Motion with `reducedMotion='user'` and route header/footer navigation through native scrolling when Lenis is disabled.
5. Re-run the focused test and `npx tsc --noEmit`.

### Task 2: Replace the project scroll loop

**Files:**

- Create: `components/ui/scroll-stack.test.mjs`
- Modify: `components/ui/scroll-stack.tsx`
- Modify: `components/ui/scroll-stack.css`
- Modify: `components/home/sections/projects.tsx`

1. Add failing source-contract tests requiring fine-pointer/no-reduced-motion media guards and forbidding scroll listeners, Lenis, filters, perspective, and permanent `will-change`.
2. Run the focused test and confirm it fails against the current implementation.
3. Reduce `ScrollStack` to semantic wrappers with indexed CSS custom properties.
4. Implement normal-flow mobile cards and CSS sticky desktop cards.
5. Re-run the focused test and typecheck.

### Task 3: Remove always-running and filter-heavy effects

**Files:**

- Create: `components/ui/effects-performance.test.mjs`
- Modify: `components/ui/scroll-reveal.tsx`
- Modify: `components/ui/scroll-reveal.css`
- Modify: `components/ui/button.tsx`
- Modify: `app/globals.css`
- Modify: `components/home/sections/hero.tsx`
- Modify: `components/footer.tsx`
- Modify: `components/home/contact-form.tsx`
- Modify: `components/home/sections/contact.tsx`
- Modify: `components/home/about-motion.ts`

1. Add failing contracts proving GSAP, per-button particle nodes, and scroll-reveal filters are absent.
2. Run the focused test and confirm it fails for the current effects.
3. Replace the word-by-word GSAP reveal with one Motion opacity/translate reveal.
4. Remove particle nodes and infinite shine loops; use finite or viewport-scoped motion.
5. Defer Turnstile until the form approaches the viewport.
6. Remove blur filters from common section entrance variants.
7. Re-run tests and typecheck.

### Task 4: Verify the complete experience

**Files:**

- Modify: `package.json`
- Verify: all files above

1. Add `test` and `typecheck` scripts.
2. Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm format:check`.
3. Run `pnpm build` outside the sandbox as required by `AGENTS.md`.
4. Inspect English and Arabic home pages at desktop and iPhone-sized widths.
5. Emulate Reduced Motion and verify project cards have no transforms and Lenis is inactive.
6. Confirm the unrelated `public/images/projects/gtk-cash/` files remain untouched.
