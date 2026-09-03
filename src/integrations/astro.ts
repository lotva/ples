import type { AstroIntegration } from 'astro'

import type { PlesOptions } from './options.js'

export type { PlesOptions }

export default function ples(options?: PlesOptions): AstroIntegration {
  return {
    name: 'ples',
    hooks: {
      async 'astro:config:setup'({ injectScript }) {
        let { script } = await import('./head.mjs')
        injectScript('page-ssr', 'import "ples/styles";')
        if (options?.scroll) injectScript('page-ssr', 'import "ples/scroll";')
        injectScript('head-inline', script)
      }
    }
  }
}
