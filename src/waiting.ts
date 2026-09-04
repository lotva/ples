const SELECTOR = '[data-ples]'
const READY = 'ples-ready'

function imageReady(image: HTMLImageElement): Promise<void> {
  if (image.loading === 'lazy' && !image.complete) return Promise.resolve()
  return image.decode().catch(() => {})
}

function videoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= 2 || video.error || video.preload === 'none') {
    return Promise.resolve()
  }

  return new Promise<void>(resolve => {
    let done = (): void => {
      resolve()
    }
    video.addEventListener('loadeddata', done, { once: true })
    video.addEventListener('error', done, { once: true })
    video.addEventListener('suspend', done, { once: true })
  })
}

function wait(root: Element): Promise<void[]> {
  let jobs: Promise<void>[] = []

  for (let node of [root, ...root.querySelectorAll('img,video')]) {
    if (node instanceof HTMLImageElement) jobs.push(imageReady(node))
    else if (node instanceof HTMLVideoElement) jobs.push(videoReady(node))
  }

  return Promise.all(jobs)
}

function reveal(element: HTMLElement): void {
  void wait(element).then(() => {
    element.classList.add(READY)
  })
}

function scan(root: ParentNode): void {
  if (root instanceof HTMLElement && root.hasAttribute('data-ples')) {
    reveal(root)
  }

  for (let element of root.querySelectorAll<HTMLElement>(SELECTOR)) {
    reveal(element)
  }
}

function listen(): void {
  scan(document)

  new MutationObserver(records => {
    for (let record of records) {
      for (let node of record.addedNodes) {
        if (node instanceof Element) scan(node)
      }
    }
  }).observe(document, { childList: true, subtree: true })
}

listen()
