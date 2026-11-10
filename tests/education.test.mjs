import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const exports = {}
const source = ts.transpileModule(
  readFileSync(new URL('../data/resume.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText
runInNewContext(source, { exports, require: () => ({ Icons: {} }) })
const { DATA } = exports
const messages = Object.fromEntries(
  ['en', 'ar'].map((locale) => [
    locale,
    JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8')),
  ]),
)

function translate(locale, key) {
  return key.split('.').reduce((value, part) => value?.[part], messages[locale])
}

test('Mayerfeld frontend practicum uses the verified public credential and issue month', () => {
  const institution = DATA.education.find((item) => item.id === 'mayerfeld-certs')
  assert.ok(institution)
  assert.equal(institution.certifications.length, 1)
  const cert = institution.certifications[0]
  assert.equal(cert.url, 'https://credsverse.com/credentials/9a277f13-659d-4579-a87e-8519ad543460')
  assert.equal(new URL(cert.url).search, '', 'Do not publish recipient or tracking parameters')
  assert.equal(translate('en', institution.institutionKey), 'Mayerfeld Consulting')
  assert.equal(
    translate('en', cert.titleKey),
    'Mayerfeld Consulting Practicum Program - Frontend Development',
  )
  assert.equal(translate('en', cert.dateKey), 'Nov 2026')
  assert.equal(translate('ar', cert.dateKey), 'نوفمبر 2026')
  for (const locale of ['en', 'ar']) {
    assert.ok(
      translate(locale, cert.credentialKey).includes('9a277f13-659d-4579-a87e-8519ad543460'),
    )
  }
})

test('every education entry has complete English and Arabic content', () => {
  for (const item of DATA.education) {
    const keys = [item.institutionKey, item.degreeKey, item.dateKey, item.totalDurationKey]
    for (const cert of item.certifications ?? []) {
      keys.push(cert.titleKey, cert.dateKey, cert.credentialKey)
    }
    for (const key of keys.filter(Boolean)) {
      for (const locale of ['en', 'ar']) {
        const value = translate(locale, key)
        assert.equal(typeof value, 'string', `${locale}: ${key}`)
        assert.ok(value.trim(), `${locale}: ${key} must not be empty`)
      }
    }
  }
})

test('Mayerfeld branding is served locally as a PNG', () => {
  const item = DATA.education.find((entry) => entry.id === 'mayerfeld-certs')
  assert.equal(item.logo, '/images/experience/mayerfeld-consulting.png')
  const logo = readFileSync(new URL(`../public${item.logo}`, import.meta.url))
  assert.deepEqual([...logo.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
})
