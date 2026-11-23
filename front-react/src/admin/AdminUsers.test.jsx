import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminUsers from './AdminUsers'
import { mockApi, json, profile } from '../test/apiHelpers'
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })
describe('Perfiles reales', () => {
  it('lista, busca y enlaza detalles sin asumir roles ni identidades de Auth', async () => {
    mockApi(() => json([profile]))
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    expect(await screen.findByText(profile.email)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: profile.name })).toHaveAttribute('href', '/admin/usuarios/42')
    await userEvent.type(screen.getByLabelText('Buscar usuarios'), 'inexistente')
    expect(screen.getByText('No se encontraron usuarios.')).toBeInTheDocument()
    expect(screen.queryByText('Administrador')).not.toBeInTheDocument()
  })
  it('no confunde errores de red con una lista vacía', async () => {
    mockApi(() => json({}, 503))
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    expect(screen.queryByText('No se encontraron usuarios.')).not.toBeInTheDocument()
  })
  it('elimina usando el ID de Auth, después de confirmar', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    let deleted = false
    const fetch = mockApi((url, options) => {
      if (options.method === 'DELETE') { deleted = true; return json(null, 204) }
      return json(deleted ? [] : [profile])
    })
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    const button = await screen.findByRole('button', { name: /Eliminar Persona/ })
    await userEvent.click(button)
    expect(fetch).toHaveBeenCalledTimes(1)
    confirm.mockReturnValue(true)
    await userEvent.click(button)
    expect(await screen.findByText('Cuenta eliminada correctamente.')).toBeInTheDocument()
    expect(fetch.mock.calls[1][0]).toBe('/api/auth/users/42')
    expect(await screen.findByText('No se encontraron usuarios.')).toBeInTheDocument()
  })
  it('mantiene la cuenta cuando el servidor rechaza borrarla', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockApi((url, options) => options.method === 'DELETE' ? json({ message: 'Cuenta protegida' }, 409) : json([profile]))
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)
    await userEvent.click(await screen.findByRole('button', { name: /Eliminar Persona/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Cuenta protegida')
    expect(screen.getByText(profile.email)).toBeInTheDocument()
  })
})
