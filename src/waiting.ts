const SELECTOR = '[data-ples]'
const READY = 'ples-ready'

let jobs = new WeakMap<Element, Promise<void>>()
let ok = Promise.resolve()

function imageReady(image: HTMLImageElement): Promise<void> {
  let decoded = (): Promise<void> => image.decode().catch(() => {})
  if (image.complete) return decoded()

  return new Promise<void>(resolve => {
    let done: EventListener = () => {
      resolve()
    }
    image.addEventListener('load', done, { once: true })
    image.addEventListener('error', done, { once: true })
  }).then(decoded)
}

function videoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= 2 || video.error || video.preload === 'none') {
    return Promise.resolve()
  }

  return new Promise<void>(resolve => {
    let done: EventListener = () => {
      resolve()
    }

    for (let type of ['loadeddata', 'error'] as const) {
      video.addEventListener(type, done, { once: true })
    }
  })
}

function wait(root: Element): Promise<unknown> {
  let media: Promise<void>[] = []

  for (let node of [root, ...root.querySelectorAll('img,video')]) {
    if (node instanceof HTMLImageElement) media.push(imageReady(node))
    else if (node instanceof HTMLVideoElement) media.push(videoReady(node))
  }

  return Promise.all(media)
}

function ready(element: HTMLElement): Promise<void> {
  let job = jobs.get(element)
  if (job) return job

  if (element.dataset.plesAwait === 'false') {
    element.classList.add(READY)
    jobs.set(element, ok)
    return ok
  }

  jobs.set(element, ok)
  let target = document.getElementById(element.dataset.plesAwait ?? '')
  job = Promise.all([wait(element), target && ready(target)]).then(() => {
    element.classList.add(READY)
  })
  jobs.set(element, job)

  return job
}

function scan(root: ParentNode): void {
  if (root instanceof HTMLElement && root.matches(SELECTOR)) void ready(root)

  for (let element of root.querySelectorAll<HTMLElement>(SELECTOR)) {
    void ready(element)
  }
}

scan(document)

new MutationObserver(records => {
  for (let record of records) {
    for (let node of record.addedNodes) {
      if (node instanceof Element) scan(node)
    }
  }
}).observe(document, { childList: true, subtree: true })
