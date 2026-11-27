// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import '@testing-library/jest-dom/vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { afterEach } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cleanup } from '@testing-library/react'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  cleanup()
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  localStorage.clear()
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
