import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        background: resolve(__dirname, 'src/extension-scripts/background.js'),
        content: resolve(__dirname, 'src/extension-scripts/content.js')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
})
