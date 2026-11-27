// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { defineConfig } from 'vitest/config'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import react from '@vitejs/plugin-react'

// Nota de lectura: Hace disponible el componente principal para importarlo desde otra parte de la aplicación.
export default defineConfig({
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  plugins: [react()],

  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  server: {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    proxy: {
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      '/api': {
        // Se puede apuntar a un Gateway de pruebas sin cambiar las rutas de la aplicación.
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        target: process.env.GATEWAY_URL || 'http://localhost:8080',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        changeOrigin: true,
        // Nota de lectura: Define una función corta usada como callback, condición o transformación.
        rewrite: (path) => path.replace(/^\/api/, ''),
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      },
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },

  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  test: {
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    environment: 'jsdom',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    globals: true,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    setupFiles: './src/test/setup.js',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    css: false,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    coverage: {
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      provider: 'v8',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      reporter: ['text', 'html'],
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      exclude: ['**/*.test.*'],
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      include: [
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/admin/**/*.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/admin/adminApi.js',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/admin/useAdminResource.js',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/services/api.js',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/data/usuarios.js',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/pages/Login.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/pages/Registro.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/pages/Contacto.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/pages/Checkout.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/pages/Carrito.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/components/CampoFormulario.jsx',
        // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
        'src/utils/**',
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      ],
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    },
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  },
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
