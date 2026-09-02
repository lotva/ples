import { defineConfig } from 'tsdown'

import { scheduleBuildHead } from './scripts/build-head.mjs'

export default defineConfig([
  {
    entry: { runtime: 'src/runtime.ts' },
    format: 'iife',
    minify: true,
    dts: false,
    hooks: {
      'build:done': scheduleBuildHead
    }
  },
  {
    entry: { ples: 'styles/ples.css' },
    dts: false,
    css: {
      minify: true,
      fileName: 'ples.css',
      target: false
    },
    hooks: {
      'build:done': scheduleBuildHead
    }
  },
  {
    entry: { astro: 'src/integrations/astro.ts' },
    dts: true,
    platform: 'node',
    deps: {
      neverBundle: ['astro', './head.mjs']
    }
  },
  {
    entry: { eleventy: 'src/integrations/eleventy.ts' },
    dts: true,
    platform: 'node',
    deps: {
      neverBundle: ['./head.mjs']
    }
  }
])
