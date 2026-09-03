import type { HtmlTagDescriptor, Plugin } from 'vite'

import { stylesheet, type PlesOptions } from './options.js'

export type { PlesOptions }

export default function ples(options?: PlesOptions): Plugin {
  let head = import('./head.mjs')

  return {
    name: 'vite-plugin-ples',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        let { script, style, scroll } = await head

        if (html.includes(script)) {
          return
        }

        let tags: HtmlTagDescriptor[] = [
          {
            tag: 'style',
            children: stylesheet(style, scroll, options),
            injectTo: 'head'
          },
          {
            tag: 'script',
            children: script,
            injectTo: 'head'
          }
        ]

        return { html, tags }
      }
    }
  }
}
