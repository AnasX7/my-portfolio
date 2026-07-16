import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const [validInput, shortName, longName, malformedEmail, shortMessage, trimmedInput] = JSON.parse(
  execFileSync(
    'bun',
    [
      '-e',
      `
        import { contactInputSchema } from './lib/schemas.ts'

        const inputs = [
          { fullName: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello from the contact form.' },
          { fullName: 'A', email: 'ada@example.com', message: 'Hello' },
          { fullName: 'A'.repeat(51), email: 'ada@example.com', message: 'Hello' },
          { fullName: 'Ada Lovelace', email: 'not-an-email', message: 'Hello' },
          { fullName: 'Ada Lovelace', email: 'ada@example.com', message: 'A' },
          { fullName: '  Ada Lovelace  ', email: 'ada@example.com', message: '  Hello from the contact form.  ' },
        ]

        console.log(JSON.stringify(inputs.map((input) => {
          const result = contactInputSchema.safeParse(input)
          return result.success ? { success: true, data: result.data } : { success: false }
        })))
      `,
    ],
    { cwd: projectRoot, encoding: 'utf8' },
  ),
)

test('accepts valid contact input', () => {
  assert.equal(validInput.success, true)
})

test('rejects a name shorter than two characters', () => {
  assert.equal(shortName.success, false)
})

test('rejects a name longer than fifty characters', () => {
  assert.equal(longName.success, false)
})

test('rejects a malformed email address', () => {
  assert.equal(malformedEmail.success, false)
})

test('rejects a message shorter than two characters', () => {
  assert.equal(shortMessage.success, false)
})

test('trims surrounding whitespace from names and messages', () => {
  assert.equal(trimmedInput.success, true)
  assert.deepEqual(trimmedInput.data, {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Hello from the contact form.',
  })
})
