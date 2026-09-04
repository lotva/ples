import { expect, test } from '@playwright/test'

test.describe('ples/await', () => {
  test('keeps media blocks hidden until images decode', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#photo')).toHaveClass(/ples-shown/)
    await expect(page.locator('#photo')).not.toHaveClass(/ples-ready/)
    await expect(page.locator('#photo')).toHaveCSS('opacity', '0')

    await expect(page.locator('#photo')).toHaveClass(/ples-ready/, {
      timeout: 3000
    })
    await expect(page.locator('#photo')).toHaveCSS('opacity', '1')
  })

  test('reveals blocks without media immediately', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#copy')).toHaveClass(/ples-ready/)
    await expect(page.locator('#copy')).toHaveCSS('opacity', '1')
  })

  test('reveals after a broken image or video', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#broken')).toHaveClass(/ples-ready/)
    await expect(page.locator('#clip')).toHaveClass(/ples-ready/)
    await expect(page.locator('#broken')).toHaveCSS('opacity', '1')
    await expect(page.locator('#clip')).toHaveCSS('opacity', '1')
  })

  test('waits for loading=lazy images to decode', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#lazy')).not.toHaveClass(/ples-ready/)
    await expect(page.locator('#photo')).not.toHaveClass(/ples-ready/)

    await page.locator('#lazy').scrollIntoViewIfNeeded()

    await expect(page.locator('#lazy')).toHaveClass(/ples-ready/, {
      timeout: 3000
    })
    await expect(page.locator('#lazy')).toHaveCSS('opacity', '1')
  })

  test('does not wait for preload=none videos', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#held')).toHaveClass(/ples-ready/)
    await expect(page.locator('#photo')).not.toHaveClass(/ples-ready/)
  })

  test('waits for another block by id before becoming ready', async ({
    page
  }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#caption')).not.toHaveClass(/ples-ready/)
    await expect(page.locator('#caption')).toHaveCSS('opacity', '0')

    await expect(page.locator('#photo')).toHaveClass(/ples-ready/, {
      timeout: 3000
    })
    await expect(page.locator('#caption')).toHaveClass(/ples-ready/)
    await expect(page.locator('#caption')).toHaveCSS('opacity', '1')
  })

  test('still waits for own media after the awaited block is ready', async ({
    page
  }) => {
    let release!: () => void
    let held = new Promise<void>(resolve => {
      release = resolve
    })

    await page.route(
      url => url.pathname === '/slow.png' && url.search === '?and',
      async route => {
        await held
        await route.continue()
      }
    )

    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#copy')).toHaveClass(/ples-ready/)
    await expect(page.locator('#paired')).not.toHaveClass(/ples-ready/)
    await expect(page.locator('#paired')).toHaveCSS('opacity', '0')

    release()

    await expect(page.locator('#paired')).toHaveClass(/ples-ready/, {
      timeout: 3000
    })
    await expect(page.locator('#paired')).toHaveCSS('opacity', '1')
  })

  test('fails open when the awaited id is missing or cyclic', async ({
    page
  }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#orphan')).toHaveClass(/ples-ready/)
    await expect(page.locator('#ping')).toHaveClass(/ples-ready/)
    await expect(page.locator('#pong')).toHaveClass(/ples-ready/)
  })
})
