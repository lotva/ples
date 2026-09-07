import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const DIST = new URL('../dist/', import.meta.url)
const SCRIPT = new URL('runtime.iife.js', DIST)
const WAITING = new URL('await.iife.js', DIST)
const NAVIGATION = new URL('navigation.iife.js', DIST)
const STYLE = new URL('ples.css', DIST)
const SCROLL = new URL('scroll.css', DIST)
const SEQUENCE = new URL('sequence.css', DIST)
const AWAIT_STYLE = new URL('await.css', DIST)
const NAVIGATION_STYLE = new URL('navigation.css', DIST)

const SOURCEMAP_PATTERN =
  /(?:\/\/# sourceMappingURL=[^\n]*|\/\*# sourceMappingURL=[^*]*\*\/)\s*/g

export function stripSourceMappingURL(source) {
  return source.replace(SOURCEMAP_PATTERN, '').trimEnd()
}

export function buildHead() {
  if (
    !existsSync(SCRIPT) ||
    !existsSync(WAITING) ||
    !existsSync(NAVIGATION) ||
    !existsSync(STYLE) ||
    !existsSync(SCROLL) ||
    !existsSync(SEQUENCE) ||
    !existsSync(AWAIT_STYLE) ||
    !existsSync(NAVIGATION_STYLE)
  ) {
    return
  }

  let script = stripSourceMappingURL(readFileSync(SCRIPT, 'utf8'))
  let awaitScript = stripSourceMappingURL(readFileSync(WAITING, 'utf8'))
  let navigationScript = stripSourceMappingURL(readFileSync(NAVIGATION, 'utf8'))
  let style = stripSourceMappingURL(readFileSync(STYLE, 'utf8'))
  let scroll = stripSourceMappingURL(readFileSync(SCROLL, 'utf8'))
  let sequence = stripSourceMappingURL(readFileSync(SEQUENCE, 'utf8'))
  let awaitStyle = stripSourceMappingURL(readFileSync(AWAIT_STYLE, 'utf8'))
  let navigationStyle = stripSourceMappingURL(
    readFileSync(NAVIGATION_STYLE, 'utf8')
  )

  writeFileSync(
    new URL('head.mjs', DIST),
    `export const script = ${JSON.stringify(script)}\nexport const awaitScript = ${JSON.stringify(awaitScript)}\nexport const navigationScript = ${JSON.stringify(navigationScript)}\nexport const style = ${JSON.stringify(style)}\nexport const scroll = ${JSON.stringify(scroll)}\nexport const sequence = ${JSON.stringify(sequence)}\nexport const awaitStyle = ${JSON.stringify(awaitStyle)}\nexport const navigationStyle = ${JSON.stringify(navigationStyle)}\n`
  )

  writeFileSync(
    new URL('head.d.mts', DIST),
    `export declare const script: string\nexport declare const awaitScript: string\nexport declare const navigationScript: string\nexport declare const style: string\nexport declare const scroll: string\nexport declare const sequence: string\nexport declare const awaitStyle: string\nexport declare const navigationStyle: string\n`
  )
}

/** @type {ReturnType<typeof setTimeout> | undefined} */
let buildHeadTimer

export function scheduleBuildHead() {
  clearTimeout(buildHeadTimer)
  buildHeadTimer = setTimeout(buildHead)
}

if (import.meta.main) {
  buildHead()
}
