import { expect, test } from '@playwright/test'

import {
  expectTransition,
  skipUnlessStartingStyle,
  supportsStartingStyle,
  trackTransitions
} from './support.js'

test.describe('SSR SPA', () => {
  test('plays the first route via runtime, then client inserts via @starting-style', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/spa.html')

    skipUnlessStartingStyle(await supportsStartingStyle(page))

    await expect(page.locator('html')).toHaveAttribute('data-ples-stream', '')

    let ssr = page.locator('#ssr')
    await expect(ssr).toHaveClass(/ples-shown/)
    await expect(ssr).toHaveCSS('opacity', '1')
    await expectTransition(page, 'ssr', true)

    let spa = page.locator('#spa')
    await expect(spa).toBeVisible()
    await expect(spa).not.toHaveClass(/ples-shown/)
    await expect(spa).toHaveCSS('opacity', '1')
    await expectTransition(page, 'spa', true)
  })
})
