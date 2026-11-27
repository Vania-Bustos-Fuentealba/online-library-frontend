// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminUsers from './AdminUsers'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, profile } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Perfiles reales', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('lista, busca y enlaza detalles sin asumir roles ni identidades de Auth', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json([profile]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText(profile.email)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('link', { name: profile.name })).toHaveAttribute('href', '/admin/usuarios/42')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.type(screen.getByLabelText('Buscar usuarios'), 'inexistente')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('No se encontraron usuarios.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByText('Administrador')).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no confunde errores de red con una lista vacía', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({}, 503))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByText('No se encontraron usuarios.')).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('elimina usando el ID de Auth, después de confirmar', async () => {
    // Nota de lectura: Define confirm, que se utiliza en las instrucciones siguientes.
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    // Nota de lectura: Define deleted, que se utiliza en las instrucciones siguientes.
    let deleted = false
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi((url, options) => {
      // Nota de lectura: Evalúa una condición. El bloque solo continúa por esta rama si se cumple.
      if (options.method === 'DELETE') { deleted = true; return json(null, 204) }
      // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
      return json(deleted ? [] : [profile])
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    // Nota de lectura: Define button, que se utiliza en las instrucciones siguientes.
    const button = await screen.findByRole('button', { name: /Eliminar Persona/ })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(button)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).toHaveBeenCalledTimes(1)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    confirm.mockReturnValue(true)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(button)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('Cuenta eliminada correctamente.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[1][0]).toBe('/api/auth/users/42')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('No se encontraron usuarios.')).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('mantiene la cuenta cuando el servidor rechaza borrarla', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi((url, options) => options.method === 'DELETE' ? json({ message: 'Cuenta protegida' }, 409) : json([profile]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(await screen.findByRole('button', { name: /Eliminar Persona/ }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('Cuenta protegida')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText(profile.email)).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
