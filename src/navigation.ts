export type NavigationKind = 'fresh' | 'reload' | 'internal'

export function classifyNavigation(): NavigationKind {
  let activation = globalThis.navigation?.activation

  if (!activation) return 'fresh'
  if (activation.navigationType === 'reload') return 'reload'
  return activation.from ? 'internal' : 'fresh'
}

const NAVIGATE_ATTRIBUTE = 'data-ples-navigate'
const RELOAD_ATTRIBUTE = 'data-ples-reload'

function isAttributeEnabled(value: string | null): boolean {
  return value !== 'false'
}

export function wantsNavigateAnimation(element: Element): boolean {
  let own = element.getAttribute(NAVIGATE_ATTRIBUTE)
  if (own !== null) return isAttributeEnabled(own)

  return isAttributeEnabled(
    document.documentElement.getAttribute(NAVIGATE_ATTRIBUTE)
  )
}

export function wantsReloadAnimation(): boolean {
  return isAttributeEnabled(
    document.documentElement.getAttribute(RELOAD_ATTRIBUTE)
  )
}
