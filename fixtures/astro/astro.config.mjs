import ples from '@lotva/ples/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [ples({ effects: ['zoom'] })]
})
