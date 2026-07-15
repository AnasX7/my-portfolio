# Project Editorial Showcase Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign every localized `/projects/[slug]` page as an image-led editorial showcase with restrained, accessible motion.

**Architecture:** Keep route-level data loading on the server and pass translated display labels into focused client components. Replace the contained card hero and uniform gallery with a full-width hero, an editorial project summary, and an asymmetric gallery whose lightbox remains tied to the original image URLs.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Motion for React, next-intl, Node test runner.

---

### Task 1: Lock in editorial markup behavior

**Files:**

- Modify: `components/ui/project-gallery.test.ts`
- Create: `components/ui/project-hero.test.ts`

1. Add failing rendering tests for the gallery's numbered editorial figures, accessible image buttons, and original image URLs.
2. Add a failing rendering test for the hero's full-bleed image, project index label, actions, and technology list.
3. Run `node --test components/ui/project-gallery.test.ts components/ui/project-hero.test.ts` and confirm the assertions fail for the missing layout.

### Task 2: Build the cinematic hero

**Files:**

- Modify: `components/ui/project-hero.tsx`
- Modify: `components/ui/project-back-link.tsx`
- Modify: `app/[locale]/projects/[slug]/page.tsx`

1. Replace the card with a viewport-scale image composition and a readable foreground content panel.
2. Animate title, description, actions, and image with Motion transforms and opacity only.
3. Pass localized labels from the server route and preserve optional GitHub, live URL, and demo credential behavior.
4. Add reduced-motion support and RTL-aware icon direction.

### Task 3: Build the editorial gallery and lightbox

**Files:**

- Modify: `components/ui/project-gallery.tsx`

1. Render alternating wide and paired image figures with sequence numbers and captions.
2. Add viewport reveal and restrained hover motion using Motion.
3. Preserve unoptimized original screenshot URLs in thumbnails.
4. Upgrade the lightbox with dialog semantics, Escape handling, scroll locking, explicit close control, and animated presence.

### Task 4: Verify the experience

**Files:**

- Verify: all modified project showcase files

1. Run the focused Node tests and the full test suite.
2. Run formatting and lint checks.
3. Run `pnpm build` outside the sandbox as required by `AGENTS.md`.
4. Inspect a representative English and Arabic project page at desktop and mobile widths.
