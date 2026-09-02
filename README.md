# Ples

A tiny, CSS-first library for coordinating reveal animations across page loads and in-app navigations — for Astro, Eleventy, Vite, and vanilla HTML. Mark an element in HTML, and Ples reveals it in the order and with the timings you set.

```html
<h1 data-ples data-ples-effect="slide" data-ples-up="24px">Projects</h1>
<!-- Slides up 24px and fades in when the page is revealed -->
```

**Plays as soon as possible.** The animation starts at the first moment the browser allows, and only when the user sees the document.

**Supports modern navigation APIs.** Works with View Transitions and Speculation Rules prerender: does not play under a crossfade, waits until the prerendered page is actually visited.

**MPA first.** Built for document loads.

**Small.** No dependencies.

[Guarantees](#guarantees) · [Install](#install) · [Setup](#setup) · [Basic usage](#basic-usage) · [Browser support](#browser-support) · [Extra effects](#extra-effects) · [Reloads and in-app navigation](#reloads-and-in-app-navigation)

## Guarantees

**Visible by default.** Content stays shown until the script in `<head>` runs. After that it may hide for the reveal. If anything fails, it is shown again. Nothing stays hidden.

**No-JS fallback.** With JavaScript off, the reveal still plays.

**View Transition.** If a cross-document transition is already running, content shows instantly instead of stacking a second animation.

**Reduced motion.** If the system asks for less motion, content shows immediately, with no animation.

**If the script fails.** When the script throws, every marked element is shown immediately.

**You choose whether it plays on navigate and reload.** You can skip the animation on in-app navigation and on reload. A first visit always plays.

## Install

```bash
npm install ples
```

## Setup

Put the script in `<head>` as a classic script (not `type="module"`), so it runs before first paint.

### Inline in `<head>`, any framework

Import the strings and inline them into `<head>`:

```js
import { script, style } from 'ples/head'
```

<!-- prettier-ignore -->
```html
<style>${style}</style>
<script>${script}</script>
```

### Astro, Eleventy, Vite

The plugins inline the CSS and JS into `<head>` for you.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import ples from 'ples/astro'

export default defineConfig({
  integrations: [ples()]
})
```

```js
// eleventy.config.js
import ples from 'ples/eleventy'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(ples)
}
```

```js
// vite.config.js
import ples from 'ples/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [ples()]
})
```

### Files from `node_modules`

```html
<link rel="stylesheet" href="./node_modules/ples/dist/ples.css" />
<script src="./node_modules/ples/dist/runtime.iife.js"></script>
```

### Mark an element

```html
<section data-ples>…this fades in on reveal…</section>
```

`data-ples` is enough to fade in on reveal. Fade is the default.

## Basic usage

Tune the built-in fade and slide from markup.

💡 Values are CSS types (`500ms`, `12px`), not unitless numbers.

`data-ples`\
Marks a reveal block. Required.

`data-ples-effect="slide"`\
Built-in effect. Fade and slide come with the default CSS. Omit it for fade.

`data-ples-duration="700ms"`\
Transition duration. Default is `500ms`.

`data-ples-hold="300ms"`\
Delay after the reveal starts. Default is `0ms`.

`data-ples-ease`\
Timing function. Default is `ease-out`.

`data-ples-up="12px"` / `data-ples-down="8px"`\
For `slide`, vertical offset. Default is `20px` up. If both are set, down wins.

`data-ples-left="10%"` / `data-ples-right="24px"`\
For `slide`, horizontal offset. Default is none. Axes are independent of up/down. If both are set, right wins.

`data-ples-opaque`\
Skip the fade. The element stays opaque and only transform animates.

Custom motion works through CSS variables on the element. `--ples-duration`, `--ples-hold`, and `--ples-ease` are the same knobs as the attributes. Slide builds `--ples-from` from `--ples-x` and `--ples-y`. `--ples-opacity` is the fade start.

```html
<p data-ples style="--ples-from: translateY(8px); --ples-duration: 700ms">
  Custom start
</p>
```

## Browser support

Typed [`attr()`](https://caniuse.com/css3-attr) works in Chrome 133+, Firefox 155+, and Safari 28 Technology Preview.

Where typed `attr()` isn’t supported, value attributes (`data-ples-up`, `data-ples-duration`, …) do nothing. `data-ples` and `data-ples-effect` still match.

To support browsers without typed `attr()`, also set the custom properties from [Basic usage](#basic-usage) on `style=""`. Same names, except the slide offsets:

`data-ples-up="12px"` → `--ples-y: 12px`\
`data-ples-down="8px"` → `--ples-y: -8px`\
`data-ples-left="10%"` → `--ples-x: 10%`\
`data-ples-right="24px"` → `--ples-x: -24px`

```html
<h1
  data-ples
  data-ples-effect="slide"
  style="--ples-y: 12px; --ples-duration: 700ms"
>
  Projects
</h1>
```

Motion is progressive enhancement. If the browser cannot animate, the page still loads as a normal document.

## Extra effects

Relax, zoom, and screw ship with the default CSS.

All effects are ported from Ilya Birman’s [Emerge](https://github.com/ilyabirman/Emerge).

💡 Requires: typed `attr()` for `data-ples-scale`, `data-ples-origin`, and `data-ples-angle`. Without it, set `--ples-origin` and put scale and angle on `--ples-from`.

`data-ples-effect="relax"`\
Scale from `0.92` on the Y axis, origin `top`.

`data-ples-effect="zoom"`\
Scale from `0.5`, origin `center`.

`data-ples-effect="screw"`\
Scale from `0.5` and rotate from `90deg`, origin `center`.

`data-ples-scale="0.8"`\
Initial scale for relax, zoom, and screw.

`data-ples-origin="bottom"`\
Transform origin for those three.

`data-ples-angle="-90deg"`\
Initial angle for screw. Negative values reverse the rotation.

## Reloads and in-app navigation

By default every load animates the same way: a fresh visit, an in-app navigation, and a reload. Fresh visits always keep that animation.

💡 Requires: the Navigation API. Without it, every load animates like a first visit.

An element’s own `data-ples-navigate` wins over `<html>`, which wins over the default (animate). Reload is set on `<html>` only.

`data-ples-navigate="false"`\
Skip on in-app navigation. On a block, only that block skips. On `<html>`, every block skips; add `data-ples-navigate` on a block to play it anyway:

```html
<html data-ples-navigate="false">
  <section data-ples>Skipped on in-app navigation</section>
  <section data-ples data-ples-navigate>Still plays</section>
</html>
```

`data-ples-reload="false"`\
On `<html>`: skip the animation on reload.
