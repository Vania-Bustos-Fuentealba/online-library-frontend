import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './AdminLayout'

function renderAdmin() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}><Route index element={<p>Contenido del panel</p>} /></Route>
        <Route path="/login" element={<p>Inicio de sesión</p>} />
        <Route path="/blog" element={<p>Sitio público</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Acceso al panel administrativo', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('redirige al inicio de sesión si no hay una sesión administrativa', () => {
    renderAdmin()

    expect(screen.getByText('Inicio de sesión')).toBeInTheDocument()
  })

  it('permite entrar a administradores y cerrar la sesión', async () => {
    localStorage.setItem('sesion', JSON.stringify({ id: 1, rol: 'admin' }))
    const user = userEvent.setup()
    renderAdmin()

    expect(screen.getByText('Contenido del panel')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(screen.getByText('Inicio de sesión')).toBeInTheDocument()
    expect(localStorage.getItem('sesion')).toBeNull()
  })
})
