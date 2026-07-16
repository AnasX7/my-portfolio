import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const repoRoot = new URL('../../', import.meta.url)

async function read(relativePath) {
  return readFile(new URL(relativePath, repoRoot), 'utf8')
}

test('mobile menu trigger exposes disclosure state and a 44px press target', async () => {
  const source = await read('components/header.tsx')
  const trigger = source.match(/<m\.button[\s\S]*?header\.toggleMenu[\s\S]*?<\/m\.button>/)?.[0]

  assert.ok(trigger)
  assert.match(trigger, /ref=\{mobileMenuTriggerRef\}/)
  assert.match(trigger, /type='button'/)
  assert.match(trigger, /setIsMobileMenuOpen\(\(isOpen\) => !isOpen\)/)
  assert.match(trigger, /\bsize-11\b/)
  assert.match(trigger, /whileTap=\{\{ scale: 0\.96 \}\}/)
  assert.match(trigger, /aria-expanded=\{isMobileMenuOpen\}/)
  assert.match(trigger, /aria-controls=\{mobileMenuId\}/)
})

test('mobile menu is a named modal dialog with logical placement', async () => {
  const source = await read('components/header.tsx')
  const panel = source.match(/<m\.div\s+ref=\{mobileMenuPanelRef\}[\s\S]*?>/)?.[0]

  assert.match(source, /const mobileMenuId = useId\(\)/)
  assert.match(source, /const mobileMenuTitleId = useId\(\)/)
  assert.match(source, /<AnimatePresence initial=\{false\}>/)
  assert.match(source, /aria-hidden='true'[\s\S]*?onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}/)
  assert.ok(panel)
  assert.match(panel, /ref=\{mobileMenuPanelRef\}/)
  assert.match(panel, /id=\{mobileMenuId\}/)
  assert.match(panel, /role='dialog'/)
  assert.match(panel, /aria-modal='true'/)
  assert.match(panel, /aria-labelledby=\{mobileMenuTitleId\}/)
  assert.match(panel, /tabIndex=\{-1\}/)
  assert.match(panel, /\bfixed\b/)
  assert.match(panel, /\btop-14\b/)
  assert.match(panel, /\bend-4\b/)
  assert.doesNotMatch(panel, /\bright-4\b/)
  assert.match(
    source,
    /<h2 id=\{mobileMenuTitleId\} className='sr-only'>\s*\{t\('header\.mobileMenu'\)\}\s*<\/h2>/,
  )
})

