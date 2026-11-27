// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen, act } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter, Route, Routes } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminLayout from './AdminLayout'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { solicitar } from '../services/api'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { session, mockApi, json } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show() {
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  render(<MemoryRouter initialEntries={['/admin/usuarios']}><Routes>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/admin" element={<AdminLayout />}><Route path="usuarios" element={<p>Panel protegido</p>} /></Route>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/login" element={<p>Login requerido</p>} />
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/productos" element={<p>Tienda</p>} />
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </Routes></MemoryRouter>)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Acceso administrativo y ciclo de sesión', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('protege URL directas sin sesión', () => { show(); expect(screen.getByText('Login requerido')).toBeInTheDocument() })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza una sesión local falsa sin JWT', () => {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('sesion', JSON.stringify({ rol: 'admin' }))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); expect(screen.getByText('Login requerido')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('redirige CLIENT a la tienda', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('CLIENT'); show(); expect(screen.getByText('Tienda')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('permite ADMIN, marca navegación y cierra sesión', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session(); show()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Panel protegido')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('link', { name: 'Usuarios' })).toHaveAttribute('aria-current', 'page')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('vence automáticamente sin recargar', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.useFakeTimers()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('ADMIN', { exp: Math.floor(Date.now() / 1000) + 2 })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    act(() => vi.advanceTimersByTime(2100))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('escucha el cierre de otra pestaña', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session(); show()
    // Nota de lectura: Retira esa parte de la sesión almacenada localmente.
    act(() => { localStorage.removeItem('token'); window.dispatchEvent(new StorageEvent('storage', { key: 'token' })) })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('sale inmediatamente tras un 401', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    session(); show(); mockApi(() => json({}, 401))
    // Nota de lectura: Inicia una solicitud HTTP al recurso indicado. await espera su resultado antes de seguir.
    await act(async () => { await solicitar('/users').catch(() => {}) })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Login requerido')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
