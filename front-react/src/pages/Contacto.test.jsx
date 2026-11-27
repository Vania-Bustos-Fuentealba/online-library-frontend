// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, vi, beforeEach } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { render, screen } from '@testing-library/react'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import userEvent from '@testing-library/user-event'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import Contacto from './Contacto'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { enviarMensajeContacto } from '../services/contenidoApi'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
vi.mock('../services/contenidoApi', () => ({
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  enviarMensajeContacto: vi.fn()
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}))

// Nota de lectura: Define una función o método con los parámetros que necesita esta parte del flujo.
async function completarNombreYCorreo(user) {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await user.type(screen.getByLabelText(/nombre completo/i), 'Ale Prueba')
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  await user.type(screen.getByLabelText(/correo electrónico/i), 'ale@gmail.com')
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Contacto', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  beforeEach(() => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    vi.clearAllMocks()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    enviarMensajeContacto.mockResolvedValue({ id: 1 })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no envía el mensaje si el comentario tiene menos de 10 caracteres', async () => {
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<Contacto />)

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await completarNombreYCorreo(user)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(screen.getByLabelText(/comentario/i), 'corto')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/comentario/i)).toHaveClass('is-invalid')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(enviarMensajeContacto).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('envía el mensaje, muestra confirmación y limpia el formulario', async () => {
    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<Contacto />)

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await completarNombreYCorreo(user)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      screen.getByLabelText(/comentario/i),
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Quisiera consultar por un libro.'
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      await screen.findByText('Mensaje enviado correctamente.')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    ).toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(enviarMensajeContacto).toHaveBeenCalledTimes(1)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(enviarMensajeContacto).toHaveBeenCalledWith({
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      nombre: 'Ale Prueba',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      email: 'ale@gmail.com',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      comentario: 'Quisiera consultar por un libro.'
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    })
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/comentario/i)).toHaveValue('')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra el error del servidor y conserva lo escrito', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    enviarMensajeContacto.mockRejectedValueOnce(
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      new Error('No se pudo conectar con el servidor.')
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Define user, que se utiliza en las instrucciones siguientes.
    const user = userEvent.setup()
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    render(<Contacto />)

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await completarNombreYCorreo(user)
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.type(
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      screen.getByLabelText(/comentario/i),
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Quisiera consultar por un libro.'
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(await screen.findByRole('alert')).toHaveTextContent(
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'No se pudo conectar con el servidor.'
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      screen.queryByText('Mensaje enviado correctamente.')
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    ).not.toBeInTheDocument()
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('Ale Prueba')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(screen.getByLabelText(/comentario/i)).toHaveValue(
      // Nota de lectura: Completa los argumentos o la expresión iniciada en la línea anterior.
      'Quisiera consultar por un libro.'
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})