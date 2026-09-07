import type UserConfig from '@11ty/eleventy/UserConfig'
import type { PosthtmlElement, PosthtmlTree } from '@11ty/eleventy/UserConfig'

import { scripts, stylesheet, type PlesOptions } from './options.js'

export type { PlesOptions }

function injectAssets(
  tree: PosthtmlTree,
  style: string,
  script: string
): PosthtmlTree {
  let found = false

  tree.match({ tag: 'script' }, node => {
    if (node.content?.length === 1 && node.content[0] === script) found = true
    return node
  })
  if (found) return tree

  let tags: PosthtmlElement[] = [
    { tag: 'style', content: [style] },
    { tag: 'script', content: [script] }
  ]

  tree.match({ tag: 'head' }, node => {
    if (!found) {
      node.content = [...(node.content ?? []), ...tags]
      found = true
    }
    return node
  })

  if (!found) {
    tree.match({ tag: 'body' }, node => {
      if (!found) {
        node.content = [...tags, ...(node.content ?? [])]
        found = true
      }
      return node
    })
  }

  if (!found) tree.push(...tags)
  return tree
}

export default function ples(
  eleventyConfig: UserConfig,
  options?: PlesOptions
): void {
  let head = import('./head.mjs')

  eleventyConfig.htmlTransformer.addPosthtmlPlugin(
    'html',
    () => async tree => {
      let {
        script,
        awaitScript,
        navigationScript,
        style,
        scroll,
        sequence,
        awaitStyle,
        navigationStyle
      } = await head

      return injectAssets(
        tree,
        stylesheet(
          { style, scroll, sequence, awaitStyle, navigationStyle },
          options
        ),
        scripts({ script, awaitScript, navigationScript }, options)
      )
    },
    { name: 'ples' }
  )
}
