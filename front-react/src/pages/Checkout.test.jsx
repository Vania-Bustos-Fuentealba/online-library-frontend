import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Checkout from './Checkout'
import { useCarrito } from '../hooks/useCarrito'

// Mock: reemplaza el hook del carrito por una versión controlada por la prueba
vi.mock('../hooks/useCarrito', () => ({
  useCarrito: vi.fn()
}))

const vaciarCarrito = vi.fn()

function prepararCarrito() {
  useCarrito.mockReturnValue({
    carrito: [{ id: 1, nombre: 'Alas de sangre', precio: 19990, cantidad: 1 }],
    subtotal: 19990,
    descuento: 0,
    envio: 3990,
    total: 23980,
    vaciarCarrito
  })
}

function renderCheckout() {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  )
}

describe('Checkout (formulario de despacho)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    prepararCarrito()
  })

  it('muestra errores de validación y no confirma el pedido si el formulario está vacío', async () => {
    const user = userEvent.setup()
    renderCheckout()

    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(screen.getByText('Ingresa tu nombre completo.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu dirección de despacho.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa tu comuna.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona un método de pago.')
    expect(vaciarCarrito).not.toHaveBeenCalled()
    expect(screen.queryByText('¡Pedido registrado!')).not.toBeInTheDocument()
  })

  it('confirma el pedido, vacía el carrito y muestra el resumen con datos válidos', async () => {
    const user = userEvent.setup()
    renderCheckout()

    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@gmail.com')
    await user.type(screen.getByLabelText(/dirección/i), 'Av. Siempre Viva 742')
    await user.type(screen.getByLabelText(/comuna/i), 'Santiago')
    await user.click(screen.getByLabelText(/webpay/i))
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    expect(vaciarCarrito).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('¡Pedido registrado!')).toBeInTheDocument()
    expect(screen.getByText(/Gracias por tu compra, Ana Pérez/)).toBeInTheDocument()
    expect(screen.getByText(/ana@gmail\.com/)).toBeInTheDocument()
  })
})