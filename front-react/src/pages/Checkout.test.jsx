// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, vi, beforeEach } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Checkout from './Checkout'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { crearPedido } from '../services/tiendaApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
vi.mock('../services/tiendaApi', () => ({ crearPedido: vi.fn() }))

// Mock: reemplaza el hook del carrito por una versión controlada por la prueba
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
vi.mock('../hooks/useCarrito', () => ({
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  useCarrito: vi.fn()
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}))

// Nota de lectura: Define vaciarCarrito, que se utiliza en las instrucciones siguientes.
const vaciarCarrito = vi.fn()

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function prepararCarrito() {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  useCarrito.mockReturnValue({
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    carrito: [{ id: 1, nombre: 'Alas de sangre', precio: 19990, cantidad: 1 }],
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    subtotal: 19990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descuento: 0,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    envio: 3990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    total: 23980,
    // Nota de lectura: Aporta el valor vaciarCarrito a la declaración o llamada abierta.
    vaciarCarrito
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function renderCheckout() {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return render(
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <MemoryRouter>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <Checkout />
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </MemoryRouter>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Checkout (formulario de despacho)', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  beforeEach(() => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.clearAllMocks()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('CLIENT')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    crearPedido.mockResolvedValue({ id: 42, cliente: 'Ana Pérez', correo: 'ana@gmail.com', total: 23980, estado: 'PENDIENTE_PAGO' })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    prepararCarrito()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra errores de validación y no confirma el pedido si el formulario está vacío', async () => {
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    renderCheckout()

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Ingresa tu nombre completo.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Ingresa tu dirección de despacho.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText('Ingresa tu comuna.')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona un método de pago.')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(vaciarCarrito).not.toHaveBeenCalled()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.queryByText('¡Pedido registrado!')).not.toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('confirma el pedido, vacía el carrito y muestra el resumen con datos válidos', async () => {
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    renderCheckout()

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@gmail.com')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/dirección/i), 'Av. Siempre Viva 742')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/comuna/i), 'Santiago')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByLabelText(/webpay/i))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByText('¡Pedido registrado!')).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(vaciarCarrito).toHaveBeenCalledTimes(1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(crearPedido).toHaveBeenCalledWith(expect.objectContaining({
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      items: [{ libroId: 1, cantidad: 1 }], metodoPago: 'webpay'
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    }), expect.any(String))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText(/No se ha realizado ningún cobro/)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText(/Gracias por tu compra, Ana Pérez/)).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByText(/ana@gmail\.com/)).toBeInTheDocument()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('solicita sesión y conserva el carrito para visitantes', () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    localStorage.clear()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    renderCheckout()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/login')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(vaciarCarrito).not.toHaveBeenCalled()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(crearPedido).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('conserva el formulario y la clave del intento si falla la respuesta', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    crearPedido.mockRejectedValue(new Error('No se pudo conectar con el servidor.'))
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    renderCheckout()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@gmail.com')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/^dirección$/i), 'Av. Siempre Viva 742')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/^comuna$/i), 'Santiago')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByLabelText(/transferencia/i))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(vaciarCarrito).not.toHaveBeenCalled()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('Ana Pérez')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /confirmar pedido/i }))
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(crearPedido.mock.calls[1][1]).toBe(crearPedido.mock.calls[0][1])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})
