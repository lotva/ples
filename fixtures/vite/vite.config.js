import ples from '@lotva/ples/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [ples({ effects: ['zoom'] })]
})
