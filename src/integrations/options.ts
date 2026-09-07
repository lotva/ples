export type PlesOptions = {
  scroll?: boolean
  sequence?: boolean
  await?: boolean
  navigation?: boolean
}

export type PlesStyles = {
  style: string
  scroll: string
  sequence: string
  awaitStyle: string
  navigationStyle: string
}

export type PlesScripts = {
  script: string
  awaitScript: string
  navigationScript: string
}

export function stylesheet(styles: PlesStyles, options?: PlesOptions): string {
  let css = styles.style
  if (options?.scroll) css += styles.scroll
  if (options?.sequence) css += styles.sequence
  if (options?.await) css += styles.awaitStyle
  if (options?.navigation) css += styles.navigationStyle
  return css
}

export function scripts(parts: PlesScripts, options?: PlesOptions): string {
  let out = parts.script
  if (options?.await) out += `;${parts.awaitScript}`
  if (options?.navigation) out += `;${parts.navigationScript}`
  return out
}
