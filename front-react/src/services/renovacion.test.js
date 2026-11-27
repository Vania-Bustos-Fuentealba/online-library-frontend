// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { afterEach, describe, expect, it, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar, renovarSiNecesario } from './api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cerrarSesion, obtenerSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { json, jwt, mockApi, session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())
// Nota de lectura: Define nearExpiry, que se utiliza en las instrucciones siguientes.
const nearExpiry = () => session('ADMIN', { exp: Math.floor(Date.now() / 1000) + 60 })

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Renovación antes del vencimiento', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('comparte la renovación concurrente y aplica el rol devuelto por Auth', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    nearExpiry()
    // Nota de lectura: Define nuevo, que se utiliza en las instrucciones siguientes.
    const nuevo = jwt('CLIENT')
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi((url) => url === '/api/auth/refresh'
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      ? json({ email: 'admin@example.com', role: 'CLIENT', token: nuevo }) : json([]))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await Promise.all([solicitar('/books'), solicitar('/books')])
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls.filter(([url]) => url === '/api/auth/refresh')).toHaveLength(1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion().rol).toBe('cliente')
    // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
    for (const [url, options] of fetch.mock.calls) {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (url === '/api/books') expect(options.headers.get('Authorization')).toBe(`Bearer ${nuevo}`)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('una respuesta tardía no restaura una sesión cerrada', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    nearExpiry()
    // Nota de lectura: Define resolve, que se utiliza en las instrucciones siguientes.
    let resolve
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => new Promise(done => { resolve = done }))
    // Nota de lectura: Define pending, que se utiliza en las instrucciones siguientes.
    const pending = renovarSiNecesario()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    cerrarSesion()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    resolve(json({ email: 'admin@example.com', role: 'ADMIN', token: jwt() }))
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    await pending
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBeNull()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion()).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('una renovación rechazada cierra la sesión y no envía la operación protegida', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    nearExpiry()
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({}, 401))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/auth/users')).rejects.toThrow('Inicia sesión nuevamente')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).toHaveBeenCalledTimes(1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no renueva sesiones vencidas, ausentes o con suficiente tiempo restante', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({}))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await renovarSiNecesario()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await renovarSiNecesario()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('ADMIN', { exp: Math.floor(Date.now() / 1000) - 1 })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await renovarSiNecesario()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
