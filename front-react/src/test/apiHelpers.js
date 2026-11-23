import { vi } from 'vitest'

// Respuestas simuladas solo en pruebas: ninguna se utiliza en la aplicación.
export function json(data, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  })
}
export function mockApi(handler) {
  const fetch = vi.fn(async (url, options) => handler(url, options))
  vi.stubGlobal('fetch', fetch)
  return fetch
}
export function jwt(role = 'ADMIN', extra = {}) {
  const payload = { sub: 'admin@example.com', role, exp: Math.floor(Date.now() / 1000) + 3600, ...extra }
  return `e30.${btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')}.firma-de-prueba`
}
export function session(role = 'ADMIN', extra = {}) {
  localStorage.setItem('token', jwt(role, extra))
  localStorage.setItem('sesion', JSON.stringify({ email: extra.sub ?? 'admin@example.com', rol: role === 'ADMIN' ? 'admin' : 'cliente' }))
}
export const book = { id: 7, title: 'Libro real', author: 'Autora real', price: 12.5, stock: 5 }
export const profile = { id: 42, name: 'Persona real', email: 'persona@example.com', role: 'CLIENT', phone: '912345678', address: 'Dirección real 123' }
