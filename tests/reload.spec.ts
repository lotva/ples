import { expect, test } from '@playwright/test'

import {
  expectTransition,
  skipUnlessNavigationApi,
  trackTransitions
} from './support.js'

test.describe('reloading the page', () => {
  test('animates by default, the same as a fresh visit', async ({ page }) => {
    await trackTransitions(page)
    await page.goto('/index.html')
    await page.reload()

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'fresh', true)
  })

  test('stays instant once the global config turns it off', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await page.goto('/page-config-disabled.html')
    await page.reload()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('stays instant when set through a page-wide markup attribute instead of JS', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await page.goto('/page-reload-disabled.html')
    await page.reload()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })
})
