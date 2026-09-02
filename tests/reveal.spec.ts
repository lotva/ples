import { expect, test } from '@playwright/test'

import { expectTransition, trackTransitions } from './support.js'

test.describe('a fresh visit', () => {
  test('reveals every opted-in section', async ({ page }) => {
    await page.goto('/index.html')

    for (let id of ['fresh', 'zoom-held', 'style-duration', 'opted-in-fresh']) {
      await expect(page.locator(`#${id}`)).toHaveClass(/ples-shown/)
    }
  })

  test('actually animates the reveal, rather than just flipping a class', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/index.html')

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'fresh', true)
  })

  test('lets a section configure its own hold time from a data attribute, where attr() is supported', async ({
    page
  }) => {
    await page.goto('/index.html')

    let supportsAdvancedAttr = await page.evaluate(() =>
      CSS.supports('transition-delay', 'attr(data-ples-hold type(<time>), 0ms)')
    )

    let expected = supportsAdvancedAttr ? '0.2s' : '0s'
    await expect(page.locator('#zoom-held')).toHaveCSS(
      'transition-delay',
      expected
    )
  })

  test('lets a section configure its own duration from style=""', async ({
    page
  }) => {
    await page.goto('/index.html')

    let supportsAdvancedAttr = await page.evaluate(() =>
      CSS.supports('transition-delay', 'attr(data-ples-hold type(<time>), 0ms)')
    )

    test.skip(
      supportsAdvancedAttr,
      'style custom properties apply when attr() timing is unsupported'
    )

    await expect(page.locator('#style-duration')).toHaveCSS(
      'transition-duration',
      /1\.2s/
    )
  })
})
