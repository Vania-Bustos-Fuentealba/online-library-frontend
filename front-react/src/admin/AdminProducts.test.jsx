import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminProducts from './AdminProducts'
import { getProducts } from './adminData'

describe('Administración de productos', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('muestra el catálogo inicial de libros', () => {
    render(<MemoryRouter><AdminProducts /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
    expect(screen.getByText('Alas de sangre')).toBeInTheDocument()
    expect(screen.getByText('Crimen y castigo')).toBeInTheDocument()
  })

  it('filtra productos por nombre, autor o categoría', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AdminProducts /></MemoryRouter>)

    await user.type(screen.getByRole('textbox', { name: 'Buscar productos' }), 'Rebecca')

    expect(screen.getByText('Alas de sangre')).toBeInTheDocument()
    expect(screen.queryByText('Crimen y castigo')).not.toBeInTheDocument()
  })

  it('elimina un libro y guarda la lista actualizada', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AdminProducts /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Eliminar Alas de sangre' }))

    expect(screen.queryByText('Alas de sangre')).not.toBeInTheDocument()
    expect(getProducts()).toHaveLength(4)
  })

  it('conserva el libro si se cancela la confirmación', async () => {
    window.confirm.mockReturnValue(false)
    const user = userEvent.setup()
    render(<MemoryRouter><AdminProducts /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Eliminar Alas de sangre' }))

    expect(screen.getByText('Alas de sangre')).toBeInTheDocument()
    expect(getProducts()).toHaveLength(5)
  })
})
