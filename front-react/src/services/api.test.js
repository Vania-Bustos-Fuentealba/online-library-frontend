import { describe, it, expect, vi, afterEach } from 'vitest'
import { solicitar } from './api'
import { json, mockApi, session } from '../test/apiHelpers'

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
describe('Cliente HTTP del Gateway', () => {
  it('serializa JSON y envía Bearer por /api', async () => {
    session()
    const fetch = mockApi(() => json({ id: 3 }))
    await solicitar('/books', { method: 'POST', body: { title: 'Libro' } })
    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('/api/books')
    expect(options.headers.get('Authorization')).toBe(`Bearer ${localStorage.getItem('token')}`)
    expect(options.headers.get('Content-Type')).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ title: 'Libro' })
  })
  it('no adjunta el token al login público', async () => {
    session()
    const fetch = mockApi(() => json({}))
    await solicitar('/auth/login', { autenticar: false })
    expect(fetch.mock.calls[0][1].headers.has('Authorization')).toBe(false)
  })
  it('un 401 limpia y notifica inmediatamente a las pantallas', async () => {
    session()
    const listener = vi.fn()
    window.addEventListener('sesion-cambiada', listener)
    mockApi(() => json({}, 401))
    await expect(solicitar('/users')).rejects.toThrow('Inicia sesión')
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('sesion')).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
    window.removeEventListener('sesion-cambiada', listener)
  })
  it('un 401 de una petición antigua no borra una sesión nueva', async () => {
    session()
    mockApi(() => { localStorage.setItem('token', 'nuevo'); return json({}, 401) })
    await expect(solicitar('/users')).rejects.toThrow()
    expect(localStorage.getItem('token')).toBe('nuevo')
  })
  it('un 403 conserva la sesión y explica el permiso faltante', async () => {
    session()
    mockApi(() => json({}, 403))
    await expect(solicitar('/users')).rejects.toThrow('permisos')
    expect(localStorage.getItem('token')).not.toBeNull()
  })
  it('muestra errores de validación de Spring', async () => {
    mockApi(() => json({ errors: { title: 'El título es obligatorio' } }, 400))
    await expect(solicitar('/books')).rejects.toThrow('El título es obligatorio')
  })
  it('muestra conflictos de negocio y oculta detalles internos 500', async () => {
    mockApi(() => json({ details: 'El correo ya está registrado' }, 400))
    await expect(solicitar('/auth/register')).rejects.toThrow('El correo ya está registrado')
    mockApi(() => json({ details: 'SQL secreto' }, 500))
    await expect(solicitar('/books')).rejects.toThrow('operación (500)')
  })
  it('acepta un DELETE sin cuerpo y rechaza HTML inesperado', async () => {
    mockApi(() => json(null, 204))
    await expect(solicitar('/books/7', { method: 'DELETE' })).resolves.toBeNull()
    mockApi(() => new Response('<html>Vite</html>'))
    await expect(solicitar('/books')).rejects.toThrow('Gateway')
  })
  it('explica los fallos de red', async () => {
    mockApi(() => { throw new TypeError('Failed to fetch') })
    await expect(solicitar('/books')).rejects.toThrow('conectar')
  })
  it('termina la espera si el Gateway no responde', async () => {
    vi.useFakeTimers()
    mockApi((url, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError')))
    }))
    const result = expect(solicitar('/books')).rejects.toThrow('tardó demasiado')
    await vi.advanceTimersByTimeAsync(15000)
    await result
  })
})
