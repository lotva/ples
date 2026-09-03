import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

function supportsScrollTrigger(page: Page): Promise<boolean> {
  return page.evaluate(
    () =>
      CSS.supports('timeline-trigger', '--ples-scroll view()') &&
      CSS.supports('trigger-scope', '--ples-scroll')
  )
}

test.describe('data-ples-scroll', () => {
  test('keeps below-fold content hidden until it enters the viewport', async ({
    page
  }) => {
    await page.goto('/scroll.html')
    test.skip(
      !(await supportsScrollTrigger(page)),
      'timeline-trigger is required for data-ples-scroll'
    )

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expect(page.locator('#fresh')).toHaveCSS('opacity', '1')

    await expect(page.locator('#expose')).toHaveCSS('opacity', '0')
    await expect(page.locator('#expose-mid')).toHaveCSS('opacity', '0')

    await page.locator('#expose').scrollIntoViewIfNeeded()

    await expect(page.locator('#expose')).toHaveCSS('opacity', '1')
    await expect(page.locator('#expose-mid')).toHaveCSS('opacity', '0')

    await page.locator('#expose-mid').scrollIntoViewIfNeeded()

    await expect(page.locator('#expose-mid')).toHaveCSS('opacity', '1')
  })

  test('keeps revealed blocks visible after scrolling away', async ({
    page
  }) => {
    await page.goto('/scroll.html')
    test.skip(
      !(await supportsScrollTrigger(page)),
      'timeline-trigger is required for data-ples-scroll'
    )

    await page.locator('#expose').scrollIntoViewIfNeeded()
    await expect(page.locator('#expose')).toHaveCSS('opacity', '1')

    await page.locator('#fresh').scrollIntoViewIfNeeded()
    await expect(page.locator('#expose')).toHaveCSS('opacity', '1')

    await page.locator('#expose').scrollIntoViewIfNeeded()
    await expect(page.locator('#expose')).toHaveCSS('opacity', '1')
  })

  test('defaults the entry threshold to contain', async ({ page }) => {
    await page.goto('/scroll.html')
    test.skip(
      !(await supportsScrollTrigger(page)),
      'timeline-trigger is required for data-ples-scroll'
    )

    await expect(page.locator('#expose')).toHaveCSS(
      'trigger-scope',
      '--ples-scroll'
    )
    await expect(page.locator('#expose')).toHaveCSS(
      'timeline-trigger',
      /(contain|entry 100%)/
    )
  })

  test('reads a custom entry threshold from data-ples-scroll', async ({
    page
  }) => {
    await page.goto('/scroll.html')
    test.skip(
      !(await supportsScrollTrigger(page)),
      'timeline-trigger is required for data-ples-scroll'
    )

    let supportsAttr = await page.evaluate(() =>
      CSS.supports(
        'timeline-trigger',
        '--ples-scroll view() entry attr(data-ples-scroll type(<percentage>), 100%) exit 0%'
      )
    )
    test.skip(
      !supportsAttr,
      'typed attr() is required for a custom scroll threshold'
    )

    await expect(page.locator('#expose-mid')).toHaveCSS(
      'timeline-trigger',
      /entry 50%/
    )
  })

  test('falls back to regular reveal when scroll triggers are unsupported', async ({
    page
  }) => {
    await page.goto('/scroll.html')
    test.skip(
      await supportsScrollTrigger(page),
      'fallback only applies without timeline-trigger support'
    )

    await expect(page.locator('#expose')).toHaveCSS('opacity', '1')
    await expect(page.locator('#expose-mid')).toHaveCSS('opacity', '1')
  })
})
