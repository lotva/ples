import { expect, test } from '@playwright/test'

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('reveals content through a pure CSS transition', async ({ page }) => {
    await page.goto('/index.html')

    let fresh = page.locator('#fresh')

    await expect
      .poll(
        () =>
          fresh.evaluate(element =>
            element
              .getAnimations()
              .some(
                animation =>
                  'transitionProperty' in animation &&
                  animation.transitionProperty === 'opacity'
              )
          ),
        { timeout: 500 }
      )
      .toBe(true)

    await expect(fresh).toHaveCSS('opacity', '1')
  })

  test('never adds the "ples" class -- there is no script to add it', async ({
    page
  }) => {
    await page.goto('/index.html')

    await expect(page.locator('html')).not.toHaveClass(/ples/)
  })
})
