export type PlesOptions = {
  scroll?: boolean
  sequence?: boolean
}

export type PlesStyles = {
  style: string
  scroll: string
  sequence: string
}

export function stylesheet(styles: PlesStyles, options?: PlesOptions): string {
  let css = styles.style
  if (options?.scroll) css += styles.scroll
  if (options?.sequence) css += styles.sequence
  return css
}
