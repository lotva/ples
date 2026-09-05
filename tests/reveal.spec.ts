import { expect, test } from '@playwright/test'

import { expectTransition, trackTransitions } from './support.js'

test.describe('a fresh visit', () => {
  test('reveals every opted-in section', async ({ page }) => {
    await page.goto('/index.html')

    for (let id of [
      'fresh',
      'zoom-held',
      'style-duration',
      'opted-in-fresh',
      'focus'
    ]) {
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

    let expected = supportsAdvancedAttr ? '0.2s' : '0.05s'
    await expect(page.locator('#zoom-held')).toHaveCSS(
      'transition-delay',
      expected
    )
    await expect(page.locator('#fresh')).toHaveCSS('transition-delay', '0.05s')
  })

  test('lets a section configure ease from data attributes, where attr() is supported', async ({
    page
  }) => {
    await page.goto('/index.html')

    let supportsAdvancedAttr = await page.evaluate(() =>
      CSS.supports('transition-delay', 'attr(data-ples-hold type(<time>), 0ms)')
    )

    test.skip(
      !supportsAdvancedAttr,
      'typed attr() is required for data-ples-ease'
    )

    let fresh = page.locator('#fresh')
    await fresh.evaluate(el => {
      el.setAttribute('data-ples-ease', 'linear')
      el.setAttribute('data-ples-fade-ease', 'ease-in')
    })

    let timing = await fresh.evaluate(
      el => getComputedStyle(el).transitionTimingFunction
    )
    let functions =
      timing.match(
        /cubic-bezier\([^)]+\)|ease-out|ease-in-out|ease-in|ease|linear/g
      ) ?? []
    expect(functions[0], 'opacity').toMatch(
      /^(ease-in|cubic-bezier\(0\.42,\s*0,\s*1,\s*1\))$/
    )
    expect(functions[1], 'transform').toBe('linear')
    expect(functions[2], 'filter').toBe('linear')
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
