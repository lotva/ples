import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const HTML_PATH = path.join(ROOT, 'fixtures/vite/dist/index.html')

test('vite plugin injects styles and runtime inside head', () => {
  let html = readFileSync(HTML_PATH, 'utf8')
  let head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]

  assert.ok(head, 'page has a head')

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
  assert.doesNotMatch(
    html,
    /timeline-trigger/,
    'scroll CSS is not injected unless the plugin option is set'
  )
})
