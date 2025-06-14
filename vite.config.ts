import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/fetch-beautifier/',
  plugins: [react(), tailwindcss(), viteTsConfigPaths(), visualizer()],
  build: {
    outDir: 'dist/fetch-beautifier',
  },
})
