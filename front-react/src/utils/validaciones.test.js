// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, expect, it } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarEmail, validarRun } from './validaciones'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('validaciones de formulario', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('acepta un RUN chileno válido y rechaza uno incorrecto', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarRun('123456785')).toBe(true)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarRun('123456780')).toBe(false)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('acepta solo correos con formato y dominios permitidos', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarEmail('persona@duoc.cl')).toBe(true)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarEmail('persona@profesor.duoc.cl')).toBe(true)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarEmail('persona@gmail.com')).toBe(true)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarEmail('persona@otro.cl')).toBe(false)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarEmail('persona@')).toBe(false)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
