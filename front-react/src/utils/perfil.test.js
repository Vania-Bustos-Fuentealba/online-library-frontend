// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, expect, it } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { validarPerfil, datosPerfil, errorPassword } from './perfil'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { profile } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Validaciones ERS compartidas', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('acepta datos válidos y convierte una fecha opcional vacía a null', () => {
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(validarPerfil(profile)).toEqual({})
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(datosPerfil({ ...profile, birthDate: '' }).birthDate).toBeNull()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(errorPassword('1234', '1234', true)).toBe('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza RUN incorrecto, comuna ajena, correo y fecha futura', () => {
    // Nota de lectura: Define errors, que se utiliza en las instrucciones siguientes.
    const errors = validarPerfil({ ...profile, run: '123456784', commune: 'Valparaíso', email: 'persona@example.com', birthDate: '2999-01-01' })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(Object.keys(errors).sort()).toEqual(['birthDate', 'commune', 'email', 'run'])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza campos demasiado largos y contraseña fuera de rango', () => {
    // Nota de lectura: Define errors, que se utiliza en las instrucciones siguientes.
    const errors = validarPerfil({ ...profile, name: 'a'.repeat(51), lastName: 'a'.repeat(101), address: 'a'.repeat(301) })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(Object.keys(errors).sort()).toEqual(['address', 'lastName', 'name'])
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(errorPassword('123', '123', true)).not.toBe('')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(errorPassword('12345678901', '12345678901', true)).not.toBe('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
