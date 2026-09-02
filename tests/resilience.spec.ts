import { expect, test } from '@playwright/test'

test.describe('when the environment misbehaves', () => {
  test('still reveals content instead of leaving it hidden forever', async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === 'firefox',
      'Firefox exposes pagereveal without firing it in headless runs'
    )

    await page.addInitScript(() => {
      window.requestAnimationFrame = () => {
        throw new Error('requestAnimationFrame is unavailable')
      }
    })

    await page.goto('/index.html')

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expect(page.locator('#fresh')).toHaveCSS('opacity', '1')
  })
})
