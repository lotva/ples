import { expect, test } from '@playwright/test'

import { didTransition, trackTransitions } from './support.js'

test.describe('a visitor who prefers reduced motion', () => {
  test('sees content revealed without any animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })

    await trackTransitions(page)
    await page.goto('/index.html')

    await expect(page.locator('#fresh')).toHaveCSS('opacity', '1')
    expect(await didTransition(page, 'fresh')).toBe(false)
  })
})
