import ples from 'ples/eleventy'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(ples, { effects: ['zoom'] })
}

export const config = {
  dir: {
    input: 'src',
    output: 'dist'
  }
}
