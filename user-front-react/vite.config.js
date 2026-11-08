import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/admin/**/*.{js,jsx}', 'src/data/usuarios.js', 'src/utils/validaciones.js'],
      exclude: ['**/*.test.{js,jsx}'],
    },
  },
})
