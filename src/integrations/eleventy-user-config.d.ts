declare module '@11ty/eleventy/UserConfig' {
  type PosthtmlNode = string | PosthtmlElement

  interface PosthtmlElement {
    tag?: string
    content?: PosthtmlNode[]
  }

  interface PosthtmlTree extends Array<PosthtmlNode> {
    match(
      expression: { tag: string },
      callback: (node: PosthtmlElement) => PosthtmlElement
    ): PosthtmlTree
  }

  export default class UserConfig {
    htmlTransformer: {
      addPosthtmlPlugin(
        extensions: string,
        plugin: () => (
          tree: PosthtmlTree
        ) => PosthtmlTree | Promise<PosthtmlTree>,
        options?: { name?: string; priority?: number }
      ): void
    }
  }
}
