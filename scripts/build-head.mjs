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
const EFFECT_NAMES = ['relax', 'zoom', 'screw', 'focus']
const EFFECT_STYLES = EFFECT_NAMES.map(
  name => new URL(`effects/${name}.css`, DIST)
)

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
    !existsSync(NAVIGATION_STYLE) ||
    EFFECT_STYLES.some(style => !existsSync(style))
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
  let effects = Object.fromEntries(
    EFFECT_NAMES.map((name, index) => [
      name,
      stripSourceMappingURL(readFileSync(EFFECT_STYLES[index], 'utf8'))
    ])
  )

  writeFileSync(
    new URL('head.mjs', DIST),
    [
      `import { createHash } from 'node:crypto'`,
      `export const script = ${JSON.stringify(script)}`,
      `export const awaitScript = ${JSON.stringify(awaitScript)}`,
      `export const navigationScript = ${JSON.stringify(navigationScript)}`,
      `export const style = ${JSON.stringify(style)}`,
      `export const effects = ${JSON.stringify(effects)}`,
      `export const scroll = ${JSON.stringify(scroll)}`,
      `export const sequence = ${JSON.stringify(sequence)}`,
      `export const awaitStyle = ${JSON.stringify(awaitStyle)}`,
      `export const navigationStyle = ${JSON.stringify(navigationStyle)}`,
      '',
      'function sha256(source) {',
      "  return \"'sha256-\" + createHash('sha256').update(source, 'utf8').digest('base64') + \"'\"",
      '}',
      '',
      '/**',
      ' * CSP hashes for the same inline CSS/JS the plugins emit.',
      ' * Keep assembly in sync with `stylesheet` / `scripts` in options.ts.',
      ' */',
      'export function csp(options) {',
      '  let css = style',
      '  for (let effect of new Set(options?.effects)) css += effects[effect]',
      '  if (options?.scroll) css += scroll',
      '  if (options?.sequence) css += sequence',
      '  if (options?.await) css += awaitStyle',
      '  if (options?.navigation) css += navigationStyle',
      '',
      '  let js = script',
      "  if (options?.await) js += ';' + awaitScript",
      "  if (options?.navigation) js += ';' + navigationScript",
      '',
      '  return {',
      '    scriptSrc: [sha256(js)],',
      '    styleSrc: [sha256(css)]',
      '  }',
      '}',
      ''
    ].join('\n')
  )

  writeFileSync(
    new URL('head.d.mts', DIST),
    [
      `export declare const script: string`,
      `export declare const awaitScript: string`,
      `export declare const navigationScript: string`,
      `export declare const style: string`,
      `export declare const effects: Record<'relax' | 'zoom' | 'screw' | 'focus', string>`,
      `export declare const scroll: string`,
      `export declare const sequence: string`,
      `export declare const awaitStyle: string`,
      `export declare const navigationStyle: string`,
      '',
      `export type PlesCspOptions = {`,
      `  effects?: readonly ('relax' | 'zoom' | 'screw' | 'focus')[]`,
      `  scroll?: boolean`,
      `  sequence?: boolean`,
      `  await?: boolean`,
      `  navigation?: boolean`,
      `}`,
      '',
      `export declare function csp(options?: PlesCspOptions): {`,
      `  scriptSrc: string[]`,
      `  styleSrc: string[]`,
      `}`,
      ''
    ].join('\n')
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
