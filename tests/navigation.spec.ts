import { expect, test } from '@playwright/test'

import {
  expectTransition,
  skipUnlessNavigationApi,
  trackTransitions
} from './support.js'

test.describe('an in-app transition', () => {
  test('animates by default, the same as a fresh visit', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await trackTransitions(page)
    await page.goto('/index.html')
    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)

    await page.getByRole('link', { name: 'page two' }).click()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'default', true)
  })

  test('still lets one section opt out on its own', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page two' }).click()

    await expect(page.locator('#opted-out-element')).toHaveClass(/ples-shown/)
  })

  test('stays instant everywhere once the global config turns it off', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page config-disabled' }).click()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('still lets one section opt back in despite the global config', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await trackTransitions(page)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page config-disabled' }).click()

    await expect(page.locator('#opted-in-element')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'opted-in-element', true)
  })

  test('stays instant when set through a page-wide markup attribute instead of JS', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page markup-disabled' }).click()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('still lets one section opt back in despite the page-wide attribute', async ({
    page,
    browserName
  }) => {
    skipUnlessNavigationApi(browserName)
    await trackTransitions(page)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page markup-disabled' }).click()

    await expect(page.locator('#opted-in-element')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'opted-in-element', true)
  })
})
