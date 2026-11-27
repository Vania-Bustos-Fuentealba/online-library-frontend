// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen, fireEvent } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter, Route, Routes } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Registro from './Registro'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, profile } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())
// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function show() {
  // Nota de lectura: Declara qué componente se muestra para esa ruta.
  render(<MemoryRouter initialEntries={['/registro']}><Routes><Route path="/registro" element={<Registro />} /><Route path="/login" element={<p>Volver a iniciar sesión</p>} /></Routes></MemoryRouter>)
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Registro compatible con Auth', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no envía campos vacíos', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText('Nombre completo')).toHaveClass('is-invalid')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('registra con campos reales sin asignarse un rol', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(profile, 201))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    show()
    // Nota de lectura: Recorre los elementos indicados y ejecuta el bloque para cada uno.
    for (const [label, value] of [['Nombre completo', 'Persona real'], ['Correo electrónico', profile.email], ['Contraseña', 'clave123'], ['Confirmar contraseña', 'clave123']])
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Volver a iniciar sesión')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/register')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ name: 'Persona real', email: profile.email, password: 'clave123' })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(localStorage.getItem('token')).toBeNull()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
