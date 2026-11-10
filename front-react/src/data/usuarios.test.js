import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { actualizarUsuario, autenticar, cerrarSesion, crearUsuario, eliminarUsuario, iniciarSesion, obtenerSesion, obtenerUsuarios } from './usuarios'

const nuevaCuenta = {
  run: '123456785',
  nombre: 'Prueba',
  apellidos: 'Usuario',
  email: 'prueba@gmail.com',
  fechaNacimiento: '',
  region: 'Metropolitana de Santiago',
  comuna: 'Santiago',
  direccion: 'Calle de prueba 10',
  password: 'clave123',
}

describe('almacenamiento de usuarios', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('crea usuarios y evita duplicados de correo y RUN', () => {
    localStorage.setItem('usuarios', '[]')
    const created = crearUsuario(nuevaCuenta)

    expect(obtenerUsuarios()).toHaveLength(1)
    expect(created.rol).toBe('cliente')
    expect(() => crearUsuario(nuevaCuenta)).toThrow('Este correo ya está registrado')
    expect(() => crearUsuario({ ...nuevaCuenta, email: 'otro@duoc.cl' })).toThrow('Este RUN ya está registrado')
  })

  it('actualiza y elimina usuarios por identificador', () => {
    const updated = actualizarUsuario(1, { nombre: 'Nombre actualizado' })

    expect(updated.nombre).toBe('Nombre actualizado')
    expect(actualizarUsuario(999, {})).toBeNull()
    expect(eliminarUsuario(2)).toBe(true)
    expect(eliminarUsuario(999)).toBe(false)
  })

  it('autentica, oculta la contraseña y gestiona la sesión', () => {
    const admin = autenticar('admin@duoc.cl', 'admin')

    expect(admin.rol).toBe('admin')
    expect(admin).not.toHaveProperty('password')
    expect(autenticar('admin@duoc.cl', 'incorrecta')).toBeNull()
    iniciarSesion(admin)
    expect(obtenerSesion()).toEqual(admin)
    cerrarSesion()
    expect(obtenerSesion()).toBeNull()
  })
})
