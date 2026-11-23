import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Registro from './Registro'
import { mockApi, json, profile } from '../test/apiHelpers'
afterEach(() => vi.unstubAllGlobals())
function show() {
  render(<MemoryRouter initialEntries={['/registro']}><Routes><Route path="/registro" element={<Registro />} /><Route path="/login" element={<p>Volver a iniciar sesión</p>} /></Routes></MemoryRouter>)
}
describe('Registro compatible con Auth', () => {
  it('no envía campos vacíos', async () => {
    const fetch = mockApi(() => json(profile))
    show()
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(fetch).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Nombre completo')).toHaveClass('is-invalid')
  })
  it('registra con campos reales sin asignarse un rol', async () => {
    const fetch = mockApi(() => json(profile, 201))
    show()
    for (const [label, value] of [['Nombre completo', 'Persona real'], ['Correo electrónico', profile.email], ['Contraseña', 'clave123'], ['Confirmar contraseña', 'clave123']])
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByText('Volver a iniciar sesión')).toBeInTheDocument()
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/register')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ name: 'Persona real', email: profile.email, password: 'clave123' })
    expect(localStorage.getItem('token')).toBeNull()
  })
})
