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
          effects,
          scroll,
          sequence,
          awaitStyle,
          navigationStyle
        } = await head

        if (html.includes(script)) {
          return
        }

        let tags: HtmlTagDescriptor[] = [
          {
            tag: 'style',
            children: stylesheet(
              { style, effects, scroll, sequence, awaitStyle, navigationStyle },
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
