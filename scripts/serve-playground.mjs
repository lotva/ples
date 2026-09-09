import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const PLAYGROUND = join(ROOT, 'playground')
const DIST = join(ROOT, 'dist')
const PORT = 4173
const STREAM_DELAY_MS = 250
const SLOW_IMAGE_MS = 400
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)
const ENCODER = new TextEncoder()

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
}

const STREAMED_CHUNK = `
    <section id="streamed" data-ples data-ples-effect="slide">
      <h1>Streamed chunk</h1>
      <p>Arrived after pagereveal; revealed by @starting-style.</p>
    </section>
`

function asset(pathname) {
  if (pathname === '/ples.css') return join(DIST, 'ples.css')
  if (/^\/effects\/(relax|zoom|screw|focus)\.css$/.test(pathname)) {
    return join(DIST, pathname.slice(1))
  }
  if (pathname === '/scroll.css') return join(DIST, 'scroll.css')
  if (pathname === '/sequence.css') return join(DIST, 'sequence.css')
  if (pathname === '/await.css') return join(DIST, 'await.css')
  if (pathname === '/navigation.css') return join(DIST, 'navigation.css')
  if (pathname === '/runtime.iife.js') return join(DIST, 'runtime.iife.js')
  if (pathname === '/await.iife.js') return join(DIST, 'await.iife.js')
  if (pathname === '/navigation.iife.js') {
    return join(DIST, 'navigation.iife.js')
  }
  return join(PLAYGROUND, pathname)
}

function streamPage(before, after) {
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(ENCODER.encode(before))
      await delay(STREAM_DELAY_MS)
      controller.enqueue(ENCODER.encode(`${STREAMED_CHUNK}${after}`))
      controller.close()
    }
  })
}

createServer(async (request, response) => {
  let pathname = request.url?.split('?')[0] ?? '/'
  if (pathname === '/') pathname = '/index.html'

  if (pathname === '/slow.png') {
    await delay(SLOW_IMAGE_MS)
    response.writeHead(200, { 'Content-Type': 'image/png' })
    response.end(PIXEL)
    return
  }

  let file = asset(pathname)
  if (!existsSync(file)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  let type = MIME[extname(file)] ?? 'application/octet-stream'

  if (pathname === '/stream.html') {
    let html = readFileSync(file, 'utf8')
    let [before, after = ''] = html.split('<!--STREAM-->')

    response.writeHead(200, { 'Content-Type': type })
    await pipeline(Readable.fromWeb(streamPage(before, after)), response)
    return
  }

  response.writeHead(200, { 'Content-Type': type })
  response.end(readFileSync(file))
}).listen(PORT)
