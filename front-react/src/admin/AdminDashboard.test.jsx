// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, afterEach, vi } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen, within } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import AdminDashboard from './AdminDashboard'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { mockApi, json, book, profile } from '../test/apiHelpers'
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => vi.unstubAllGlobals())

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Resumen desde API', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('cuenta libros y perfiles reales y aplica el umbral inclusivo de stock', async () => {
    // Nota de lectura: Persiste el valor en este navegador; esto no concede permisos en el servidor.
    localStorage.setItem('usuarios', JSON.stringify(Array(20).fill({})))
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi((url) => json(url.endsWith('/books') ? [book, { ...book, id: 8, stock: 6 }, { ...book, id: 9, stock: 0 }] : [profile]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await screen.findByText('3')
    // Nota de lectura: Define region, que se utiliza en las instrucciones siguientes.
    const region = screen.getByRole('region', { name: 'Indicadores' })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(within(region).getByText('1')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(within(region).getByText('2')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByText('20')).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('un fallo parcial no aparece como cero y permite reintentar', async () => {
    // Nota de lectura: Define fail, que se utiliza en las instrucciones siguientes.
    let fail = true
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi((url) => url.endsWith('/users') && fail ? json({}, 503) : json(url.endsWith('/books') ? [book] : [profile]))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    // Nota de lectura: Asigna o compara el valor de esta parte de la expresión.
    fail = false
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await userEvent.click(screen.getByRole('button', { name: /Reintentar usuarios/ }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findAllByText('1')).toHaveLength(3)
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
