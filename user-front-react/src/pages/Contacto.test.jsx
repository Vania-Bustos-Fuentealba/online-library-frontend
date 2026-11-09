import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto'
import { crearMensaje } from '../data/mensajes'

vi.mock('../data/mensajes', () => ({
  crearMensaje: vi.fn()
}))

async function completarNombreYCorreo(user) {
  await user.type(screen.getByLabelText(/nombre completo/i), 'Ale Prueba')
  await user.type(screen.getByLabelText(/correo electrónico/i), 'ale@gmail.com')
}

describe('Contacto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no envía el mensaje si el comentario tiene menos de 10 caracteres', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await completarNombreYCorreo(user)
    await user.type(screen.getByLabelText(/comentario/i), 'corto')
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(screen.getByLabelText(/comentario/i)).toHaveClass('is-invalid')
    expect(crearMensaje).not.toHaveBeenCalled()
  })

  it('envía el mensaje, muestra confirmación y limpia el formulario', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await completarNombreYCorreo(user)
    await user.type(
      screen.getByLabelText(/comentario/i),
      'Quisiera consultar por un libro.'
    )
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(crearMensaje).toHaveBeenCalledTimes(1)
    expect(
      screen.getByText('Mensaje enviado correctamente.')
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('')
    expect(screen.getByLabelText(/comentario/i)).toHaveValue('')
  })
})