import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { test } from 'node:test'

import {
  awaitScript,
  awaitStyle,
  csp,
  effects,
  navigationScript,
  navigationStyle,
  script,
  scroll,
  sequence,
  style
} from '../dist/head.mjs'

function sha256(source) {
  return `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`
}

// Keep in sync with stylesheet() / scripts() in src/integrations/options.ts
function expected(options = {}) {
  let css = style
  for (let effect of new Set(options.effects)) css += effects[effect]
  if (options.scroll) css += scroll
  if (options.sequence) css += sequence
  if (options.await) css += awaitStyle
  if (options.navigation) css += navigationStyle

  let js = script
  if (options.await) js += `;${awaitScript}`
  if (options.navigation) js += `;${navigationScript}`

  return {
    scriptSrc: [sha256(js)],
    styleSrc: [sha256(css)]
  }
}

test('csp hashes match the inline CSS/JS assembly', () => {
  assert.deepEqual(csp(), expected())
  assert.deepEqual(
    csp({ effects: ['zoom', 'focus'], await: true, navigation: true }),
    expected({ effects: ['zoom', 'focus'], await: true, navigation: true })
  )
  assert.deepEqual(
    csp({ scroll: true, sequence: true }),
    expected({ scroll: true, sequence: true })
  )
})

test('csp hashes are single sha256 sources', () => {
  let { scriptSrc, styleSrc } = csp({ await: true })
  assert.match(scriptSrc[0], /^'sha256-[A-Za-z0-9+/=]+'$/)
  assert.match(styleSrc[0], /^'sha256-[A-Za-z0-9+/=]+'$/)
  assert.notEqual(scriptSrc[0], styleSrc[0])
})
