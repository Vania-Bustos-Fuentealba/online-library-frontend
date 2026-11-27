// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { describe, it, expect, vi, afterEach } from 'vitest'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { cargarPosts, cargarPost, enviarMensajeContacto } from './contenidoApi'
// Nota de lectura: Importa las dependencias indicadas para utilizarlas en este archivo.
import { json, mockApi, session } from '../test/apiHelpers'

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
afterEach(() => {
  // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
  vi.unstubAllGlobals()
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})

// Nota de lectura: Define post, que se utiliza en las instrucciones siguientes.
const post = {
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  id: 1,
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  title: 'Título',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  summary: 'Resumen',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  imageUrl: 'https://imagenes.test/portada.jpg',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  imageAlt: 'Texto alternativo',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  content: 'Párrafo uno.\n\nPárrafo dos.',
  // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
  createdAt: '2026-11-24T22:24:15'
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
}

// Nota de lectura: Define una función corta usada como callback, condición o transformación.
describe('Servicio de contenido (blog y contacto)', () => {
  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('lista los posts públicos y adapta los campos', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json([post]))

    // Nota de lectura: Define posts, que se utiliza en las instrucciones siguientes.
    const posts = await cargarPosts()

    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const [url, options] = fetch.mock.calls[0]
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(url).toBe('/api/v1/posts')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(options.headers.has('Authorization')).toBe(false)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(posts).toEqual([
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      {
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        id: 1,
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        titulo: 'Título',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        resumen: 'Resumen',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        imagen: 'https://imagenes.test/portada.jpg',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        alt: 'Texto alternativo',
        // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
        contenido: ['Párrafo uno.', 'Párrafo dos.']
      // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
      }
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    ])
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('rechaza una lista inválida del servidor', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() => json({ dato: 'no es una lista' }))
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await expect(cargarPosts()).rejects.toThrow('lista de artículos inválida')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('obtiene un post por id', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(post))

    // Nota de lectura: Define blog, que se utiliza en las instrucciones siguientes.
    const blog = await cargarPost('1')

    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch.mock.calls[0][0]).toBe('/api/v1/posts/1')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(blog.titulo).toBe('Título')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('no llama al servidor si el id no es numérico', async () => {
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json(post))

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await expect(cargarPost('abc')).rejects.toThrow('no existe')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(fetch).not.toHaveBeenCalled()
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra el mensaje del backend cuando el post no existe', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() =>
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      json({ message: 'No existe un post con id 999', status: 404 }, 404)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await expect(cargarPost('999')).rejects.toThrow('No existe un post con id 999')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('envía el contacto normalizado y sin token', async () => {
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    session('CLIENT')
    // Nota de lectura: Define fetch, que se utiliza en las instrucciones siguientes.
    const fetch = mockApi(() => json({ id: 5 }, 201))

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await enviarMensajeContacto({
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      nombre: '  Ale  ',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      email: '  ALE@Correo.cl ',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      comentario: ' Hola, necesito ayuda. '
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    })

    // Nota de lectura: Declara una referencia o dato utilizado por las líneas siguientes.
    const [url, options] = fetch.mock.calls[0]
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(url).toBe('/api/v1/contact')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(options.method).toBe('POST')
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(options.headers.has('Authorization')).toBe(false)
    // Nota de lectura: Comprueba el resultado esperado; una diferencia hace fallar esta prueba.
    expect(JSON.parse(options.body)).toEqual({
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      name: 'Ale',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      email: 'ale@correo.cl',
      // Nota de lectura: Establece el valor de la propiedad indicada dentro de un objeto de datos o configuración.
      message: 'Hola, necesito ayuda.'
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    })
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })

  // Nota de lectura: Define una función corta usada como callback, condición o transformación.
  it('muestra los errores de validación del backend', async () => {
    // Nota de lectura: Define una función corta usada como callback, condición o transformación.
    mockApi(() =>
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      json({ errors: { email: 'El correo no tiene un formato válido' } }, 400)
    // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
    )

    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    await expect(
      // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
      enviarMensajeContacto({ nombre: 'Ale', email: 'x', comentario: 'Hola mundo largo' })
    // Nota de lectura: Invoca la operación indicada con los argumentos de este bloque.
    ).rejects.toThrow('El correo no tiene un formato válido')
  // Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
  })
// Nota de lectura: Cierra o delimita la expresión, bloque o elemento abierto en las líneas anteriores.
})