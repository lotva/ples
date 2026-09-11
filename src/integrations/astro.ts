import type { AstroIntegration } from 'astro'

import { scripts, type PlesOptions } from './options.js'

export type { PlesOptions }

export default function ples(options?: PlesOptions): AstroIntegration {
  return {
    name: 'ples',
    hooks: {
      async 'astro:config:setup'({ injectScript }) {
        let { script, awaitScript, navigationScript } =
          await import('./head.mjs')
        injectScript('page-ssr', 'import "@lotva/ples/styles";')
        for (let effect of new Set(options?.effects)) {
          injectScript('page-ssr', `import "@lotva/ples/effects/${effect}";`)
        }
        if (options?.scroll) {
          injectScript('page-ssr', 'import "@lotva/ples/scroll";')
        }
        if (options?.sequence) {
          injectScript('page-ssr', 'import "@lotva/ples/sequence";')
        }
        if (options?.await) {
          injectScript('page-ssr', 'import "@lotva/ples/await.css";')
        }
        if (options?.navigation) {
          injectScript('page-ssr', 'import "@lotva/ples/navigation.css";')
        }
        injectScript(
          'head-inline',
          scripts({ script, awaitScript, navigationScript }, options)
        )
      }
    }
  }
}