test('open mobile menu owns focus, keyboard containment, scroll lock, and focus return', async () => {
  const source = await read('components/header.tsx')
  const focusEffect = source.match(
    /useEffect\(\(\) => \{\s*if \(!isMobileMenuOpen\) return[\s\S]*?\}, \[isMobileMenuOpen\]\)/,
  )?.[0]

  assert.match(source, /const mobileMenuTriggerRef = useRef<HTMLButtonElement>\(null\)/)
  assert.match(source, /const mobileMenuPanelRef = useRef<HTMLDivElement>\(null\)/)
  assert.ok(focusEffect)
  assert.match(focusEffect, /const panel = mobileMenuPanelRef\.current/)
  assert.match(focusEffect, /const trigger = mobileMenuTriggerRef\.current/)
  assert.match(focusEffect, /const previousBodyOverflow = document\.body\.style\.overflow/)
  assert.match(
    focusEffect,
    /a\[href\], button:not\(\[disabled\]\), \[tabindex\]:not\(\[tabindex="-1"\]\)/,
  )
  assert.match(focusEffect, /focusableElements\[0\]\?\.focus\(\)/)
  assert.match(focusEffect, /document\.body\.style\.overflow = 'hidden'/)
  assert.match(
    focusEffect,
    /if \(event\.key === 'Escape'\) \{\s*event\.preventDefault\(\)\s*setIsMobileMenuOpen\(false\)/,
  )
  assert.match(focusEffect, /event\.key !== 'Tab'/)
  assert.match(
    focusEffect,
    /currentFocusableElements\.length === 0[\s\S]*?event\.preventDefault\(\)[\s\S]*?panel\.focus\(\)/,
  )
  assert.match(
    focusEffect,
    /event\.shiftKey && document\.activeElement === firstFocusable[\s\S]*?lastFocusable\?\.focus\(\)/,
  )
  assert.match(
    focusEffect,
    /!event\.shiftKey && document\.activeElement === lastFocusable[\s\S]*?firstFocusable\?\.focus\(\)/,
  )
  assert.match(focusEffect, /document\.addEventListener\('keydown', handleKeyDown\)/)
  assert.match(focusEffect, /document\.removeEventListener\('keydown', handleKeyDown\)/)
  assert.match(focusEffect, /document\.body\.style\.overflow = previousBodyOverflow/)
  assert.match(focusEffect, /focusTarget\?\.focus\(\)/)
})

test('open mobile menu isolates the header and recaptures escaped focus', async () => {
  const source = await read('components/header.tsx')
  const header = source.match(/<m\.header[\s\S]*?>/)?.[0]
  const focusEffect = source.match(
    /useEffect\(\(\) => \{\s*if \(!isMobileMenuOpen\) return[\s\S]*?\}, \[isMobileMenuOpen\]\)/,
  )?.[0]

  assert.ok(header)
  assert.match(header, /inert=\{isMobileMenuOpen\}/)
  assert.match(header, /isMobileMenuOpen \? 'pointer-events-none' : ''/)
  assert.ok(focusEffect)
  assert.match(
    focusEffect,
    /if \(!panel\.contains\(document\.activeElement\)\) \{\s*event\.preventDefault\(\)\s*;?\(event\.shiftKey \? lastFocusable : firstFocusable\)\?\.focus\(\)\s*return/,
  )
})

test('mobile menu closes when the viewport crosses into the desktop breakpoint', async () => {
  const source = await read('components/header.tsx')
  const responsiveEffect = source.match(
    /useEffect\(\(\) => \{\s*const desktopMediaQuery = window\.matchMedia\(DESKTOP_MEDIA_QUERY\)[\s\S]*?\}, \[\]\)/,
  )?.[0]

  assert.match(source, /const DESKTOP_MEDIA_QUERY = '\(min-width: 64rem\)'/)
  assert.ok(responsiveEffect)
  assert.match(
    responsiveEffect,
    /const handleDesktopChange = \(event: MediaQueryListEvent\) => \{\s*if \(event\.matches\) setIsMobileMenuOpen\(false\)\s*\}/,
  )
  assert.match(
    responsiveEffect,
    /desktopMediaQuery\.addEventListener\('change', handleDesktopChange\)/,
  )
  assert.match(
    responsiveEffect,
    /desktopMediaQuery\.removeEventListener\('change', handleDesktopChange\)/,
  )
})

test('desktop breakpoint close returns focus to the visible header home control', async () => {
  const source = await read('components/header.tsx')
  const homeButton = source.match(
    /<button\s+ref=\{headerHomeRef\}[\s\S]*?scrollTo\(0,[\s\S]*?<\/button>/,
  )?.[0]
  const focusEffect = source.match(
    /useEffect\(\(\) => \{\s*if \(!isMobileMenuOpen\) return[\s\S]*?\}, \[isMobileMenuOpen\]\)/,
  )?.[0]

  assert.match(source, /const headerHomeRef = useRef<HTMLButtonElement>\(null\)/)
  assert.ok(homeButton)
  assert.doesNotMatch(homeButton, /\bhidden\b/)
  assert.ok(focusEffect)
  assert.match(focusEffect, /const headerHome = headerHomeRef\.current/)
  assert.match(
    focusEffect,
    /const focusTarget = window\.matchMedia\(DESKTOP_MEDIA_QUERY\)\.matches\s*\? headerHome\s*: trigger/,
  )
  assert.match(focusEffect, /focusTarget\?\.focus\(\)/)
})

test('mobile menu enters nearby and exits with a softer upward transition', async () => {
  const source = await read('components/header.tsx')
  const variants = source.match(/const mobileMenuVariants: Variants = \{[\s\S]*?\n  \}/)?.[0]

  assert.ok(variants)
  assert.match(variants, /closed: \{\s*opacity: 0,\s*x: 24,\s*filter: 'blur\(4px\)'/)
  assert.match(variants, /open: \{\s*opacity: 1,\s*x: 0,\s*filter: 'blur\(0px\)'/)
  assert.match(variants, /staggerChildren: 0\.1/)
  assert.match(
    variants,
    /exit: \{\s*opacity: 0,\s*y: -12,\s*filter: 'blur\(4px\)',\s*transition: \{\s*duration: 0\.15,\s*ease: 'easeIn'/,
  )
  assert.match(source, /initial='closed'\s*animate='open'\s*exit='exit'/)
  assert.doesNotMatch(variants, /x: '100%'/)
})

test('mobile menu dialog label is localized in English and Arabic', async () => {
  const [english, arabic] = await Promise.all([read('messages/en.json'), read('messages/ar.json')])

  assert.equal(JSON.parse(english).header.mobileMenu, 'Primary navigation')
  assert.equal(JSON.parse(arabic).header.mobileMenu, 'التنقل الرئيسي')
})
