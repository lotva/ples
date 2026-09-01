import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    ples: 'styles/ples.css',
  },
  dts: {
    tsgo: true,
  },
  exports: true,
  css: {
    minify: true,
    fileName: 'ples.css',
    target: false,
  },
})
