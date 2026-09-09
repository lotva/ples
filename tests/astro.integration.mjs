import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..')
const HTML_PATH = path.join(ROOT, 'fixtures/astro/dist/index.html')

test('astro integration injects styles and runtime inside head', () => {
  let html = readFileSync(HTML_PATH, 'utf8')
  let head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]

  assert.ok(head, 'page has a head')

  let hasInlineStylesheet =
    /<style[^>]*>[\s\S]*?ples-shown[\s\S]*?<\/style>/i.test(head)
  let hasLinkedStylesheet = /<link[^>]*rel=(["'])stylesheet\1[^>]*>/i.test(head)

  assert.ok(
    hasInlineStylesheet || hasLinkedStylesheet,
    'ples styles are connected render-blocking inside head'
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
    'scroll CSS is not imported unless the plugin option is set'
  )
  assert.doesNotMatch(
    html,
    /sibling-index/,
    'sequence CSS is not imported unless the plugin option is set'
  )
  assert.match(html, /data-ples-effect=zoom/, 'selected effect CSS is imported')
  assert.doesNotMatch(
    html,
    /data-ples-effect=focus/,
    'unselected effect CSS is not imported'
  )
  assert.doesNotMatch(
    html,
    /ples-ready/,
    'await CSS is not imported unless the plugin option is set'
  )
})
