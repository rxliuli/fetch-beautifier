import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  esbuildOptions(options) {
    options.platform = 'node'
    options.external = ['vscode']
  },
})
