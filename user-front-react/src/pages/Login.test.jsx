import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { autenticar, iniciarSesion } from '../data/usuarios'

// Mock: reemplaza el acceso a datos por funciones falsas controladas por la prueba
vi.mock('../data/usuarios', () => ({
  autenticar: vi.fn(),
  iniciarSesion: vi.fn()
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

async function completarFormulario(user, email, password) {
  await user.type(screen.getByLabelText(/correo electrónico/i), email)
  await user.type(screen.getByLabelText(/^contraseña$/i), password)
  await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra un error si las credenciales son incorrectas', async () => {
    autenticar.mockReturnValue(null)
    const user = userEvent.setup()
    renderLogin()

    await completarFormulario(user, 'cliente@gmail.com', '9999')

    expect(
      await screen.findByText('Correo o contraseña incorrectos.')
    ).toBeInTheDocument()
    expect(iniciarSesion).not.toHaveBeenCalled()
  })

  it('inicia sesión y da la bienvenida con credenciales correctas', async () => {
    autenticar.mockReturnValue({
      id: 2,
      nombre: 'Cliente',
      email: 'cliente@gmail.com',
      rol: 'cliente'
    })
    const user = userEvent.setup()
    renderLogin()

    await completarFormulario(user, 'cliente@gmail.com', '1234')

    expect(autenticar).toHaveBeenCalledWith('cliente@gmail.com', '1234')
    expect(iniciarSesion).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(/Bienvenido\/a, Cliente/)).toBeInTheDocument()
  })
})