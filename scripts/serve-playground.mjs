import { readFileSync, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const PLAYGROUND = join(ROOT, 'playground')
const DIST = join(ROOT, 'dist')
const PORT = 4173

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
}

function asset(pathname) {
  if (pathname === '/ples.css') return join(DIST, 'ples.css')
  if (pathname === '/runtime.iife.js') return join(DIST, 'runtime.iife.js')
  return join(PLAYGROUND, pathname)
}

createServer((request, response) => {
  let pathname = request.url?.split('?')[0] ?? '/'
  if (pathname === '/') pathname = '/index.html'

  let file = asset(pathname)
  if (!existsSync(file)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  response.writeHead(200, {
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream'
  })
  response.end(readFileSync(file))
}).listen(PORT)
