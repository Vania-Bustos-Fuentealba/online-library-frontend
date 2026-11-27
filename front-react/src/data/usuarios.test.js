// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { iniciarSesion, obtenerSesion, cerrarSesion } from './usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { jwt, session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Sesión JWT, sin autenticación simulada', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('persiste tras una nueva lectura sin guardar contraseñas', () => {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('token', jwt())
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    iniciarSesion({ email: 'admin@example.com', password: 'no guardar' })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion()).toMatchObject({ email: 'admin@example.com', rol: 'admin' })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('sesion')).not.toContain('no guardar')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no acepta un rol administrativo modificado en localStorage', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('CLIENT')
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('sesion', JSON.stringify({ email: 'admin@example.com', rol: 'admin' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion().rol).toBe('cliente')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it.each([jwt('ADMIN', { exp: 1 }), jwt('SELLER'), 'invalido', jwt('ADMIN', { sub: '' })])('rechaza token inválido %s', (token) => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('token', token)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion()).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza una identidad diferente de la del token', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(() => iniciarSesion({ email: 'otra@example.com' })).toThrow('token')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('cierra sesión y publica el cambio', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Define listener, que se utiliza en las instrucciones siguientes.
    const listener = vi.fn()
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('sesion-cambiada', listener)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cerrarSesion()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion()).toBeNull()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(listener).toHaveBeenCalledOnce()
    // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
    window.removeEventListener('sesion-cambiada', listener)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
