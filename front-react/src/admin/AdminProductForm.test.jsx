// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen, fireEvent } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProductForm from './AdminProductForm'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProductDetail from './AdminProductDetail'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, book } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())
// Nota de lectura: Consulta la ruta y el estado que otra pantalla envió al navegar.
function Destination() { return <p>{useLocation().state?.success}</p> }
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show(path = '/admin/productos/nuevo') {
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  render(<MemoryRouter initialEntries={[path]}><Routes>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/productos/:id/editar" element={<AdminProductForm />} />
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/productos/:id" element={<AdminProductDetail />} />
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin/productos" element={<Destination />} />
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </Routes></MemoryRouter>)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function fill(stock = '0', price = '12.5') {
  // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
  for (const [label, value] of [['Código', 'LIB-NUEVO'], ['Categoría', 'Narrativa'], ['Título', 'Libro nuevo'], ['Autor', 'Autora real'], ['Precio (CLP)', price], ['Stock', stock]])
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Formulario real de libros', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('envía POST con decimales y stock cero', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(book, 201))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Producto creado correctamente.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/books')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ code: 'LIB-NUEVO', category: 'Narrativa', description: '', imageUrl: '', criticalStock: null, title: 'Libro nuevo', author: 'Autora real', price: 12.5, stock: 0 })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it.each([['-1', '12'], ['1.5', '12'], ['2147483648', '12'], ['1', '-10'], ['', '12']])('rechaza stock %s y precio %s inválidos', async (stock, price) => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(book))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill(stock, price)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('alert')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('carga el libro y actualiza mediante PUT', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(book))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/admin/productos/7/editar')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByLabelText('Título')).toHaveValue(book.title)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    fill('8')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Producto actualizado correctamente.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[1][0]).toBe('/api/books/7')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[1][1].method).toBe('PUT')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('permite reintentar al fallar la carga, sin editar datos vacíos', async () => {
    // Nota de lectura: Define fail, que se utiliza en las instrucciones siguientes.
    let fail = true
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => fail ? json({}, 404) : json(book))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/admin/productos/7/editar')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('404')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByRole('button', { name: 'Guardar cambios' })).not.toBeInTheDocument()
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    fail = false
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByLabelText('Título')).toHaveValue(book.title)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('bloquea un segundo envío mientras guarda y conserva datos si falla', async () => {
    // Nota de lectura: Define resolve, que se utiliza en las instrucciones siguientes.
    let resolve
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => new Promise((done) => { resolve = done }))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('button', { name: 'Guardando…' })).toBeDisabled()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).toHaveBeenCalledTimes(1)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    resolve(json({}, 503))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText('Título')).toHaveValue('Libro nuevo')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('consulta detalle sin escribir', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json(book))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/admin/productos/7')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText(book.title)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('link', { name: 'Editar producto' })).toHaveAttribute('href', '/admin/productos/7/editar')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
