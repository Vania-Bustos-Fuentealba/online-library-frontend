// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, vi, afterEach } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from './api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { json, mockApi, session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Cliente HTTP del Gateway', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('serializa JSON y envía Bearer por /api', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({ id: 3 }))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await solicitar('/books', { method: 'POST', body: { title: 'Libro' } })
    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const [url, options] = fetch.mock.calls[0]
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(url).toBe('/api/books')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(options.headers.get('Authorization')).toBe(`Bearer ${localStorage.getItem('token')}`)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(options.headers.get('Content-Type')).toBe('application/json')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(options.body)).toEqual({ title: 'Libro' })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no adjunta el token al login público', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({}))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await solicitar('/auth/login', { autenticar: false })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][1].headers.has('Authorization')).toBe(false)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('un 401 limpia y notifica inmediatamente a las pantallas', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Define listener, que se utiliza en las instrucciones siguientes.
    const listener = vi.fn()
    // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
    window.addEventListener('sesion-cambiada', listener)
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({}, 401))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/users')).rejects.toThrow('Inicia sesión')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBeNull()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('sesion')).toBeNull()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(listener).toHaveBeenCalledOnce()
    // Nota de lectura: Retira el listener para evitar duplicados o mantener pantallas ya cerradas.
    window.removeEventListener('sesion-cambiada', listener)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('un 401 de una petición antigua no borra una sesión nueva', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    mockApi(() => { localStorage.setItem('token', 'nuevo'); return json({}, 401) })
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/users')).rejects.toThrow()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBe('nuevo')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('un 403 conserva la sesión y explica el permiso faltante', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session()
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({}, 403))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/users')).rejects.toThrow('permisos')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).not.toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra errores de validación de Spring', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({ errors: { title: 'El título es obligatorio' } }, 400))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/books')).rejects.toThrow('El título es obligatorio')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra conflictos de negocio y oculta detalles internos 500', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({ details: 'El correo ya está registrado' }, 400))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/auth/register')).rejects.toThrow('El correo ya está registrado')
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({ details: 'SQL secreto' }, 500))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/books')).rejects.toThrow('operación (500)')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('acepta un DELETE sin cuerpo y rechaza HTML inesperado', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json(null, 204))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/books/7', { method: 'DELETE' })).resolves.toBeNull()
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => new Response('<html>Vite</html>'))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/books')).rejects.toThrow('Gateway')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('explica los fallos de red', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => { throw new TypeError('Failed to fetch') })
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await expect(solicitar('/books')).rejects.toThrow('conectar')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('termina la espera si el Gateway no responde', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.useFakeTimers()
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi((url, options) => new Promise((resolve, reject) => {
      // Nota de lectura: Activa la función indicada cuando ocurre ese evento.
      options.signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')))
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    }))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    const result = expect(solicitar('/books')).rejects.toThrow('tardó demasiado')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await vi.advanceTimersByTimeAsync(15000)
    // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
    await result
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
