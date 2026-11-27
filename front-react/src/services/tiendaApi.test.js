// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { afterEach, expect, it, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerLibros, obtenerLibro, crearPedido } from './tiendaApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { json, mockApi, session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
it('usa los libros reales y permite leer el catálogo sin sesión', async () => {
  // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
  const fetch = mockApi(() => json([{ id: 3, title: 'Libro real', author: 'Autora', price: 14990.5, stock: 2 }]))
  // Nota de lectura: Define libros, que se utiliza en las instrucciones siguientes.
  const libros = await obtenerLibros()
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(libros[0]).toMatchObject({ id: 3, nombre: 'Libro real', precio: 14990.5, stock: 2 })
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(fetch.mock.calls[0][0]).toBe('/api/books')
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(fetch.mock.calls[0][1].headers.has('Authorization')).toBe(false)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
it('rechaza un catálogo inválido y un identificador que no sea numérico', async () => {
  // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
  const fetch = mockApi(() => json({ items: [] }))
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await expect(obtenerLibros()).rejects.toThrow('lista de libros válida')
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await expect(obtenerLibro('../otro')).rejects.toThrow('No se encontró')
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(fetch).toHaveBeenCalledTimes(1)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
it('confirma el pedido usando sesión y clave de reintento, sin inventar un pago', async () => {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  session('CLIENT')
  // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
  const fetch = mockApi(() => json({ id: 9, total: 19000, estado: 'PENDIENTE_PAGO' }, 201))
  // Nota de lectura: Define solicitud, que se utiliza en las instrucciones siguientes.
  const solicitud = { items: [{ libroId: 3, cantidad: 1 }] }
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect((await crearPedido(solicitud, 'clave-reintento-123')).id).toBe(9)
  // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
  const [url, options] = fetch.mock.calls[0]
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(url).toBe('/api/pedidos')
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(options.headers.get('Idempotency-Key')).toBe('clave-reintento-123')
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(options.headers.get('Authorization')).toMatch(/^Bearer /)
  // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
  expect(JSON.parse(options.body)).toEqual(solicitud)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
it('no confirma un pedido con respuesta inválida', async () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  mockApi(() => json({ mensaje: 'ok' }))
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await expect(crearPedido({}, 'clave-reintento-123')).rejects.toThrow('confirmar la respuesta')
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
