import { expect, test } from '@playwright/test'

import { expectTransition, trackTransitions } from './support.js'

test.describe('reloading the page', () => {
  test('animates by default, the same as a fresh visit', async ({ page }) => {
    await trackTransitions(page)
    await page.goto('/index.html')
    await page.reload()

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'fresh', true)
  })

  test('stays instant once the global config turns it off', async ({
    page
  }) => {
    await page.goto('/page-config-disabled.html')
    await page.reload()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('stays instant when set through a page-wide markup attribute instead of JS', async ({
    page
  }) => {
    await page.goto('/page-reload-disabled.html')
    await page.reload()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('collapses hold and sequence stagger when together is set', async ({
    page
  }) => {
    await page.goto('/page-together.html')
    await expect(page.locator('#held')).toHaveCSS('transition-delay', '0.3s')
    await expect(page.locator('html')).not.toHaveClass(/ples-reload/)

    await page.reload()

    await expect(page.locator('#held')).toHaveClass(/ples-shown/)
    await expect(page.locator('html')).toHaveClass(/ples-reload/)
    await expect(page.locator('#held')).toHaveCSS('transition-delay', '0s')
    await expect(page.locator('#stagger-b')).toHaveCSS('transition-delay', '0s')
  })
})
