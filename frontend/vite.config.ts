import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: '../electron/dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
})
