/**
 * Optional opt-out for reload and in-app navigations.
 * Load after the core runtime. Fresh visits always animate.
 */
addEventListener(
  'pagereveal',
  () => {
    let activation = globalThis.navigation?.activation
    let type = activation?.navigationType
    let kind: 'reload' | 'navigate' | null = null

    if (type === 'reload') {
      kind = 'reload'
    } else if (type !== 'traverse' && activation?.from) {
      kind = 'navigate'
    }

    if (!kind) return

    document
      .querySelectorAll(
        `html[data-ples-${kind}="false"] [data-ples]:not([data-ples-${kind}]), [data-ples][data-ples-${kind}="false"]`
      )
      .forEach(element => {
        element.classList.add('ples-shown')
      })
  },
  { once: true }
)
