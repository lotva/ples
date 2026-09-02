import type { HtmlTagDescriptor, Plugin } from 'vite'

export default function ples(): Plugin {
  let head = import('./head.mjs')

  return {
    name: 'vite-plugin-ples',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        let { script, style } = await head

        if (html.includes(script)) {
          return
        }

        let tags: HtmlTagDescriptor[] = [
          {
            tag: 'style',
            children: style,
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
