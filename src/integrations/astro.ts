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
        injectScript('page-ssr', 'import "ples/styles";')
        for (let effect of new Set(options?.effects)) {
          injectScript('page-ssr', `import "ples/effects/${effect}";`)
        }
        if (options?.scroll) injectScript('page-ssr', 'import "ples/scroll";')
        if (options?.sequence) {
          injectScript('page-ssr', 'import "ples/sequence";')
        }
        if (options?.await) injectScript('page-ssr', 'import "ples/await.css";')
        if (options?.navigation) {
          injectScript('page-ssr', 'import "ples/navigation.css";')
        }
        injectScript(
          'head-inline',
          scripts({ script, awaitScript, navigationScript }, options)
        )
      }
    }
  }
}
