// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { afterEach, describe, expect, it, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter, Route, Routes } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminLayout from './AdminLayout'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminProducts from './AdminProducts'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminOrders from './AdminOrders'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { book, json, mockApi, session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())
// Nota de lectura: Define order, que se utiliza en las instrucciones siguientes.
const order = { id: 8, cliente: 'Cliente de prueba', correo: 'cliente@gmail.com', total: 19990,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  estado: 'PENDIENTE_PAGO', metodoPago: 'transferencia', direccion: 'Calle 123', comuna: 'Santiago',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  items: [{ libroId: 7, nombre: 'Libro real', cantidad: 1, subtotal: 16000 }] }
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show(path) {
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  render(<MemoryRouter initialEntries={[path]}><Routes>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/vendedor" element={<AdminLayout seller />}>
      {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
      <Route path="productos" element={<AdminProducts readOnly base="/vendedor" />} />
      {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
      <Route path="pedidos" element={<AdminOrders base="/vendedor" />} />
      {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
      <Route path="pedidos/:id" element={<AdminOrders base="/vendedor" />} />
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </Route>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin" element={<AdminLayout />}><Route path="usuarios" element={<p>Usuarios privados</p>} /></Route>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/productos" element={<p>Tienda pública</p>} />
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </Routes></MemoryRouter>)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Permisos del panel Vendedor', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra catálogo sin alta, edición, eliminación ni usuarios', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('SELLER')
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json([book]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/vendedor/productos')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText(book.title)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByRole('link', { name: 'Nuevo producto' })).not.toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByRole('button', { name: /Eliminar/ })).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no permite abrir usuarios por una URL de administración', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('SELLER')
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json([book]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/admin/usuarios')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText(book.title)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByText('Usuarios privados')).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('permite consultar listado y detalle de órdenes', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('SELLER')
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(order))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/vendedor/pedidos/8')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Cliente de prueba')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/pedidos/8')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('PENDIENTE_PAGO')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute('href', '/vendedor/pedidos')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('un cliente no puede entrar al panel de ventas', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('CLIENT')
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json([]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show('/vendedor/pedidos')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Tienda pública')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
