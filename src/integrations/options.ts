export type PlesOptions = {
  scroll?: boolean
  sequence?: boolean
  await?: boolean
}

export type PlesStyles = {
  style: string
  scroll: string
  sequence: string
  awaitStyle: string
}

export function stylesheet(styles: PlesStyles, options?: PlesOptions): string {
  let css = styles.style
  if (options?.scroll) css += styles.scroll
  if (options?.sequence) css += styles.sequence
  if (options?.await) css += styles.awaitStyle
  return css
}

export function scripts(
  script: string,
  awaitScript: string,
  options?: PlesOptions
): string {
  return options?.await ? `${script};${awaitScript}` : script
}
