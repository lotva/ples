const SELECTOR = '[data-ples]'
const SHOWN_CLASS = 'ples-shown'
const STREAM_ATTRIBUTE = 'data-ples-stream'

function candidates(): NodeListOf<HTMLElement> {
  return document.querySelectorAll<HTMLElement>(SELECTOR)
}

function markShown(elements: Iterable<HTMLElement>): void {
  for (let element of elements) element.classList.add(SHOWN_CLASS)
}

function enableStreamMode(): void {
  document.documentElement.setAttribute(STREAM_ATTRIBUTE, '')
}

function show(elements: Iterable<HTMLElement>): void {
  markShown(elements)
  enableStreamMode()
}

function play(elements: ArrayLike<HTMLElement> & Iterable<HTMLElement>): void {
  if (elements.length === 0) {
    enableStreamMode()
    return
  }

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      show(elements)
    })
  )
}

export function listen(): void {
  function handleReveal(event?: PageRevealEvent): void {
    let elements = candidates()

    try {
      if (event?.viewTransition) {
        show(elements)
        return
      }

      play(elements)
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
