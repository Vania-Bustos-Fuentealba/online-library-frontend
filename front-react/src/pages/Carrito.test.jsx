import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Carrito from './Carrito'
import { useCarrito } from '../hooks/useCarrito'

// Mock: reemplaza el hook del carrito por una versión controlada por la prueba
vi.mock('../hooks/useCarrito', () => ({
  useCarrito: vi.fn()
}))

const aplicarCupon = vi.fn()

function prepararCarrito() {
  useCarrito.mockReturnValue({
    carrito: [
      { id: 1, nombre: 'Alas de sangre', autor: 'Rebecca Yarros', precio: 19990, cantidad: 1, stock: 10, imagen: '/books/Alas_de_sangre.webp' }
    ],
    cupon: '',
    cambiarCantidadItem: vi.fn(),
    quitarDelCarrito: vi.fn(),
    aplicarCupon,
    quitarCupon: vi.fn(),
    subtotal: 19990,
    descuento: 0,
    envio: 3990,
    total: 23980
  })
}

function renderCarrito() {
  return render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  )
}

describe('Carrito (formulario de cupón)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    prepararCarrito()
  })

  it('muestra un mensaje de error cuando el cupón no es válido', async () => {
    aplicarCupon.mockReturnValue({ valido: false, mensaje: 'El cupón ingresado no es válido.' })
    const user = userEvent.setup()
    renderCarrito()

    await user.type(screen.getByLabelText(/cupón de descuento/i), 'FALSO99')
    await user.click(screen.getByRole('button', { name: /aplicar/i }))

    expect(aplicarCupon).toHaveBeenCalledWith('FALSO99')
    expect(screen.getByRole('status')).toHaveTextContent('El cupón ingresado no es válido.')
    // Si el cupón es inválido, el texto escrito se mantiene para poder corregirlo
    expect(screen.getByLabelText(/cupón de descuento/i)).toHaveValue('FALSO99')
  })

  it('aplica un cupón válido, muestra la confirmación y limpia el campo', async () => {
    aplicarCupon.mockReturnValue({ valido: true, mensaje: 'Cupón DUOC10 aplicado: 10% de descuento.' })
    const user = userEvent.setup()
    renderCarrito()

    await user.type(screen.getByLabelText(/cupón de descuento/i), 'duoc10')
    await user.click(screen.getByRole('button', { name: /aplicar/i }))

    expect(aplicarCupon).toHaveBeenCalledWith('duoc10')
    expect(screen.getByRole('status')).toHaveTextContent('Cupón DUOC10 aplicado: 10% de descuento.')
    expect(screen.getByLabelText(/cupón de descuento/i)).toHaveValue('')
  })
})