import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminProducts from './AdminProducts'
import { mockApi, json, book } from '../test/apiHelpers'
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })
function show() { render(<MemoryRouter><AdminProducts /></MemoryRouter>) }
describe('Productos mediante Gateway', () => {
  it('lista y busca los libros reales y muestra stock bajo inclusivo', async () => {
    mockApi(() => json([book]))
    show()
    expect(await screen.findByRole('link', { name: book.title })).toHaveAttribute('href', '/admin/productos/7')
    expect(screen.getByText('5 (Stock bajo)')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Buscar productos'), ' inexistente ')
    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
  })
  it('elimina únicamente tras confirmar y recibir éxito del servidor', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const fetch = mockApi((url, options) => options.method === 'DELETE' ? json(null, 204) : json([book]))
    show()
    const button = await screen.findByRole('button', { name: /Eliminar Libro/ })
    await userEvent.click(button)
    expect(fetch).toHaveBeenCalledTimes(1)
    confirm.mockReturnValue(true)
    await userEvent.click(button)
    expect(await screen.findByRole('status')).toHaveTextContent('eliminado correctamente')
    expect(fetch.mock.calls[1][0]).toBe('/api/books/7')
    expect(screen.queryByRole('link', { name: book.title })).not.toBeInTheDocument()
  })
  it('conserva el libro ante un rechazo del servidor', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockApi((url, options) => options.method === 'DELETE' ? json({}, 403) : json([book]))
    show()
    await userEvent.click(await screen.findByRole('button', { name: /Eliminar Libro/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('permisos')
    expect(screen.getByRole('link', { name: book.title })).toBeInTheDocument()
  })
  it('permite reintentar una carga fallida y rechaza estructuras inválidas', async () => {
    let fail = true
    mockApi(() => json(fail ? {} : [book]))
    show()
    expect(await screen.findByRole('alert')).toHaveTextContent('lista de libros inválida')
    fail = false
    await userEvent.click(screen.getByRole('button', { name: 'Recargar lista' }))
    expect(await screen.findByRole('link', { name: book.title })).toBeInTheDocument()
  })
})
