// Run after `pnpm build`. Render the generated HTML at 1200×630 in a browser
// and save each JPEG to public/images/og/{en,ar}.jpg. Browser rendering preserves
// Thmanyah's Arabic shaping and uses the same Inter font as the website.
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.cwd()
const output = process.argv[2] ?? '/tmp/portfolio-social-previews'
const styles = await readdir(join(root, '.next/static/chunks'))
let interPath
for (const file of styles.filter((file) => file.endsWith('.css'))) {
  const css = await readFile(join(root, '.next/static/chunks', file), 'utf8')
  interPath ??= css.match(
    /font-family:Inter;[^}]*src:url\(\.\.\/media\/([^)]*)\)[^}]*unicode-range:U\+\?\?/i,
  )?.[1]
}
if (!interPath) throw new Error('Build the portfolio first to load its Inter font.')
const data = async (file, type) =>
  `data:${type};base64,${(await readFile(join(root, file))).toString('base64')}`
const inter = await data(`.next/static/media/${interPath}`, 'font/woff2')
const regular = await data('app/fonts/thmanyahsans-Regular.woff2', 'font/woff2')
const bold = await data('app/fonts/thmanyahsans-Bold.woff2', 'font/woff2')
const portrait = await data('public/avatar-light.jpg', 'image/jpeg')
await mkdir(output, { recursive: true })
for (const locale of ['en', 'ar']) {
  const messages = JSON.parse(await readFile(join(root, `messages/${locale}.json`), 'utf8'))
  const ar = locale === 'ar'
  const html = `<!doctype html><html lang="${locale}" dir="${ar ? 'rtl' : 'ltr'}"><meta charset="utf-8"><title>${messages.common.name} — Social preview</title>
<style>
@font-face{font-family:Inter;src:url('${inter}');font-weight:100 900}
@font-face{font-family:Thmanyah;src:url('${regular}');font-weight:400}
@font-face{font-family:Thmanyah;src:url('${bold}');font-weight:700}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{font-family:${ar ? 'Thmanyah' : 'Inter'},sans-serif;background:#101011;color:#faf9f6}
html[lang='ar']{font-feature-settings:'salt' 1}
.card{position:relative;width:1200px;height:630px;padding:80px;display:flex;flex-direction:column;justify-content:space-between;isolation:isolate}
.pattern-clip{position:absolute;inset:48px;z-index:-2;mask-image:linear-gradient(to right,transparent,black 12%,black 88%,transparent)}
.pattern{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect x='0' y='0' width='120' height='120' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1' rx='12' ry='12'/%3E%3C/svg%3E");mask-image:linear-gradient(to bottom,transparent 0%,black 40%,black 60%,transparent 100%)}
.frame{position:absolute;inset:0 48px;z-index:-1;border-inline:1px dashed #303034}
.frame-line{position:absolute;left:0;right:0;top:48px;border-top:1px dashed #303034;z-index:-1}.frame-line.bottom-line{top:auto;bottom:48px}
.joint{position:absolute;top:-8px;width:16px;height:16px;background:radial-gradient(circle 8px at 0 0,transparent 7px,#303034 7px 8px,transparent 8px),radial-gradient(circle 8px at 100% 0,transparent 7px,#303034 7px 8px,transparent 8px),radial-gradient(circle 8px at 100% 100%,transparent 7px,#303034 7px 8px,transparent 8px),radial-gradient(circle 8px at 0 100%,transparent 7px,#303034 7px 8px,transparent 8px),#101011}.joint.left{left:40px}.joint.right{right:40px}
.glow{position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse 440px 360px at ${ar ? '20%' : '80%'} 50%,#d2c4a014,transparent)}
.identity{display:flex;align-items:center;gap:22px}.portrait{width:88px;height:88px;border-radius:22px;object-fit:cover;border:1px solid #ffffff1a}
.role{font-size:26px;line-height:1.5}.location{font-size:20px;color:#a4a4a8;margin-top:2px}
h1{font-size:${ar ? '100' : '88'}px;font-weight:700;line-height:1.25;margin:0 0 18px;letter-spacing:${ar ? '0' : '-4'}px}
.tagline{font-size:31px;line-height:1.6;color:#b8b8bd;margin:0}
.bottom{padding-top:24px;display:flex;align-items:center;justify-content:space-between;font-size:21px;color:#a4a4a8}
.domain{font-family:Inter,sans-serif}.label{font-size:17px}.mark{color:#d2c4a0;margin-inline-end:10px}
</style><main class="card"><div class="pattern-clip"><div class="pattern"></div></div><div class="glow"></div>
<div class="frame"></div><div class="frame-line"><i class="joint left"></i><i class="joint right"></i></div><div class="frame-line bottom-line"><i class="joint left"></i><i class="joint right"></i></div>
<div class="identity"><img class="portrait" src="${portrait}" alt=""><div><div class="role">${messages.common.role}</div><div class="location">${ar ? 'أبوظبي، الإمارات العربية المتحدة' : 'Abu Dhabi, UAE'}</div></div></div>
<div><h1>${messages.common.name}</h1><p class="tagline">${messages.hero.title} ${messages.hero.highlight}</p></div>
<div class="bottom"><span class="domain" dir="ltr">anassalem.com</span><span class="label"><span class="mark">✦</span>${ar ? 'ملفي الشخصي وأعمالي' : 'Personal portfolio & selected work'}</span></div></main></html>`
  await writeFile(join(output, `${locale}.html`), html)
}
console.log(`Preview source written to ${output}`)
