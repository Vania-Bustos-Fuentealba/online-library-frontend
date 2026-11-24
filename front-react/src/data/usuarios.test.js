import { describe, it, expect, vi } from 'vitest'
import { iniciarSesion, obtenerSesion, cerrarSesion } from './usuarios'
import { jwt, session } from '../test/apiHelpers'

describe('Sesión JWT, sin autenticación simulada', () => {
  it('persiste tras una nueva lectura sin guardar contraseñas', () => {
    localStorage.setItem('token', jwt())
    iniciarSesion({ email: 'admin@example.com', password: 'no guardar' })
    expect(obtenerSesion()).toMatchObject({ email: 'admin@example.com', rol: 'admin' })
    expect(localStorage.getItem('sesion')).not.toContain('no guardar')
  })
  it('no acepta un rol administrativo modificado en localStorage', () => {
    session('CLIENT')
    localStorage.setItem('sesion', JSON.stringify({ email: 'admin@example.com', rol: 'admin' }))
    expect(obtenerSesion().rol).toBe('cliente')
  })
  it.each([jwt('ADMIN', { exp: 1 }), jwt('SELLER'), 'invalido', jwt('ADMIN', { sub: '' })])('rechaza token inválido %s', (token) => {
    session()
    localStorage.setItem('token', token)
    expect(obtenerSesion()).toBeNull()
  })
  it('rechaza una identidad diferente de la del token', () => {
    session()
    expect(() => iniciarSesion({ email: 'otra@example.com' })).toThrow('token')
    expect(localStorage.getItem('token')).toBeNull()
  })
  it('cierra sesión y publica el cambio', () => {
    session()
    const listener = vi.fn()
    window.addEventListener('sesion-cambiada', listener)
    cerrarSesion()
    expect(obtenerSesion()).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
    window.removeEventListener('sesion-cambiada', listener)
  })
})
