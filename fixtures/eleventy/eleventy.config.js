import ples from 'ples/eleventy'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(ples)
}

export const config = {
  dir: {
    input: 'src',
    output: 'dist'
  }
}
