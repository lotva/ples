import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

function supportsSequence(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    CSS.supports('transition-delay', 'calc(sibling-index() * 1ms)')
  )
}

test.describe('data-ples-sequence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sequence.html')
    test.skip(
      !(await supportsSequence(page)),
      'sibling-index() is required for data-ples-sequence'
    )
  })

  test('staggers direct children by 100ms by default', async ({ page }) => {
    await expect(page.locator('#default-a')).toHaveCSS('transition-delay', '0s')
    await expect(page.locator('#default-b')).toHaveCSS(
      'transition-delay',
      '0.1s'
    )
    await expect(page.locator('#default-c')).toHaveCSS(
      'transition-delay',
      '0.2s'
    )
  })

  test('reads the step from data-ples-sequence, or keeps 100ms without typed attr()', async ({
    page
  }) => {
    let supportsAttr = await page.evaluate(() =>
      CSS.supports('transition-delay', 'attr(data-ples-sequence type(<time>))')
    )

    await expect(page.locator('#custom-a')).toHaveCSS('transition-delay', '0s')
    await expect(page.locator('#custom-b')).toHaveCSS(
      'transition-delay',
      supportsAttr ? '0.08s' : '0.1s'
    )
    await expect(page.locator('#custom-c')).toHaveCSS(
      'transition-delay',
      supportsAttr ? '0.16s' : '0.2s'
    )
  })

  test('lets one child override --ples-stagger-index', async ({ page }) => {
    await expect(page.locator('#index-a')).toHaveCSS('transition-delay', '0s')
    await expect(page.locator('#index-b')).toHaveCSS('transition-delay', '0s')
    await expect(page.locator('#index-c')).toHaveCSS('transition-delay', '0.2s')
  })
})
