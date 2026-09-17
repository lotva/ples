import { expect, test } from '@playwright/test'

import { expectTransition, trackTransitions } from './support.js'

declare global {
  interface Window {
    plesRevealProbe?: {
      optedShown: boolean
      defaultShown: boolean
    }
  }
}

test.describe('an in-app transition', () => {
  test('animates by default, the same as a fresh visit', async ({ page }) => {
    await trackTransitions(page)
    await page.goto('/index.html')
    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)

    await page.getByRole('link', { name: 'page two' }).click()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'default', true)
  })

  test('still lets one section opt out on its own', async ({ page }) => {
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page two' }).click()

    await expect(page.locator('#opted-out-element')).toHaveClass(/ples-shown/)
  })

  test('stays instant everywhere once the global config turns it off', async ({
    page
  }) => {
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page config-disabled' }).click()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('still lets one section opt back in despite the global config', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page config-disabled' }).click()

    await expect(page.locator('#opted-in-element')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'opted-in-element', true)
  })

  test('stays instant when set through a page-wide markup attribute instead of JS', async ({
    page
  }) => {
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page markup-disabled' }).click()

    await expect(page.locator('#default')).toHaveClass(/ples-shown/)
  })

  test('still lets one section opt back in despite the page-wide attribute', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page markup-disabled' }).click()

    await expect(page.locator('#opted-in-element')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'opted-in-element', true)
  })
})

test.describe('@lotva/ples/navigation', () => {
  test('ignores navigate=false attributes when the addon is not loaded', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/index.html')

    await page.goto('/page-two-core-only.html')

    await expect(page.locator('#opted-out-element')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'opted-out-element', true)
  })

  test('shows navigate=false elements before the core double-rAF play', async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === 'firefox',
      'This probe listens to pagereveal; Firefox uses the rAF fallback'
    )

    await page.addInitScript(() => {
      addEventListener('pagereveal', () => {
        requestAnimationFrame(() => {
          window.plesRevealProbe = {
            optedShown: Boolean(
              document
                .getElementById('opted-out-element')
                ?.classList.contains('ples-shown')
            ),
            defaultShown: Boolean(
              document
                .getElementById('default')
                ?.classList.contains('ples-shown')
            )
          }
        })
      })
    })

    await page.goto('/index.html')
    await page.getByRole('link', { name: 'page two' }).click()

    await expect(page.locator('#opted-out-element')).toHaveClass(/ples-shown/)
    await expect
      .poll(() => page.evaluate(() => window.plesRevealProbe))
      .toEqual({ optedShown: true, defaultShown: false })
  })

  test('keeps back/forward restores instant, without replaying the reveal', async ({
    page
  }) => {
    await trackTransitions(page)
    await page.goto('/index.html')
    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expectTransition(page, 'fresh', true)
    await page.evaluate(() => {
      window.plesTransitioned = []
    })

    await page.getByRole('link', { name: 'page two' }).click()
    await expect(page.locator('#default')).toHaveClass(/ples-shown/)

    await page.goBack()

    await expect(page.locator('#fresh')).toHaveClass(/ples-shown/)
    await expect(page.locator('#fresh')).toHaveCSS('opacity', '1')
    expect(
      await page.evaluate(
        () => globalThis.navigation?.activation?.navigationType
      )
    ).toBe('traverse')

    await page.waitForTimeout(400)
    await expect(page.locator('html')).not.toHaveClass(/ples-instant/)
    expect(await page.evaluate(() => window.plesTransitioned)).toEqual([])
  })

  test('keeps local hold on a fresh visit despite together markup', async ({
    page
  }) => {
    await page.goto('/page-together.html')

    await expect(page.locator('#held')).toHaveClass(/ples-shown/)
    await expect(page.locator('html')).not.toHaveClass(/ples-navigate/)
    await expect(page.locator('#held')).toHaveCSS('transition-delay', '0.3s')
  })

  test('collapses hold and sequence stagger on in-app navigate', async ({
    page
  }) => {
    await page.goto('/index.html')

    await page.getByRole('link', { name: 'page together' }).click()

    await expect(page.locator('#held')).toHaveClass(/ples-shown/)
    await expect(page.locator('html')).toHaveClass(/ples-navigate/)
    await expect(page.locator('#held')).toHaveCSS('transition-delay', '0s')
    await expect(page.locator('#stagger-b')).toHaveCSS('transition-delay', '0s')
  })

  test('leaves late inserts with their own hold after stream mode', async ({
    page
  }) => {
    await page.goto('/index.html')
    await page.getByRole('link', { name: 'page together' }).click()

    await expect(page.locator('html')).toHaveAttribute('data-ples-stream', '')
    await expect(page.locator('html')).toHaveClass(/ples-navigate/)

    await page.evaluate(() => {
      let section = document.createElement('section')
      section.id = 'late'
      section.setAttribute('data-ples', '')
      section.setAttribute('data-ples-hold', '250ms')
      document.body.append(section)
    })

    await expect(page.locator('#late')).toHaveCSS('transition-delay', '0.25s')
  })
})
