import { expect, test } from '@playwright/test'

import { skipUnlessViewTransitions } from './support.js'

test.describe('a navigation already running its own View Transition', () => {
  test('reveals content instantly instead of animating underneath it', async ({
    page,
    browserName
  }) => {
    skipUnlessViewTransitions(browserName)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page view-transition' }).click()

    await expect(page.locator('#under-view-transition')).toHaveClass(
      /ples-shown/
    )
  })
})
