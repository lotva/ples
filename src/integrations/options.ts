export type PlesOptions = {
  scroll?: boolean
}

export function stylesheet(
  style: string,
  scrollStyle: string,
  options?: PlesOptions
): string {
  return options?.scroll ? style + scrollStyle : style
}
