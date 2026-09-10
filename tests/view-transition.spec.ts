import { expect, test } from '@playwright/test'

import { skipUnlessViewTransitions, trackTransitions } from './support.js'

test.describe('a navigation already running its own View Transition', () => {
  test('reveals content instantly instead of animating underneath it', async ({
    page,
    browserName
  }) => {
    skipUnlessViewTransitions(browserName)
    await trackTransitions(page)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page view-transition' }).click()

    await expect(page.locator('#under-view-transition')).toHaveClass(
      /ples-shown/
    )
    await page.waitForTimeout(400)
    await expect(page.locator('html')).not.toHaveClass(/ples-instant/)
    expect(await page.evaluate(() => window.plesTransitioned)).toEqual([])
  })
})
