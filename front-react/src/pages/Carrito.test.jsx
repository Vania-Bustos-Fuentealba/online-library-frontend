// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, vi, beforeEach } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { MemoryRouter } from 'react-router-dom'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Carrito from './Carrito'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { useCarrito } from '../hooks/useCarrito'

// Mock: reemplaza el hook del carrito por una versión controlada por la prueba
// Nota de lectura: Define una función corta usada como callback, condición o transformación.
vi.mock('../hooks/useCarrito', () => ({
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  useCarrito: vi.fn()
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}))

// Nota de lectura: Define aplicarCupon, que se utiliza en las instrucciones siguientes.
const aplicarCupon = vi.fn()

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function prepararCarrito() {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  useCarrito.mockReturnValue({
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    carrito: [
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      { id: 1, nombre: 'Alas de sangre', autor: 'Rebecca Yarros', precio: 19990, cantidad: 1, stock: 10, imagen: '/books/Alas_de_sangre.webp' }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    ],
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    cupon: '',
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    cambiarCantidadItem: vi.fn(),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    quitarDelCarrito: vi.fn(),
    // Nota de lectura: Aporta el valor aplicarCupon a la declaración o llamada abierta.
    aplicarCupon,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    quitarCupon: vi.fn(),
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    subtotal: 19990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    descuento: 0,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    envio: 3990,
    // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
    total: 23980
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
function renderCarrito() {
  // Nota de lectura: Entrega el resultado de la función o la interfaz que debe renderizar React.
  return render(
    // Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript.
    <MemoryRouter>
      {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
      <Carrito />
    {/* Nota de lectura: Estructura visual JSX. Las expresiones entre llaves insertan datos o condiciones de JavaScript. */}
    </MemoryRouter>
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  )
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Carrito (formulario de cupón)', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  beforeEach(() => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.clearAllMocks()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    prepararCarrito()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra un mensaje de error cuando el cupón no es válido', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    aplicarCupon.mockReturnValue({ valido: false, mensaje: 'El cupón ingresado no es válido.' })
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    renderCarrito()

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/cupón de descuento/i), 'FALSO99')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /aplicar/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(aplicarCupon).toHaveBeenCalledWith('FALSO99')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('status')).toHaveTextContent('El cupón ingresado no es válido.')
    // Si el cupón es inválido, el texto escrito se mantiene para poder corregirlo
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/cupón de descuento/i)).toHaveValue('FALSO99')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('aplica un cupón válido, muestra la confirmación y limpia el campo', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    aplicarCupon.mockReturnValue({ valido: true, mensaje: 'Cupón DUOC10 aplicado: 10% de descuento.' })
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    renderCarrito()

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/cupón de descuento/i), 'duoc10')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /aplicar/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(aplicarCupon).toHaveBeenCalledWith('duoc10')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByRole('status')).toHaveTextContent('Cupón DUOC10 aplicado: 10% de descuento.')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/cupón de descuento/i)).toHaveValue('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})