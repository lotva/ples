import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

declare global {
  interface Window {
    plesTransitioned: string[]
  }
}

/**
 * Records the id of every ples element that starts a CSS transition, for the
 * lifetime of the page (across in-app navigations too, since
 * addInitScript re-runs on each new document).
 */
export async function trackTransitions(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.plesTransitioned = []

    document.addEventListener(
      'transitionrun',
      (event: TransitionEvent) => {
        let target = event.target
        if (!(target instanceof Element) || !target.id) return
        if (!target.hasAttribute('data-ples')) return
        if (
          event.propertyName !== 'opacity' &&
          event.propertyName !== 'transform'
        ) {
          return
        }
        if (!window.plesTransitioned.includes(target.id)) {
          window.plesTransitioned.push(target.id)
        }
      },
      true
    )

    document.addEventListener(
      'transitionstart',
      (event: TransitionEvent) => {
        let target = event.target
        if (!(target instanceof Element) || !target.id) return
        if (!target.hasAttribute('data-ples')) return
        if (
          event.propertyName !== 'opacity' &&
          event.propertyName !== 'transform'
        ) {
          return
        }
        if (!window.plesTransitioned.includes(target.id)) {
          window.plesTransitioned.push(target.id)
        }
      },
      true
    )
  })
}

export function didTransition(page: Page, elementId: string): Promise<boolean> {
  return page.evaluate(id => window.plesTransitioned.includes(id), elementId)
}

export async function expectTransition(
  page: Page,
  elementId: string,
  expected: boolean
): Promise<void> {
  await expect
    .poll(() => didTransition(page, elementId), { timeout: 3000 })
    .toBe(expected)
}

export function skipUnlessNavigationApi(browserName: string): void {
  test.skip(
    browserName !== 'chromium',
    'Navigation API is required for this scenario'
  )
}

export function skipUnlessViewTransitions(browserName: string): void {
  test.skip(
    browserName !== 'chromium',
    'Cross-document View Transitions are required for this scenario'
  )
}

export function skipUnlessStartingStyle(supported: boolean): void {
  test.skip(!supported, '@starting-style is required for stream/SPA reveals')
}

export async function supportsStartingStyle(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    try {
      let sheet = new CSSStyleSheet()
      sheet.replaceSync('@starting-style {}')
      return sheet.cssRules.length > 0
    } catch {
      return false
    }
  })
}
