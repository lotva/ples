import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const DIST = new URL('../dist/', import.meta.url)
const SCRIPT = new URL('runtime.iife.js', DIST)
const STYLE = new URL('ples.css', DIST)
const SCROLL = new URL('scroll.css', DIST)

const SOURCEMAP_PATTERN =
  /(?:\/\/# sourceMappingURL=[^\n]*|\/\*# sourceMappingURL=[^*]*\*\/)\s*/g

export function stripSourceMappingURL(source) {
  return source.replace(SOURCEMAP_PATTERN, '').trimEnd()
}

export function buildHead() {
  if (!existsSync(SCRIPT) || !existsSync(STYLE) || !existsSync(SCROLL)) {
    return
  }

  let script = stripSourceMappingURL(readFileSync(SCRIPT, 'utf8'))
  let style = stripSourceMappingURL(readFileSync(STYLE, 'utf8'))
  let scroll = stripSourceMappingURL(readFileSync(SCROLL, 'utf8'))

  writeFileSync(
    new URL('head.mjs', DIST),
    `export const script = ${JSON.stringify(script)}\nexport const style = ${JSON.stringify(style)}\nexport const scroll = ${JSON.stringify(scroll)}\n`
  )

  writeFileSync(
    new URL('head.d.mts', DIST),
    `export declare const script: string\nexport declare const style: string\nexport declare const scroll: string\n`
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
