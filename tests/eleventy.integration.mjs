import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const HTML_PATH = path.join(ROOT, 'fixtures/eleventy/dist/index.html')

test('eleventy plugin injects styles and runtime inside head', () => {
  let html = readFileSync(HTML_PATH, 'utf8')
  let headStart = html.search(/<head\b[^>]*>/i)
  let headEnd = html.toLowerCase().lastIndexOf('</head>')
  let head = headStart === -1 ? '' : html.slice(headStart, headEnd)

  assert.ok(headStart !== -1 && headEnd > headStart, 'page has a head')

  assert.match(
    html,
    /<script>window\.example = "<\/head>"<\/script>/,
    'a closing head tag inside raw script text is left untouched'
  )

  assert.match(
    head,
    /<style[^>]*>[\s\S]*?ples-shown[\s\S]*?<\/style>/i,
    'ples styles are inline inside head'
  )

  assert.match(
    head,
    /<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?pagereveal[\s\S]*?<\/script>/i,
    'runtime is an inline script inside head'
  )
  assert.doesNotMatch(
    head,
    /<script[^>]*type=(["'])module\1[^>]*>[\s\S]*?pagereveal/i,
    'runtime is not a module script'
  )
  assert.doesNotMatch(
    html,
    /<script[^>]*\bsrc=[^>]*runtime/i,
    'runtime is not loaded as a separate request'
  )

  let runtimeMatches =
    html.match(/addEventListener\([`'"]pagereveal[`'"]/g) ?? []
  assert.equal(runtimeMatches.length, 1, 'runtime is present once')
})
