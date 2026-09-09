import { defineConfig } from 'astro/config'
import ples from 'ples/astro'

export default defineConfig({
  integrations: [ples({ effects: ['zoom'] })]
})
