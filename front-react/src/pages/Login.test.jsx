import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from './Login'
import { obtenerSesion } from '../data/usuarios'
import { mockApi, json, jwt } from '../test/apiHelpers'
afterEach(() => vi.unstubAllGlobals())
function show() {
  render(<MemoryRouter initialEntries={['/login']}><Routes>
    <Route path="/login" element={<Login />} /><Route path="/admin" element={<p>Panel admin</p>} /><Route path="/productos" element={<p>Catálogo</p>} />
  </Routes></MemoryRouter>)
}
function fill() {
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'admin@example.com' } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'clave123' } })
}
describe('Login real', () => {
  it.each([['ADMIN', 'Panel admin'], ['CLIENT', 'Catálogo']])('inicia sesión %s por Gateway', async (role, destination) => {
    const fetch = mockApi(() => json({ token: jwt(role), email: 'admin@example.com', role }))
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await screen.findByText(destination)).toBeInTheDocument()
    expect(obtenerSesion().rol).toBe(role === 'ADMIN' ? 'admin' : 'cliente')
    expect(fetch.mock.calls[0][0]).toBe('/api/auth/login')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ email: 'admin@example.com', password: 'clave123' })
  })
  it('informa credenciales incorrectas y no crea sesión', async () => {
    mockApi(() => json({ details: 'Credenciales incorrectas' }, 400))
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas')
    expect(obtenerSesion()).toBeNull()
  })
  it.each([{ email: 'admin@example.com', role: 'ADMIN' }, { token: jwt(), email: 'otra@example.com', role: 'ADMIN' }])('rechaza respuesta incompleta o incoherente', async (response) => {
    mockApi(() => json(response))
    show(); fill()
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(obtenerSesion()).toBeNull()
  })
})
