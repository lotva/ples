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
    entry: { await: 'src/waiting.ts' },
    format: 'iife',
    minify: true,
    dts: false,
    hooks: {
      'build:done': scheduleBuildHead
    }
  },
  {
    entry: { navigation: 'src/navigation.ts' },
    format: 'iife',
    minify: true,
    dts: false,
    hooks: {
      'build:done': scheduleBuildHead
    }
  },
  {
    entry: {
      ples: 'styles/ples.css',
      scroll: 'styles/scroll.css',
      sequence: 'styles/sequence.css',
      await: 'styles/await.css',
      navigation: 'styles/navigation.css'
    },
    dts: false,
    css: {
      minify: true,
      splitting: true,
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
  },
  {
    entry: { vite: 'src/integrations/vite.ts' },
    dts: true,
    platform: 'node',
    deps: {
      neverBundle: ['vite', './head.mjs']
    }
  }
])
