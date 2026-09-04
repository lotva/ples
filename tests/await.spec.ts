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

  test('does not wait for loading=lazy images', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#lazy')).toHaveClass(/ples-ready/)
    await expect(page.locator('#photo')).not.toHaveClass(/ples-ready/)
  })

  test('does not wait for preload=none videos', async ({ page }) => {
    await page.goto('/await.html', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('#held')).toHaveClass(/ples-ready/)
    await expect(page.locator('#photo')).not.toHaveClass(/ples-ready/)
  })
})
