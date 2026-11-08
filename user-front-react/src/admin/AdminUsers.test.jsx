import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminUsers from './AdminUsers'
import { obtenerUsuarios } from '../data/usuarios'

describe('Administración de usuarios', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('muestra las cuentas existentes sin exponer contraseñas', () => {
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)

    expect(screen.getByText('Admin Online Library')).toBeInTheDocument()
    expect(screen.getByText('Cliente De Prueba')).toBeInTheDocument()
    expect(screen.queryByText('1234')).not.toBeInTheDocument()
  })

  it('elimina una cuenta usando el mismo módulo de datos que registro e inicio de sesión', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Eliminar Admin Online Library' }))

    expect(obtenerUsuarios()).toHaveLength(1)
    expect(screen.queryByText('Admin Online Library')).not.toBeInTheDocument()
  })

  it('conserva la cuenta si se cancela la confirmación', async () => {
    window.confirm.mockReturnValue(false)
    const user = userEvent.setup()
    render(<MemoryRouter><AdminUsers /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Eliminar Admin Online Library' }))

    expect(obtenerUsuarios()).toHaveLength(2)
    expect(screen.getByText('Admin Online Library')).toBeInTheDocument()
  })
})
