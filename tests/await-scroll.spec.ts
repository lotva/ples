import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

function supportsScrollTrigger(page: Page): Promise<boolean> {
  return page.evaluate(
    () =>
      CSS.supports('timeline-trigger', '--ples-scroll view()') &&
      CSS.supports('trigger-scope', '--ples-scroll')
  )
}

test.describe('@lotva/ples/await + @lotva/ples/scroll', () => {
  test('holds scroll reveal until a lazy image is decoded', async ({
    page
  }) => {
    let release!: () => void
    let held = new Promise<void>(resolve => {
      release = resolve
    })

    await page.route(
      url => url.pathname === '/slow.png' && url.search === '?lazy-scroll',
      async route => {
        await held
        await route.continue()
      }
    )

    await page.goto('/await-scroll.html')
    test.skip(
      !(await supportsScrollTrigger(page)),
      'timeline-trigger is required for data-ples-scroll'
    )

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expect(page.locator('#card')).not.toHaveClass(/ples-ready/)
    await expect(page.locator('#card')).toHaveCSS('opacity', '0')

    await page.locator('#card').scrollIntoViewIfNeeded()

    await expect(page.locator('#card')).not.toHaveClass(/ples-ready/)
    await expect(page.locator('#card')).toHaveCSS('opacity', '0')

    release()

    await expect(page.locator('#card')).toHaveClass(/ples-ready/, {
      timeout: 3000
    })
    await expect(page.locator('#card')).toHaveCSS('opacity', '1')
  })
})
