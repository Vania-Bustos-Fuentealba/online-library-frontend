// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen, fireEvent } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter, Route, Routes } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Login from './Login'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { obtenerSesion } from '../data/usuarios'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, jwt } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show() {
  // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
  render(<MemoryRouter initialEntries={['/login']}><Routes>
    {/* Nota de lectura: Declara qué componente se muestra para esa ruta. */}
    <Route path="/login" element={<Login />} /><Route path="/admin" element={<p>Panel admin</p>} /><Route path="/productos" element={<p>Catálogo</p>} />
  {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
  </Routes></MemoryRouter>)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function fill() {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'admin@example.com' } })
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'clave123' } })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Login real', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it.each([['ADMIN', 'Panel admin'], ['CLIENT', 'Catálogo']])('inicia sesión %s por Gateway', async (role, destination) => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({ token: jwt(role), email: 'admin@example.com', role }))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText(destination)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion().rol).toBe(role === 'ADMIN' ? 'admin' : 'cliente')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/login')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ email: 'admin@example.com', password: 'clave123' })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('informa credenciales incorrectas y no crea sesión', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({ details: 'Credenciales incorrectas' }, 400))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion()).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it.each([{ email: 'admin@example.com', role: 'ADMIN' }, { token: jwt(), email: 'otra@example.com', role: 'ADMIN' }])('rechaza respuesta incompleta o incoherente', async (response) => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json(response))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show(); fill()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(obtenerSesion()).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
