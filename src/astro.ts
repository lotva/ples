import type { AstroIntegration } from 'astro'

export default function ples(): AstroIntegration {
  return {
    name: 'ples',
    hooks: {
      async 'astro:config:setup'({ injectScript }) {
        let { script } = await import('./head.mjs')
        injectScript('page-ssr', 'import "ples/styles";')
        injectScript('head-inline', script)
      }
    }
  }
}
