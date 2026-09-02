import {
  classifyNavigation,
  wantsNavigateAnimation,
  wantsReloadAnimation
} from './navigation.js'

const SELECTOR = '[data-ples]'
const SHOWN_CLASS = 'ples-shown'

function candidates(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(SELECTOR)]
}

function show(elements: Iterable<HTMLElement>): void {
  for (let element of elements) element.classList.add(SHOWN_CLASS)
}

function play(elements: HTMLElement[]): void {
  if (elements.length === 0) return
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      show(elements)
    })
  )
}

function partition(elements: HTMLElement[]): {
  animate: HTMLElement[]
  instant: HTMLElement[]
} {
  let animate: HTMLElement[] = []
  let instant: HTMLElement[] = []

  for (let element of elements) {
    let target = wantsNavigateAnimation(element) ? animate : instant
    target.push(element)
  }

  return { animate, instant }
}

export function listen(): void {
  function handleReveal(event?: PageRevealEvent): void {
    let elements = candidates()

    try {
      if (event?.viewTransition) {
        show(elements)
        return
      }

      let kind = classifyNavigation()

      if (kind === 'fresh') {
        play(elements)
        return
      }

      if (kind === 'reload') {
        if (wantsReloadAnimation()) play(elements)
        else show(elements)
        return
      }

      let { animate, instant } = partition(elements)
      show(instant)
      play(animate)
    } catch {
      show(elements)
    }
  }

  try {
    if ('onpagereveal' in window) {
      window.addEventListener('pagereveal', handleReveal, { once: true })
    } else {
      requestAnimationFrame(() => {
        handleReveal()
      })
    }
  } catch {
    show(candidates())
  }
}
