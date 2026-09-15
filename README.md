# Ples

<img width="128" height="128" align="right" title="Ples logo" src="./.github/assets/logo.svg">

A tiny, CSS-first library for coordinating reveal animations across page loads and in-app navigations — for Astro, Eleventy, Vite, and vanilla HTML. Mark an element in HTML, and Ples reveals it in the order and with the timings you set.

```html
<h1 data-ples data-ples-effect="slide" data-ples-up="24px">Projects</h1>
<!-- Slides up 24px and fades in when the page is revealed -->
```

**Plays as soon as possible.** The animation starts at the first moment the browser allows, and only when the user sees the document.

**Supports modern navigation APIs.** Works with View Transitions and Speculation Rules prerender: does not play under a crossfade, waits until the prerendered page is actually visited.

**MPA first.** Built for document loads. Streamed HTML and client-side mounts still reveal.

**Small.** Core is 325 B JS and 465 B CSS, brotlied. Optional packages are 2.2 kB together. No dependencies.

[Why](#why) · [Guarantees](#guarantees) · [Install](#install) · [Setup](#setup) · [Basic usage](#basic-usage) · [Browser support](#browser-support) · [Optional packages](#optional-packages) · [Extra effects](#extra-effects) · [Order and timing](#order-and-timing) · [Reveal on scroll](#reveal-on-scroll) · [Reloads and in-app navigation](#reloads-and-in-app-navigation) · [Streaming and SPA](#streaming-and-spa)

## Why

When a page loads, elements appear as the browser paints them — often out of order, with a flash. With Ples you set the order, timing, and effect in HTML.

You don’t write the animation in JavaScript. The motion is CSS. A tiny script in `<head>` only picks the moment the user actually sees the document, on a first visit and on navigate or reload.

## Guarantees

**Visible by default.** Content stays shown until the script in `<head>` runs. After that it may hide for the reveal. If anything fails, it is shown again. Nothing stays hidden.

**No-JS fallback.** With JavaScript off, the reveal still plays.

**View Transition.** If a cross-document transition is already running, content shows instantly instead of stacking a second animation.

**Reduced motion.** If the system asks for less motion, content shows immediately, with no animation.

**If the script fails.** When the script throws, every marked element is shown immediately.

**You choose whether it plays on navigate and reload.** You can skip the animation on in-app navigation and on reload, or drop hold and stagger so blocks play together. A first visit always plays.

**Back-forward navigations are instant.** Restoring the page from cache does not replay the animation.

## Install

```bash
npm install @lotva/ples
```

## Setup

Put the script in `<head>` as a classic script (not `type="module"`), so it runs before first paint.

### Inline in `<head>`, any framework

Import the strings and inline them into `<head>`:

```js
import { script, style } from '@lotva/ples/head'
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
import ples from '@lotva/ples/astro'

export default defineConfig({
  integrations: [ples()]
})
```

```js
// eleventy.config.js
import ples from '@lotva/ples/eleventy'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(ples)
}
```

```js
// vite.config.js
import ples from '@lotva/ples/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [ples()]
})
```

### Files from `node_modules`

```html
<link rel="stylesheet" href="./node_modules/@lotva/ples/dist/ples.css" />
<script src="./node_modules/@lotva/ples/dist/runtime.iife.js"></script>
```

### Content Security Policy

Inline CSS and JS need hashes (or a nonce) under a strict CSP. `csp()` returns the hashes for the same strings the plugins inline — pass the same options:

```js
import { csp } from '@lotva/ples/head'

let { scriptSrc, styleSrc } = csp({ await: true, effects: ['zoom'] })
```

```http
Content-Security-Policy: script-src 'self' 'sha256-…'; style-src 'self' 'sha256-…'
```

Use the Vite or Eleventy plugin, or the manual `<style>` / `<script>` strings from `@lotva/ples/head`. Astro links CSS through imports, so `styleSrc` may not match that build — allow those stylesheets with `'self'` (or your CDN) and still use `scriptSrc` for the inline runtime.

### Mark an element

```html
<section data-ples>…this fades in on reveal…</section>
```

`data-ples` is enough to fade in on reveal. Fade is the default.

## Basic usage

Tune the built-in fade and slide from markup.

💡 Values are CSS types (`600ms`, `12px`), not unitless numbers.

`data-ples`\
Marks a reveal block. Required.

`data-ples-effect="slide"`\
Built-in effect. Fade and slide come with the default CSS. Omit it for fade.

`data-ples-duration="700ms"`\
Transition duration. Default is `600ms`.

`data-ples-hold="300ms"`\
Delay after the reveal starts. Default is `50ms`.

`data-ples-ease` and `data-ples-fade-ease`\
Timing functions. Default is `ease-out`. Fade is separate from transform and filter. Slide sets its own transform curve.

`data-ples-up="12px"` / `data-ples-down="8px"`\
For `slide`, vertical offset. Default is `20px` up. If both are set, down wins.

`data-ples-left="10px"` / `data-ples-right="24px"`\
For `slide`, horizontal offset. Default is none. Axes are independent of up/down. If both are set, right wins.

`data-ples-opaque`\
Skip the fade. The element stays opaque and only transform/filter animate.

Custom motion works through CSS variables on the element. `--ples-duration`, `--ples-hold`, `--ples-ease`, and `--ples-fade-ease` are the same knobs as the attributes. Slide builds `--ples-from` from `--ples-x` and `--ples-y`. `--ples-filter` and `--ples-opacity` are the other start values.

```html
<p data-ples style="--ples-from: translateY(8px); --ples-duration: 700ms">
  Custom start
</p>
```

## Browser support

Typed [`attr()`](https://caniuse.com/css3-attr) works in Chrome 133+, Firefox 155+, and Safari 28 Technology Preview.

Where typed `attr()` isn’t supported, value attributes (`data-ples-up`, `data-ples-duration`, …) do nothing. `data-ples` and `data-ples-effect` still match.

<details>
<summary>Support browsers without typed <code>attr()</code></summary>

Set the custom properties from [Basic usage](#basic-usage) on `style=""`. Same names, except the slide offsets:

`data-ples-up="12px"` → `--ples-y: 12px`\
`data-ples-down="8px"` → `--ples-y: -8px`\
`data-ples-left="10px"` → `--ples-x: 10px`\
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

</details>

Motion is progressive enhancement. If the browser cannot animate, the page still loads as a normal document.

## Optional packages

- [Extra effects](#extra-effects) — relax, zoom, screw, and focus.
- [Await](#await) — wait for images, videos, and other blocks.
- [Sequence](#sequence) — stagger sibling reveals.
- [Reveal on scroll](#reveal-on-scroll) — hold a block until it enters the viewport.
- [Navigation](#reloads-and-in-app-navigation) — choose whether the animation plays on navigate and reload.

A plugin option turns the package on and inlines its CSS — and the JS too, when the package includes a script. Astro and Vite take `ples({ … })`; Eleventy takes `addPlugin(ples, { … })`.

Without a plugin, add the files from `node_modules`. CSS is `dist/<name>.css`; effects live under `dist/effects/`. Await and navigation also ship `dist/<name>.iife.js` — load navigation after the core runtime.

```html
<link rel="stylesheet" href="./node_modules/@lotva/ples/dist/await.css" />
<script src="./node_modules/@lotva/ples/dist/await.iife.js"></script>
```

<details>
<summary>Inline optional packages from <code>@lotva/ples/head</code></summary>

Same as [Setup](#setup): import the extra strings and append them. CSS concatenates; IIFEs need a `;` in between.

```js
import {
  script,
  style,
  effects,
  awaitStyle,
  awaitScript
} from '@lotva/ples/head'
```

<!-- prettier-ignore -->
```html
<style>${style}${effects.zoom}${awaitStyle}</style>
<script>${script};${awaitScript}</script>
```

`effects` is `{ relax, zoom, screw, focus }`. `sequence`, `scroll`, and `navigationStyle` go on the `<style>`; `navigationScript` on the `<script>`, after a `;`.

</details>

## Extra effects

Fade and slide come with the default CSS. Relax, zoom, screw, and focus are optional.

All effects are ported from Ilya Birman’s [Emerge](https://github.com/ilyabirman/Emerge).

```diff
- integrations: [ples()]
+ integrations: [ples({ effects: ['relax', 'zoom', 'screw', 'focus'] })]
```

`data-ples-effect="relax"`\
Scale from `0.92` on the Y axis, origin `top`.

`data-ples-effect="zoom"`\
Scale from `0.5`, origin `center`.

`data-ples-effect="screw"`\
Scale from `0.5` and rotate from `90deg`, origin `center`.

`data-ples-effect="focus"`\
Lift `8px` and blur `8px`. Default duration is `800ms`.

`data-ples-scale="0.8"`\
Initial scale for relax, zoom, and screw.

`data-ples-origin="bottom"`\
Transform origin for those three.

`data-ples-angle="-90deg"`\
Initial angle for screw. Negative values reverse the rotation.

`data-ples-up="12px"` and `data-ples-blur="6px"`\
For focus, the lift and blur.

💡 `--ples-filter` also works on any block without loading `focus.css`. Without typed `attr()`, origin is `--ples-origin`; scale, angle, and blur go on `--ples-from` and `--ples-filter`.

### Your own effect

An extra effect is a selector that sets the custom properties from [Basic usage](#basic-usage). This is `focus`:

```css
[data-ples-effect='focus'] {
  --ples-from: translate(0, 8px);
  --ples-filter: blur(8px);
  --ples-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ples-fade-ease: var(--ples-ease);
  --ples-duration: 800ms;
}
```

Pick another name and your own start values. Then `data-ples-effect="…"` uses it — no extra JS.

Where typed `attr()` is supported, map attributes so markup can override the defaults — `data-ples-up` and `data-ples-blur` on focus:

```css
@supports (transition-delay: attr(data-ples-hold type(<time>), 0ms)) {
  [data-ples-effect='focus'] {
    --ples-from: translate(0, attr(data-ples-up type(<length>), 8px));
    --ples-filter: blur(attr(data-ples-blur type(<length>), 8px));
  }
}
```

## Order and timing

### Await

Wait for images and videos (and for other reveal blocks) before playing.

```diff
- integrations: [ples()]
+ integrations: [ples({ await: true })]
```

A block stays hidden until its images and videos are ready. Images wait to decode. Videos wait until they have data, unless `preload="none"`. Broken media fails open.

`data-ples-await="photo"`\
Wait for `#photo` to become ready (not for its animation to finish). That target should also be `[data-ples]`. Missing or cyclic ids fail open.

`data-ples-continue`\
Wait for the previous `[data-ples]` in document order. Ignored if `data-ples-await` is set.

`data-ples-await="false"`\
Do not wait for this block’s own media.

```html
<section data-ples>
  <img src="/hero.jpg" alt="" />
</section>
<section data-ples data-ples-continue>Wait for the previous block</section>
```

Wait for a named block, then hold:

```html
<section data-ples data-ples-await="hero" data-ples-hold="500ms">
  After hero is ready, then 500ms
</section>
<section id="hero" data-ples>
  <img src="/hero.jpg" alt="" />
</section>
```

While a block waits, it stays invisible. Put the skeleton on a parent of `[data-ples]`. Scope it to `.ples` so nothing shows when JavaScript is off:

```html
<figure class="figure">
  <img data-ples src="/hero.jpg" alt="" width="800" height="450" />
</figure>
```

```css
.figure {
  position: relative;

  .ples &::before {
    pointer-events: none;
    content: '';

    position: absolute;
    z-index: 1;
    inset: 0;

    background: /* your surface or shimmer */;
  }

  &:has(.ples-ready)::before {
    content: none;
  }
}
```

### Sequence

Stagger direct children without giving each one a hold.

💡 Requires: CSS `sibling-index()`. Without it, the children reveal together.

```diff
- integrations: [ples()]
+ integrations: [ples({ sequence: true })]
```

`data-ples-sequence`\
On the parent. Direct `[data-ples]` children stagger with `sibling-index()`. Default step is `100ms`.

`data-ples-sequence="80ms"`\
Custom step.

Override one child with `--ples-stagger-index`.

```html
<div data-ples-sequence="80ms">
  <p data-ples>One</p>
  <p data-ples>Two</p>
  <p data-ples>Three</p>
</div>
```

## Reveal on scroll

Hold a block until it scrolls into view.

💡 Requires: CSS `animation-trigger` / `timeline-trigger`. Without them, the block reveals with the rest of the page.

```diff
- integrations: [ples()]
+ integrations: [ples({ scroll: true })]
```

`data-ples-scroll`\
Wait until the block is fully contained in the viewport.

`data-ples-scroll="50%"`\
Fire partway through the entry range.

Hold defaults to `0ms` on scroll blocks (use `data-ples-hold` to add a pause after the trigger).

```html
<section data-ples data-ples-scroll data-ples-effect="slide">
  Below the fold
</section>
```

## Reloads and in-app navigation

By default every load animates the same way: a fresh visit, an in-app navigation, and a reload. Fresh visits always keep that animation. The optional navigation package is how you change navigate and reload.

💡 Requires: the Navigation API. Without it, every load animates like a first visit.

```diff
- integrations: [ples()]
+ integrations: [ples({ navigation: true })]
```

An element’s own attribute wins over `<html>`, which wins over the default (animate).

`data-ples-navigate="false"`\
Skip on in-app navigation. On a block, only that block skips. On `<html>`, every block skips; add `data-ples-navigate` on a block to play it anyway:

```html
<html data-ples-navigate="false">
  <section data-ples>Skipped on in-app navigation</section>
  <section data-ples data-ples-navigate>Still plays</section>
</html>
```

`data-ples-reload="false"`\
Same shape for reload.

`data-ples-navigate="together"` / `data-ples-reload="together"`\
On `<html>`: drop hold and stagger so blocks play together. Fresh visits keep their delays.

```html
<html data-ples-navigate="together" data-ples-reload="together"></html>
```

## Streaming and SPA

HTML that arrives after the first reveal — a streamed chunk, or a node a script mounts — still uses `[data-ples]`. Those nodes animate when the browser first styles them.

```html
<div data-ples data-ples-effect="slide">Streamed or mounted later</div>
```

What does not carry over to those late nodes:

- `data-ples-navigate` / `data-ples-reload` have no effect.
- A client route change only replays if the node is actually new. Patching in place does not replay.
- If the app also runs a View Transition for that insert, Ples cannot see it. That can double-animate; test it.

Ples coordinates how a document appears, not how a component mounts in a client router.
