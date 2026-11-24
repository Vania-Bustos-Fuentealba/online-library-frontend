import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        // Se puede apuntar a un Gateway de pruebas sin cambiar las rutas de la aplicación.
        target: process.env.GATEWAY_URL || 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.test.*'],
      include: [
        'src/admin/**/*.jsx',
        'src/admin/adminApi.js',
        'src/admin/useAdminResource.js',
        'src/services/api.js',
        'src/data/usuarios.js',
        'src/pages/Login.jsx',
        'src/pages/Registro.jsx',
        'src/pages/Contacto.jsx',
        'src/pages/Checkout.jsx',
        'src/pages/Carrito.jsx',
        'src/components/CampoFormulario.jsx',
        'src/utils/**',
      ],
    },
  },
})
