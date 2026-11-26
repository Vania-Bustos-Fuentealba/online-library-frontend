import { describe, it, expect, vi, afterEach } from 'vitest'
import { cargarPosts, cargarPost, enviarMensajeContacto } from './contenidoApi'
import { json, mockApi, session } from '../test/apiHelpers'

afterEach(() => {
  vi.unstubAllGlobals()
})

const post = {
  id: 1,
  title: 'Título',
  summary: 'Resumen',
  imageUrl: 'https://imagenes.test/portada.jpg',
  imageAlt: 'Texto alternativo',
  content: 'Párrafo uno.\n\nPárrafo dos.',
  createdAt: '2026-11-24T22:24:15'
}

describe('Servicio de contenido (blog y contacto)', () => {
  it('lista los posts públicos y adapta los campos', async () => {
    const fetch = mockApi(() => json([post]))

    const posts = await cargarPosts()

    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('/api/v1/posts')
    expect(options.headers.has('Authorization')).toBe(false)
    expect(posts).toEqual([
      {
        id: 1,
        titulo: 'Título',
        resumen: 'Resumen',
        imagen: 'https://imagenes.test/portada.jpg',
        alt: 'Texto alternativo',
        contenido: ['Párrafo uno.', 'Párrafo dos.']
      }
    ])
  })

  it('rechaza una lista inválida del servidor', async () => {
    mockApi(() => json({ dato: 'no es una lista' }))
    await expect(cargarPosts()).rejects.toThrow('lista de artículos inválida')
  })

  it('obtiene un post por id', async () => {
    const fetch = mockApi(() => json(post))

    const blog = await cargarPost('1')

    expect(fetch.mock.calls[0][0]).toBe('/api/v1/posts/1')
    expect(blog.titulo).toBe('Título')
  })

  it('no llama al servidor si el id no es numérico', async () => {
    const fetch = mockApi(() => json(post))

    await expect(cargarPost('abc')).rejects.toThrow('no existe')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('muestra el mensaje del backend cuando el post no existe', async () => {
    mockApi(() =>
      json({ message: 'No existe un post con id 999', status: 404 }, 404)
    )

    await expect(cargarPost('999')).rejects.toThrow('No existe un post con id 999')
  })

  it('envía el contacto normalizado y sin token', async () => {
    session('CLIENT')
    const fetch = mockApi(() => json({ id: 5 }, 201))

    await enviarMensajeContacto({
      nombre: '  Ale  ',
      email: '  ALE@Correo.cl ',
      comentario: ' Hola, necesito ayuda. '
    })

    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('/api/v1/contact')
    expect(options.method).toBe('POST')
    expect(options.headers.has('Authorization')).toBe(false)
    expect(JSON.parse(options.body)).toEqual({
      name: 'Ale',
      email: 'ale@correo.cl',
      message: 'Hola, necesito ayuda.'
    })
  })

  it('muestra los errores de validación del backend', async () => {
    mockApi(() =>
      json({ errors: { email: 'El correo no tiene un formato válido' } }, 400)
    )

    await expect(
      enviarMensajeContacto({ nombre: 'Ale', email: 'x', comentario: 'Hola mundo largo' })
    ).rejects.toThrow('El correo no tiene un formato válido')
  })
})