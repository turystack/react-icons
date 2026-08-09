import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        manifest: resolve(__dirname, 'src/manifest.ts'),
        'mobile/index': resolve(__dirname, 'src/mobile/index.ts'),
        'web/index': resolve(__dirname, 'src/web/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react/jsx-runtime' ||
        id === 'react-native' ||
        id === 'react-native-svg' ||
        id.startsWith('@solar-icons/'),
      output: {
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'src'),
      },
    },
  },
})
