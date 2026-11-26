import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto'
import { enviarMensajeContacto } from '../services/contenidoApi'

vi.mock('../services/contenidoApi', () => ({
  enviarMensajeContacto: vi.fn()
}))

async function completarNombreYCorreo(user) {
  await user.type(screen.getByLabelText(/nombre completo/i), 'Ale Prueba')
  await user.type(screen.getByLabelText(/correo electrónico/i), 'ale@gmail.com')
}

describe('Contacto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    enviarMensajeContacto.mockResolvedValue({ id: 1 })
  })

  it('no envía el mensaje si el comentario tiene menos de 10 caracteres', async () => {
    const user = userEvent.setup()
    render(<Contacto />)

    await completarNombreYCorreo(user)
    await user.type(screen.getByLabelText(/comentario/i), 'corto')
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(screen.getByLabelText(/comentario/i)).toHaveClass('is-invalid')
    expect(enviarMensajeContacto).not.toHaveBeenCalled()
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

    expect(
      await screen.findByText('Mensaje enviado correctamente.')
    ).toBeInTheDocument()
    expect(enviarMensajeContacto).toHaveBeenCalledTimes(1)
    expect(enviarMensajeContacto).toHaveBeenCalledWith({
      nombre: 'Ale Prueba',
      email: 'ale@gmail.com',
      comentario: 'Quisiera consultar por un libro.'
    })
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('')
    expect(screen.getByLabelText(/comentario/i)).toHaveValue('')
  })

  it('muestra el error del servidor y conserva lo escrito', async () => {
    enviarMensajeContacto.mockRejectedValueOnce(
      new Error('No se pudo conectar con el servidor.')
    )

    const user = userEvent.setup()
    render(<Contacto />)

    await completarNombreYCorreo(user)
    await user.type(
      screen.getByLabelText(/comentario/i),
      'Quisiera consultar por un libro.'
    )
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo conectar con el servidor.'
    )
    expect(
      screen.queryByText('Mensaje enviado correctamente.')
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('Ale Prueba')
    expect(screen.getByLabelText(/comentario/i)).toHaveValue(
      'Quisiera consultar por un libro.'
    )
  })
})