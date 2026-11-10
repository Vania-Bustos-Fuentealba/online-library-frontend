import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Registro from './Registro'
import { regiones } from '../data/regiones'
import { crearUsuario } from '../data/usuarios'

vi.mock('../data/usuarios', () => ({
  crearUsuario: vi.fn()
}))

function renderRegistro() {
  return render(
    <MemoryRouter initialEntries={['/registro']}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Registro', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('marca los campos obligatorios como inválidos si se envía vacío', async () => {
    const user = userEvent.setup()
    renderRegistro()

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(screen.getByLabelText(/^run$/i)).toHaveClass('is-invalid')
    expect(screen.getByLabelText(/^nombre$/i)).toHaveClass('is-invalid')
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveClass('is-invalid')
    expect(crearUsuario).not.toHaveBeenCalled()
  })

  it('crea el usuario y redirige a login con datos válidos', async () => {
    const user = userEvent.setup()
    const primeraRegion = Object.keys(regiones)[0]
    const primeraComuna = regiones[primeraRegion][0]
    renderRegistro()

    await user.type(screen.getByLabelText(/^run$/i), '111111111')
    await user.type(screen.getByLabelText(/^nombre$/i), 'Ale')
    await user.type(screen.getByLabelText(/^apellidos$/i), 'Prueba Test')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ale@gmail.com')
    await user.selectOptions(screen.getByLabelText(/^región$/i), primeraRegion)
    await user.selectOptions(screen.getByLabelText(/^comuna$/i), primeraComuna)
    await user.type(screen.getByLabelText(/^dirección$/i), 'Calle Falsa 123')
    await user.type(screen.getByLabelText(/^contraseña$/i), '1234')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), '1234')

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(crearUsuario).toHaveBeenCalledWith(
      expect.objectContaining({
        run: '111111111',
        email: 'ale@gmail.com',
        region: primeraRegion,
        comuna: primeraComuna
      })
    )
    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument()
  })
})