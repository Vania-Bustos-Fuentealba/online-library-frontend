import { describe, expect, it } from 'vitest'
import { validarEmail, validarRun } from './validaciones'

describe('validaciones de formulario', () => {
  it('acepta un RUN chileno válido y rechaza uno incorrecto', () => {
    expect(validarRun('123456785')).toBe(true)
    expect(validarRun('123456780')).toBe(false)
  })

  it('acepta solo correos con formato y dominios permitidos', () => {
    expect(validarEmail('persona@duoc.cl')).toBe(true)
    expect(validarEmail('persona@profesor.duoc.cl')).toBe(true)
    expect(validarEmail('persona@gmail.com')).toBe(true)
    expect(validarEmail('persona@otro.cl')).toBe(false)
    expect(validarEmail('persona@')).toBe(false)
  })
})
