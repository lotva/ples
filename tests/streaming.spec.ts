import { expect, test } from '@playwright/test'

import {
  expectTransition,
  skipUnlessStartingStyle,
  supportsStartingStyle,
  trackTransitions
} from './support.js'

test.describe('content streamed in after the initial response', () => {
  test('reveals late [data-ples] via @starting-style after the first reveal', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/stream.html')

    skipUnlessStartingStyle(await supportsStartingStyle(page))

    await expect(page.locator('html')).toHaveAttribute('data-ples-stream', '')
    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'fresh', true)

    let streamed = page.locator('#streamed')
    await expect(streamed).toBeVisible()

    let revealedWithRuntime = await streamed.evaluate(element =>
      element.classList.contains('ples-shown')
    )
    test.skip(
      revealedWithRuntime,
      'browser buffered the streamed chunk before the first reveal'
    )

    await expect(streamed).not.toHaveClass(/ples-shown/)
    await expect(streamed).toHaveCSS('opacity', '1')
    await expectTransition(page, 'streamed', true)
  })
})
