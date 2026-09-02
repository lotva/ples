import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: { runtime: 'src/runtime.ts' },
    format: 'iife',
    minify: true,
    dts: false,
  },
  {
    entry: { ples: 'styles/ples.css' },
    dts: false,
    css: {
      minify: true,
      fileName: 'ples.css',
      target: false,
    },
  },
])
