import type { HtmlTagDescriptor, Plugin } from 'vite'

import { scripts, stylesheet, type PlesOptions } from './options.js'

export type { PlesOptions }

export default function ples(options?: PlesOptions): Plugin {
  let head = import('./head.mjs')

  return {
    name: 'vite-plugin-ples',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        let {
          script,
          awaitScript,
          navigationScript,
          style,
          scroll,
          sequence,
          awaitStyle
        } = await head

        if (html.includes(script)) {
          return
        }

        let tags: HtmlTagDescriptor[] = [
          {
            tag: 'style',
            children: stylesheet(
              { style, scroll, sequence, awaitStyle },
              options
            ),
            injectTo: 'head'
          },
          {
            tag: 'script',
            children: scripts(
              { script, awaitScript, navigationScript },
              options
            ),
            injectTo: 'head'
          }
        ]

        return { html, tags }
      }
    }
  }
}
