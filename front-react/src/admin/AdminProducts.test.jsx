// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProducts from './AdminProducts'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, book } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show() { render(<MemoryRouter><AdminProducts /></MemoryRouter>) }
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Productos mediante Gateway', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('lista y busca los libros reales y muestra stock bajo inclusivo', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json([book]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('link', { name: book.title })).toHaveAttribute('href', '/admin/productos/7')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('5 (Stock bajo)')).toBeInTheDocument()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.type(screen.getByLabelText('Buscar productos'), ' inexistente ')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('elimina únicamente tras confirmar y recibir éxito del servidor', async () => {
    // Nota de lectura: Define confirm, que se utiliza en las instrucciones siguientes.
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi((url, options) => options.method === 'DELETE' ? json(null, 204) : json([book]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Define button, que se utiliza en las instrucciones siguientes.
    const button = await screen.findByRole('button', { name: /Eliminar Libro/ })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(button)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).toHaveBeenCalledTimes(1)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    confirm.mockReturnValue(true)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(button)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('status')).toHaveTextContent('eliminado correctamente')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[1][0]).toBe('/api/books/7')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByRole('link', { name: book.title })).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('conserva el libro ante un rechazo del servidor', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi((url, options) => options.method === 'DELETE' ? json({}, 403) : json([book]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(await screen.findByRole('button', { name: /Eliminar Libro/ }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('permisos')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('link', { name: book.title })).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('permite reintentar una carga fallida y rechaza estructuras inválidas', async () => {
    // Nota de lectura: Define fail, que se utiliza en las instrucciones siguientes.
    let fail = true
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json(fail ? {} : [book]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('lista de libros inválida')
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    fail = false
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Recargar lista' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('link', { name: book.title })).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
